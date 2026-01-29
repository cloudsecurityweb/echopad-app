/**
 * Invitation Controller
 * 
 * Handles invitation validation and acceptance
 */

import { getInviteByToken, acceptInvitation, createInvitation } from '../services/inviteService.js';
import { isConfigured, getContainer } from '../config/cosmosClient.js';
import { INVITE_TYPES } from '../models/invite.js';
import { generateMagicToken } from '../middleware/magicAuth.js';
import { randomUUID } from 'crypto';

/**
 * GET /api/invites/validate
 * Validate invitation token and email
 * 
 * Query params:
 * - token: string (required)
 * - email: string (required)
 */
export async function validateInvitation(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
    });
  }

  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Token and email are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find invitation by token and email
    // Note: Token should be unique enough, but we also match email for security
    // If we have tenantId from auth, use it for better isolation
    const tenantId = req.auth?.tid || req.currentUser?.tenantId;
    const invitesContainer = getContainer('invites');
    if (!invitesContainer) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
      });
    }

    // Build query with tenantId if available
    let query = 'SELECT * FROM c WHERE c.token = @token AND c.email = @email';
    const parameters = [
      { name: '@token', value: token },
      { name: '@email', value: normalizedEmail },
    ];

    if (tenantId) {
      query += ' AND c.tenantId = @tenantId';
      parameters.push({ name: '@tenantId', value: tenantId });
    }

    const { resources } = await invitesContainer.items.query({
      query,
      parameters,
    }).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
        message: 'Invalid invitation token or email',
      });
    }

    const invite = resources[0];

    // Check if invitation is still pending
    if (invite.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Invitation not available',
        message: `This invitation has been ${invite.status}`,
      });
    }

    // Check if expired
    if (invite.expiresAt) {
      const expiresAt = new Date(invite.expiresAt);
      if (expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Invitation expired',
          message: 'This invitation has expired',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: {
        email: invite.email,
        role: invite.role,
        organizationId: invite.organizationId,
        expiresAt: invite.expiresAt,
        type: invite.type || 'user', // Include invite type
      },
    });
  } catch (error) {
    console.error('Invitation validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Validation failed',
      message: error.message,
    });
  }
}

/**
 * POST /api/invites/accept
 * Accept invitation and create user account
 * 
 * Body:
 * - token: string (required)
 * - email: string (required)
 * - userId: string (optional, for OAuth users - oid from token)
 * - displayName: string (optional)
 * - authMethod: string (required) - 'microsoft', 'google', or 'email'
 * 
 * For Microsoft Entra ID authentication:
 * - Requires UserAdmin app role in Entra ID token
 * - Validates that authenticated user has UserAdmin role before accepting
 */
export async function acceptInvitationRoute(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
    });
  }

  try {
    const { token, email, userId, displayName, authMethod } = req.body;

    if (!token || !email || !authMethod) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Token, email, and authMethod are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // For Microsoft Entra ID authentication, validate UserAdmin role
    if (authMethod === 'microsoft') {
      // Require authentication for Microsoft auth
      if (!req.auth || !req.auth.oid) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required',
          message: 'Microsoft authentication requires a valid Entra ID token. Please sign in first.',
        });
      }

      // Validate UserAdmin role in token
      const entraRoles = req.auth.roles || [];
      if (!entraRoles.includes('UserAdmin')) {
        return res.status(403).json({
          success: false,
          error: 'Role required',
          message: 'UserAdmin role is required to accept invitations. Please contact your administrator to assign the UserAdmin role in Microsoft Entra ID.',
          userRoles: entraRoles,
          requiredRole: 'UserAdmin',
        });
      }

      // Enforce email match: verify authenticated email matches invite email
      const authEmail = req.auth.email?.toLowerCase().trim();
      if (authEmail && authEmail !== normalizedEmail) {
        return res.status(403).json({
          success: false,
          error: 'Email mismatch',
          message: `Authenticated email (${authEmail}) does not match invitation email (${normalizedEmail})`,
        });
      }
    } else if (authMethod === 'google') {
      // For Google auth, just verify email match if available
      const authEmail = req.auth?.email?.toLowerCase().trim();
      if (authEmail && authEmail !== normalizedEmail) {
        return res.status(403).json({
          success: false,
          error: 'Email mismatch',
          message: `Authenticated email (${authEmail}) does not match invitation email (${normalizedEmail})`,
        });
      }
    }

    // Find invitation - use tenantId from invite if available, or from auth
    const invitesContainer = getContainer('invites');
    if (!invitesContainer) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
      });
    }

    // First, find invite by token and email (token should be unique)
    let query = 'SELECT * FROM c WHERE c.token = @token AND c.email = @email';
    const parameters = [
      { name: '@token', value: token },
      { name: '@email', value: normalizedEmail },
    ];

    // If we have tenantId from auth, use it for better isolation
    const authTenantId = req.auth?.tid;
    if (authTenantId) {
      query += ' AND c.tenantId = @tenantId';
      parameters.push({ name: '@tenantId', value: authTenantId });
    }

    const { resources } = await invitesContainer.items.query({
      query,
      parameters,
    }).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
        message: 'Invalid invitation token or email',
      });
    }

    const invite = resources[0];

    // Additional email match check using invite email
    if (normalizedEmail !== invite.email.toLowerCase().trim()) {
      return res.status(403).json({
        success: false,
        error: 'Email mismatch',
        message: 'Provided email does not match invitation email',
      });
    }

    // Validate invitation
    if (invite.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Invitation not available',
        message: `This invitation has been ${invite.status}`,
      });
    }

    if (invite.expiresAt) {
      const expiresAt = new Date(invite.expiresAt);
      if (expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Invitation expired',
          message: 'This invitation has expired',
        });
      }
    }

    // Generate user ID if not provided (for email/password users)
    // For Microsoft OAuth, ALWAYS use the oid from token (same as SuperAdmin/ClientAdmin)
    // This ensures consistent identity: OID is the unique identifier for all Microsoft-authenticated users
    const finalUserId = authMethod === 'microsoft' && req.auth?.oid
      ? req.auth.oid // For Microsoft auth, always use OID (same as SuperAdmin/ClientAdmin)
      : (userId || `user_${randomUUID()}`); // For other auth methods, use provided userId or generate
    
    if (authMethod === 'microsoft' && req.auth?.oid) {
      console.log(' [INVITATION] Accepting invitation with OID as user ID:', {
        oid: req.auth.oid.substring(0, 8) + '...',
        email: normalizedEmail,
        role: invite.role,
        note: 'Using OID as user ID (consistent with SuperAdmin/ClientAdmin)',
      });
    }

    // Accept invitation (creates user)
    const user = await acceptInvitation(token, invite.tenantId, {
      id: finalUserId,
      displayName: displayName || normalizedEmail.split('@')[0],
      authMethod: authMethod, // Pass auth method to determine if email should be auto-verified
    });
    
    if (authMethod === 'microsoft' && req.auth?.oid) {
      console.log(' [INVITATION] User created with OID:', {
        id: user.id.substring(0, 8) + '...',
        email: user.email,
        role: user.role,
        note: user.id === req.auth.oid ? 'OID matches user ID ✓' : 'WARNING: OID mismatch!',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          organizationId: user.organizationId,
        },
        backendRole: user.role,
      },
    });
  } catch (error) {
    console.error('Invitation acceptance error:', error);
    res.status(500).json({
      success: false,
      error: 'Acceptance failed',
      message: error.message,
    });
  }
}

/**
 * POST /api/invites/user
 * Create a user invitation (ClientAdmin only)
 * Sends invitation email to a user to join the ClientAdmin's organization
 * 
 * Body:
 * - email: string (required)
 * - productId: string (optional)
 */
export async function createUserInvite(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
    });
  }

  try {
    const { email, productId } = req.body;

    // Validate required fields
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Email is required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const normalizedEmail = email.toLowerCase().trim();
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Invalid email address',
      });
    }

    // Get tenant ID from authenticated user
    const tenantId = req.auth?.tid || req.currentUser?.tenantId;
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Tenant ID not available',
      });
    }

    // Get actor user ID and organization ID
    const actorUserId = req.currentUser?.id || req.auth?.oid;
    if (!actorUserId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User ID not available',
      });
    }

    // Get organization ID from current user (ClientAdmin's organization)
    const organizationId = req.currentUser?.organizationId;
    if (!organizationId) {
      return res.status(400).json({
        success: false,
        error: 'Organization not found',
        message: 'ClientAdmin must be associated with an organization',
      });
    }

    // Check if user with this email already exists
    const { getUserByEmailAnyRole } = await import('../services/userService.js');
    const existingUser = await getUserByEmailAnyRole(normalizedEmail, tenantId);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'A user with this email already exists',
      });
    }

    // Create invitation
    const inviteId = `inv_${Date.now()}_${randomUUID().replace(/-/g, '')}`;
    const inviteToken = `inv_${Date.now()}_${randomUUID().replace(/-/g, '')}`;
    
    const invite = await createInvitation({
      id: inviteId,
      tenantId,
      email: normalizedEmail,
      role: 'user', // Always 'user' role for ClientAdmin invitations
      token: inviteToken,
      createdBy: actorUserId,
      organizationId: organizationId, // Use ClientAdmin's organization
      type: INVITE_TYPES.USER,
      productId: productId ? productId.trim() : null, // Optional product ID
    }, actorUserId);

    res.status(201).json({
      success: true,
      message: 'User invitation created and sent successfully',
      data: {
        invite: {
          id: invite.id,
          email: invite.email,
          organizationId: invite.organizationId,
          expiresAt: invite.expiresAt,
        },
      },
    });
  } catch (error) {
    console.error('Create user invite error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user invitation',
      message: error.message,
    });
  }
}

/**
 * POST /api/invites/accept-magic
 * Accept invitation via magic link (no authentication required)
 * Creates user account and returns magic session token
 * 
 * Body:
 * - token: string (required)
 * - email: string (required)
 */
export async function acceptMagicInvitation(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
    });
  }

  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Token and email are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find invitation by token and email
    const invitesContainer = getContainer('invites');
    if (!invitesContainer) {
      return res.status(503).json({
        success: false,
        error: 'Database not available',
      });
    }

    // Query for invite by token and email
    const { resources } = await invitesContainer.items.query({
      query: 'SELECT * FROM c WHERE c.token = @token AND c.email = @email',
      parameters: [
        { name: '@token', value: token },
        { name: '@email', value: normalizedEmail },
      ],
    }).fetchAll();

    if (resources.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Invitation not found',
        message: 'Invalid invitation token or email',
      });
    }

    const invite = resources[0];

    // Validate invitation
    if (invite.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Invitation not available',
        message: `This invitation has been ${invite.status}`,
      });
    }

    // Check if expired
    if (invite.expiresAt) {
      const expiresAt = new Date(invite.expiresAt);
      if (expiresAt < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Invitation expired',
          message: 'This invitation has expired',
        });
      }
    }

    // Check if user already exists
    const { getUserByEmailAnyRole } = await import('../services/userService.js');
    const existingUser = await getUserByEmailAnyRole(normalizedEmail, invite.tenantId);
    if (existingUser) {
      // User already exists - mark invite as accepted and return existing user
      await invitesContainer.item(invite.id, invite.tenantId).replace({
        ...invite,
        status: 'accepted',
        acceptedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Generate magic token for existing user
      const sessionToken = await generateMagicToken({
        userId: existingUser.id,
        tenantId: existingUser.tenantId,
        email: existingUser.email,
        role: existingUser.role,
      });

      return res.status(200).json({
        success: true,
        message: 'Invitation already accepted',
        data: {
          sessionToken,
          user: {
            id: existingUser.id,
            email: existingUser.email,
            displayName: existingUser.displayName,
            role: existingUser.role,
            status: existingUser.status,
            organizationId: existingUser.organizationId,
          },
        },
      });
    }

    // Generate user ID for magic link user
    const userId = `user_${randomUUID()}`;

    // Accept invitation (creates user)
    const user = await acceptInvitation(token, invite.tenantId, {
      id: userId,
      displayName: normalizedEmail.split('@')[0],
      authMethod: 'magic', // Mark as magic link user
    });

    // Generate magic session token
    const sessionToken = await generateMagicToken({
      userId: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: 'Invitation accepted successfully',
      data: {
        sessionToken,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          organizationId: user.organizationId,
        },
      },
    });
  } catch (error) {
    console.error('Magic invitation acceptance error:', error);
    res.status(500).json({
      success: false,
      error: 'Acceptance failed',
      message: error.message,
    });
  }
}
