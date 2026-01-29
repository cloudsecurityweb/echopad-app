/**
 * Authentication Controller
 * 
 * Handles sign-in and sign-up with Microsoft Entra ID
 */

import { randomUUID } from 'crypto';
import { createUserRecord, getUserByEmail, getUserById, getUserByEmailAnyRole, getUserByOIDAnyRole } from '../services/userService.js';
import { createOrg, getOrgById } from '../services/organizationService.js';
import { USER_ROLES, USER_STATUS } from '../models/user.js';
import { ORG_TYPES, ORG_STATUS } from '../models/organization.js';
import { isConfigured } from '../config/cosmosClient.js';

/**
 * Map Entra ID roles to backend roles
 * Returns null if no roles are present (to preserve existing DB role)
 */
function mapEntraRoleToBackendRole(entraRoles) {
  if (!entraRoles || !Array.isArray(entraRoles) || entraRoles.length === 0) {
    return null; // Return null when no roles - don't override existing DB role
  }

  // Check for SuperAdmin first (highest privilege)
  if (entraRoles.includes('SuperAdmin')) {
    return USER_ROLES.SUPER_ADMIN;
  }

  // Check for ClientAdmin
  if (entraRoles.includes('ClientAdmin')) {
    return USER_ROLES.CLIENT_ADMIN;
  }

  // Check for UserAdmin
  if (entraRoles.includes('UserAdmin')) {
    return USER_ROLES.USER;
  }

  // If roles array exists but doesn't match known roles, return null
  // This preserves existing DB role rather than defaulting
  return null;
}

/**
 * POST /api/auth/sign-in
 * Sign in with existing account (verify token and return user profile)
 */
export async function signIn(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
      message: 'COSMOS_ENDPOINT and COSMOS_KEY environment variables are required',
    });
  }

  try {
    const { oid, tid, email, name, roles, entraRoleId } = req.auth;

    if (!oid || !tid || !email) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token',
        message: 'Token missing required claims (oid, tid, email)',
      });
    }

    // OID-FIRST LOOKUP: Use OID to find user across all containers
    // This is more efficient and doesn't require guessing the role first
    console.log(` [SIGN-IN] OID-first lookup for user: ${oid.substring(0, 8)}...`);
    let user = await getUserByOIDAnyRole(oid, tid);
    
    // If not found by OID, fallback to email search (for edge cases)
    if (!user) {
      console.log(` [SIGN-IN] User not found by OID, trying email lookup: ${email}`);
      user = await getUserByEmailAnyRole(email, tid);
    }

    // Map Entra roles to backend role (for user creation and role override)
    const backendRole = mapEntraRoleToBackendRole(roles);

    if (!user) {
      // User doesn't exist, create a basic user record
      // SuperAdmin must be pre-configured in Entra ID - if they don't have the role, deny access
      if (backendRole === USER_ROLES.SUPER_ADMIN && !roles.includes('SuperAdmin')) {
        return res.status(403).json({
          success: false,
          error: 'Access denied',
          message: 'SuperAdmin access requires pre-configuration in Entra ID. Please contact your administrator.',
        });
      }
      
      // For new users without token roles, default to CLIENT_ADMIN
      // New sign-ins/sign-ups should be ClientAdmin, not UserAdmin
      // UserAdmin users are invited by ClientAdmin after they sign up
      const newUserRole = backendRole !== null ? backendRole : USER_ROLES.CLIENT_ADMIN;
      
      console.log(' [SIGN-IN] Creating new user with OID as user ID:', {
        oid: oid.substring(0, 8) + '...',
        email: email,
        tokenRoles: roles,
        backendRole: backendRole,
        newUserRole: newUserRole,
        entraRoleId: entraRoleId,
        note: 'Using OID as user ID (same as SuperAdmin)',
      });
      
      // CRITICAL: Always use OID as user ID for ClientAdmin (same as SuperAdmin)
      // This ensures consistent identity across all user roles
      user = await createUserRecord({
        id: oid, // OID is the unique identifier (same for SuperAdmin and ClientAdmin)
        tenantId: tid,
        email: email.toLowerCase().trim(),
        displayName: name || email.split('@')[0],
        role: newUserRole, // Use token role if present, otherwise default to CLIENT_ADMIN
        status: USER_STATUS.ACTIVE,
        organizationId: null, // Will be set if user belongs to an org
        emailVerified: true, // OAuth users are auto-verified
        entraRoleId: entraRoleId || null, // Store Entra ID role UUID
      }, oid);
      
      console.log(' [SIGN-IN] User created with OID:', {
        id: user.id.substring(0, 8) + '...',
        role: user.role,
        email: user.email,
        note: user.id === oid ? 'OID matches user ID ✓' : 'WARNING: OID mismatch!',
      });
    } else {
      // Only override DB role if token has roles (Entra ID is source of truth when roles are present)
      // If token has no roles, preserve existing DB role (for invited UserAdmin users)
      const originalDbRole = user.role;
      
      if (backendRole !== null) {
        // Token has roles - override DB role with token role
        user.role = backendRole;
        if (originalDbRole !== backendRole) {
          console.log(` Sign-in role override: DB role (${originalDbRole}) → Token role (${backendRole}) from Entra ID`);
        }
      } else {
        // Token has no roles - preserve existing DB role
        console.log(`ℹ Sign-in preserving DB role (no token roles): ${originalDbRole}`);
      }
      
      // Update user info if needed (e.g., name changed in Entra)
      if (user.displayName !== name || user.email !== email.toLowerCase().trim()) {
        // Note: We could update here, but for now just return existing user
        // Full update logic can be added if needed
      }
    }

    // Get organization if user belongs to one
    let organization = null;
    if (user.organizationId) {
      organization = await getOrgById(user.organizationId, tid);
    }

    console.log('🔑 [SIGN-IN] User authenticated:', {
      oid: oid.substring(0, 8) + '...',
      userId: user.id.substring(0, 8) + '...',
      email: user.email,
      role: user.role,
      tokenRoles: roles,
      backendRole: backendRole,
      organizationId: user.organizationId,
      roleSource: 'Entra ID token (overridden)',
      oidConsistent: user.id === oid ? '✓ OID used as user ID' : ' OID mismatch'
    });

    res.status(200).json({
      success: true,
      message: 'Sign in successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          organizationId: user.organizationId,
        },
        organization: organization ? {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          status: organization.status,
        } : null,
        roles: roles || [], // Entra roles
        backendRole: user.role, // Mapped backend role
      },
    });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({
      success: false,
      error: 'Sign in failed',
      message: error.message,
    });
  }
}

/**
 * POST /api/auth/sign-up
 * Sign up new organization and user
 * 
 * Body:
 * - organizationName: string (required)
 * - organizerName: string (required)
 * - email: string (must match token email)
 */
export async function signUp(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
      message: 'COSMOS_ENDPOINT and COSMOS_KEY environment variables are required',
    });
  }

  try {
    const { oid, tid, email, name, roles } = req.auth;
    const { organizationName, organizerName, email: providedEmail } = req.body;

    if (!oid || !tid || !email) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token',
        message: 'Token missing required claims (oid, tid, email)',
      });
    }

    // Validate email matches token (if provided)
    const tokenEmail = email.toLowerCase().trim();
    const bodyEmail = providedEmail ? providedEmail.toLowerCase().trim() : null;
    
    if (bodyEmail && bodyEmail !== tokenEmail) {
      return res.status(400).json({
        success: false,
        error: 'Email mismatch',
        message: 'Provided email does not match authenticated email',
      });
    }

    // OID-FIRST LOOKUP: Use OID to find user across all containers
    // This is more efficient and doesn't require guessing the role first
    console.log(` [SIGN-UP] OID-first lookup for user: ${oid.substring(0, 8)}...`);
    let user = await getUserByOIDAnyRole(oid, tid);
    
    // If not found by OID, fallback to email search (for edge cases)
    if (!user) {
      console.log(` [SIGN-UP] User not found by OID, trying email lookup: ${tokenEmail}`);
      user = await getUserByEmailAnyRole(tokenEmail, tid);
    }

    // Map Entra roles to backend role (for role override and user creation)
    const backendRole = mapEntraRoleToBackendRole(roles);
    
    if (user) {
      // User already exists - only override role if token has roles
      // If token has no roles, preserve existing DB role (for invited UserAdmin users)
      const originalDbRole = user.role;
      
      if (backendRole !== null) {
        // Token has roles - override DB role with token role (Entra ID is source of truth)
        user.role = backendRole;
        if (originalDbRole !== backendRole) {
          console.log(` Sign-up role override: DB role (${originalDbRole}) → Token role (${backendRole}) from Entra ID`);
        }
      } else {
        // Token has no roles - preserve existing DB role
        console.log(`ℹ Sign-up preserving DB role (no token roles): ${originalDbRole}`);
      }
      
      let organization = null;
      if (user.organizationId) {
        organization = await getOrgById(user.organizationId, tid);
      }

      console.log(' [SIGN-UP] User already exists:', {
        email: user.email,
        role: user.role,
        tokenRoles: roles,
        organizationId: user.organizationId
      });

      return res.status(200).json({
        success: true,
        message: 'User already exists',
        data: {
          user: {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            role: user.role, // Token role if present, otherwise preserved DB role
            status: user.status,
            organizationId: user.organizationId,
          },
          organization: organization ? {
            id: organization.id,
            name: organization.name,
            type: organization.type,
            status: organization.status,
          } : null,
          roles: roles || [],
          backendRole: user.role, // Token role if present, otherwise preserved DB role
        },
      });
    }

    // SuperAdmin cannot sign up - must be pre-configured in Entra ID
    if (backendRole === USER_ROLES.SUPER_ADMIN) {
      return res.status(403).json({
        success: false,
        error: 'Sign up not allowed',
        message: 'SuperAdmin accounts must be pre-configured in Entra ID. Please contact your administrator.',
      });
    }

    // Organization and organizer name are optional for OAuth sign-ups
    // If provided, create organization; otherwise, user can set it later in profile
    let organization = null;
    let orgId = null;
    
    if (organizationName && organizerName) {
      // Create new organization if details are provided
      orgId = `org_${randomUUID()}`;
      organization = await createOrg({
        id: orgId,
        tenantId: tid,
        name: organizationName.trim(),
        type: ORG_TYPES.CLIENT, // New sign-ups are client organizations
        status: ORG_STATUS.ACTIVE,
      }, oid);
    }

    // Create user with ClientAdmin role (first user in org is admin)
    // New sign-ups should be ClientAdmin, not UserAdmin
    // UserAdmin users are invited by ClientAdmin after they sign up
    // Only SuperAdmin from token can override this
    const userRole = backendRole === USER_ROLES.SUPER_ADMIN 
      ? USER_ROLES.SUPER_ADMIN 
      : USER_ROLES.CLIENT_ADMIN;

    const { entraRoleId } = req.auth;
    
    console.log(' [SIGN-UP] Creating new user with OID as user ID:', {
      oid: oid.substring(0, 8) + '...',
      email: tokenEmail,
      tokenRoles: roles,
      userRole: userRole,
      organizationId: orgId,
      note: 'Using OID as user ID (same as SuperAdmin)',
    });
    
    // CRITICAL: Always use OID as user ID for ClientAdmin (same as SuperAdmin)
    // This ensures consistent identity across all user roles
    user = await createUserRecord({
      id: oid, // OID is the unique identifier (same for SuperAdmin and ClientAdmin)
      tenantId: tid,
      email: tokenEmail,
      displayName: organizerName ? organizerName.trim() : (name || tokenEmail.split('@')[0]),
      role: userRole,
      status: USER_STATUS.ACTIVE,
      organizationId: orgId, // null if organization not created
      emailVerified: true, // OAuth users are auto-verified
      entraRoleId: entraRoleId || null, // Store Entra ID role UUID
    }, oid);

    console.log(' [SIGN-UP] User registered with OID:', {
      id: user.id.substring(0, 8) + '...',
      email: user.email,
      role: user.role,
      tokenRoles: roles,
      organizationId: user.organizationId,
      note: user.id === oid ? 'OID matches user ID ✓' : 'WARNING: OID mismatch!',
    });

    res.status(201).json({
      success: true,
      message: 'Sign up successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          organizationId: user.organizationId,
        },
        organization: organization ? {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          status: organization.status,
        } : null,
        roles: roles || [],
        backendRole: user.role,
      },
    });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({
      success: false,
      error: 'Sign up failed',
      message: error.message,
    });
  }
}

/**
 * GET /api/auth/me
 * Get current user profile (requires authentication)
 */
export async function getCurrentUser(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
      message: 'COSMOS_ENDPOINT and COSMOS_KEY environment variables are required',
    });
  }

  try {
    // Use req.currentUser if available (from attachUserFromDb middleware)
    // Otherwise fall back to loading from DB (for Google auth or other cases)
    let user = req.currentUser;
    const tid = req.auth?.tid || req.currentUser?.tenantId;

    if (!user) {
      // Fallback: try to load user (for non-Microsoft auth or if middleware didn't run)
      const { oid, roles } = req.auth || {};
      if (!oid || !tid) {
        return res.status(400).json({
          success: false,
          error: 'Invalid token',
          message: 'Token missing required claims (oid, tid)',
        });
      }

      // OID-FIRST LOOKUP: Use OID to find user across all containers
      // This is more efficient and doesn't require guessing the role first
      console.log(` [CURRENT-USER] OID-first lookup for user: ${oid.substring(0, 8)}...`);
      user = await getUserByOIDAnyRole(oid, tid);
      
      // If not found by OID, fallback to email search (for edge cases)
      if (!user && req.auth?.email) {
        console.log(` [CURRENT-USER] User not found by OID, trying email lookup: ${req.auth.email}`);
        user = await getUserByEmailAnyRole(req.auth.email, tid);
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found',
          message: 'User profile not found. Please sign up first.',
        });
      }
      
      // If user was loaded directly (not from middleware), ensure role is set
      // When token roles are empty, keep database role
      if (!user.role) {
        console.error(` [CURRENT-USER] CRITICAL: User ${user.email} has no role in database`);
        // Default to 'user' as fallback
        user.role = 'user';
        console.warn('    Defaulting to "user" role as fallback');
      }
    }

    // Upgrade @cloudsecurityweb.com users to SUPER_ADMIN if they're not already
    // This applies to both OAuth and email/password users
    const normalizedEmail = user.email?.toLowerCase();
    if (normalizedEmail && normalizedEmail.endsWith('@cloudsecurityweb.com') && user.role !== USER_ROLES.SUPER_ADMIN) {
      console.log(`🔐 [CURRENT-USER] Upgrading @cloudsecurityweb.com user to SUPER_ADMIN: ${normalizedEmail}`);
      try {
        const { updateUserRole } = await import('../services/userService.js');
        const updatedUser = await updateUserRole(user.id, user.tenantId, user.role, USER_ROLES.SUPER_ADMIN, user.id);
        user = updatedUser; // Use updated user for response
        console.log(` [CURRENT-USER] User upgraded to SUPER_ADMIN: ${normalizedEmail}`);
      } catch (error) {
        console.error(` [CURRENT-USER] Failed to upgrade user to SUPER_ADMIN:`, error.message);
        // Continue with existing role if upgrade fails
      }
    }

    // Get organization if user belongs to one (SUPER_ADMIN users don't need organizations)
    let organization = null;
    if (user.organizationId && user.role !== USER_ROLES.SUPER_ADMIN) {
      organization = await getOrgById(user.organizationId, user.tenantId);
    }

    // Log role source for debugging
    const roleSource = req.currentUser ? 'middleware (attachUserFromDb)' : 'direct lookup';
    console.log('👤 [CURRENT-USER] Returning user profile:', {
      email: user.email,
      role: user.role,
      roleSource: roleSource,
      tokenRoles: req.auth?.roles || [],
      organizationId: user.organizationId,
      note: req.auth?.roles?.length === 0 ? 'Using database role (no token roles)' : 'Token roles available'
    });

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role,
          status: user.status,
          organizationId: user.organizationId,
        },
        organization: organization ? {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          status: organization.status,
        } : null,
        roles: req.auth?.roles || [],
        backendRole: user.role,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
      message: error.message,
    });
  }
}
