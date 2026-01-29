/**
 * Password Authentication Controller
 * 
 * Handles email/password sign-up and sign-in
 */

import { randomUUID } from 'crypto';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../services/passwordAuth.js';
import { createUserRecord, getUserByEmail, getUserById, getUserByEmailAnyRole } from '../services/userService.js';
import { createOrg } from '../services/organizationService.js';
import { sendVerificationEmail } from '../services/emailService.js';
import { USER_ROLES, USER_STATUS, getContainerNameByRole } from '../models/user.js';
import { ORG_TYPES, ORG_STATUS } from '../models/organization.js';
import { isConfigured } from '../config/cosmosClient.js';
import { getContainer } from '../config/cosmosClient.js';

const VERIFICATION_CONTAINER = 'emailVerifications';

/**
 * Generate verification token
 */
function generateVerificationToken() {
  return `verify_${Date.now()}_${randomUUID().replace(/-/g, '')}`;
}

/**
 * POST /api/auth/sign-up-email
 * Sign up with email and password
 * 
 * Body:
 * - organizationName: string (required)
 * - organizerName: string (required)
 * - email: string (required)
 * - password: string (required)
 */
export async function signUpEmail(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
      message: 'COSMOS_ENDPOINT and COSMOS_KEY environment variables are required',
    });
  }

  try {
    const { organizationName, organizerName, email, password } = req.body;

    // Validate required fields
    if (!organizationName || !organizerName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'organizationName, organizerName, email, and password are required',
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Password validation failed',
        message: passwordValidation.errors.join(', '),
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if user already exists across ALL tenants (prevent duplicate sign-ups)
    // Email/password users are CLIENT_ADMIN, search across all tenants
    console.log(` [SIGN-UP] Checking for existing user with email: ${normalizedEmail}`);
    
    let existingUser = null;
    const roles = [USER_ROLES.CLIENT_ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER];
    
    for (const role of roles) {
      try {
        const container = getContainer(getContainerNameByRole(role));
        if (container) {
          // Enable cross-partition query to search across all tenants
          const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.email = @email',
            parameters: [{ name: '@email', value: normalizedEmail }],
          }, {
            enableCrossPartitionQuery: true
          }).fetchAll();
          
          if (resources.length > 0) {
            existingUser = resources[0];
            console.log(`  [SIGN-UP] User already exists: ${normalizedEmail} (found ${resources.length} user(s))`);
            break;
          }
        }
      } catch (error) {
        console.warn(`Error checking ${role} container for duplicates:`, error.message);
      }
    }
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
        message: 'An account with this email already exists. Please sign in instead.',
      });
    }
    
    console.log(` [SIGN-UP] No existing user found, proceeding with sign-up: ${normalizedEmail}`);
    
    // Determine user role based on email domain
    // @cloudsecurityweb.com emails get SUPER_ADMIN role
    const isSuperAdmin = normalizedEmail.endsWith('@cloudsecurityweb.com');
    const userRole = isSuperAdmin ? USER_ROLES.SUPER_ADMIN : USER_ROLES.CLIENT_ADMIN;
    
    if (isSuperAdmin) {
      console.log(`🔐 [SIGN-UP] Assigning SUPER_ADMIN role to ${normalizedEmail}`);
    }
    
    const tenantId = `tenant_${randomUUID()}`; // Generate tenant ID for new organization

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // Create organization (only for CLIENT_ADMIN users, SUPER_ADMIN doesn't need one)
    let orgId = null;
    let organization = null;
    if (!isSuperAdmin) {
      orgId = `org_${randomUUID()}`;
      organization = await createOrg({
        id: orgId,
        tenantId,
        name: organizationName.trim(),
        type: ORG_TYPES.CLIENT,
        status: ORG_STATUS.ACTIVE,
      }, 'system_signup');
    } else {
      // SUPER_ADMIN users don't need an organization
      console.log(`🔐 [SIGN-UP] Skipping organization creation for SUPER_ADMIN: ${normalizedEmail}`);
    }

    // Create user with emailVerified: false
    // @cloudsecurityweb.com emails get SUPER_ADMIN role, others get CLIENT_ADMIN
    const userId = `user_${randomUUID()}`;
    const user = await createUserRecord({
      id: userId,
      tenantId,
      email: normalizedEmail,
      displayName: organizerName.trim(),
      role: userRole,
      status: USER_STATUS.PENDING, // Pending until email verified
      organizationId: orgId, // null for SUPER_ADMIN
      passwordHash,
      emailVerified: false,
      verificationToken,
      verificationTokenExpiresAt: verificationExpiresAt,
      entraRoleId: null, // Email/password users don't have Entra ID roles
    }, userId);

    // Store verification token in separate container (optional, for tracking)
    try {
      const verificationContainer = getContainer(VERIFICATION_CONTAINER);
      if (verificationContainer) {
        await verificationContainer.items.create({
          id: `verify_${randomUUID()}`,
          tenantId,
          email: normalizedEmail,
          token: verificationToken,
          expiresAt: verificationExpiresAt,
          verifiedAt: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.warn('Failed to store verification token:', error);
      // Continue even if verification container doesn't exist
    }

    // Send verification email
    try {
      await sendVerificationEmail(normalizedEmail, verificationToken, organizerName);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Don't fail sign-up if email fails, but log it
    }

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please check your email to verify your account.',
      data: {
        userId: user.id,
        email: user.email,
        emailVerified: user.emailVerified,
        organizationId: organization.id,
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
 * POST /api/auth/sign-in-email
 * Sign in with email and password
 * 
 * Body:
 * - email: string (required)
 * - password: string (required)
 */
export async function signInEmail(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
      message: 'COSMOS_ENDPOINT and COSMOS_KEY environment variables are required',
    });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user by email across all role containers
    // Note: This searches across all tenants - in production, you might want to scope by tenant
    // For email/password users, they are typically CLIENT_ADMIN, but we search all containers to be safe
    // We'll search each role container since we don't know the tenantId or role
    let user = null;
    const roles = [USER_ROLES.CLIENT_ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER];
    
    // Try CLIENT_ADMIN first (most common for email/password users)
    for (const role of roles) {
      try {
        // We need tenantId to query, but we don't have it
        // For now, search across all tenants (known limitation)
        // In production, consider maintaining an email-to-tenant mapping
        const container = getContainer(getContainerNameByRole(role));
        if (container) {
          // Enable cross-partition query since we don't know the tenantId
          const { resources } = await container.items.query({
            query: 'SELECT * FROM c WHERE c.email = @email',
            parameters: [{ name: '@email', value: normalizedEmail }],
          }, {
            enableCrossPartitionQuery: true
          }).fetchAll();
          
          if (resources.length > 0) {
            // If multiple users found, try to find the correct one by password
            if (resources.length > 1) {
              console.warn(`  [SIGN-IN] Multiple users found with email ${normalizedEmail} in ${role} container: ${resources.length}`);
              
              // Try each user until we find one with matching password
              // Prefer verified and active users first
              const sortedUsers = resources.sort((a, b) => {
                // Prefer verified users
                if (a.emailVerified && !b.emailVerified) return -1;
                if (!a.emailVerified && b.emailVerified) return 1;
                // Prefer active users
                if (a.status === USER_STATUS.ACTIVE && b.status !== USER_STATUS.ACTIVE) return -1;
                if (a.status !== USER_STATUS.ACTIVE && b.status === USER_STATUS.ACTIVE) return 1;
                // Prefer newer users (by createdAt if available)
                if (a.createdAt && b.createdAt) {
                  return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0;
              });
              
              // Try each user's password
              for (const candidateUser of sortedUsers) {
                if (candidateUser.passwordHash) {
                  const passwordValid = await verifyPassword(password, candidateUser.passwordHash);
                  if (passwordValid) {
                    user = candidateUser;
                    user._passwordAlreadyVerified = true; // Mark as already verified
                    console.log(` [SIGN-IN] Found matching password for user: ${user.id}, tenant: ${user.tenantId}`);
                    break;
                  }
                }
              }
              
              // If we found a matching user, break out of role loop
              if (user) {
                break;
              }
            } else {
              // Single user found
              user = resources[0];
              console.log(` [SIGN-IN] Found user in ${role} container: ${user.id}, tenant: ${user.tenantId}`);
              break; // Found user, stop searching
            }
          }
        }
      } catch (error) {
        // Continue searching other containers
        console.warn(`Error searching ${role} container:`, error.message);
      }
    }

    if (!user) {
      console.log(` [SIGN-IN] User not found: ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Invalid email or password',
      });
    }

    console.log(` [SIGN-IN] User found: ${normalizedEmail}, status: ${user.status}, emailVerified: ${user.emailVerified}, hasPassword: ${!!user.passwordHash}`);

    // Check if user has password (email/password user)
    if (!user.passwordHash) {
      console.log(` [SIGN-IN] User has no password hash: ${normalizedEmail}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid authentication method',
        message: 'This account uses OAuth authentication. Please sign in with Microsoft or Google.',
      });
    }

    // Verify password (only if we haven't already verified it when checking multiple users)
    // If user was found from multiple users check, password was already verified
    let passwordValid = false;
    if (user._passwordAlreadyVerified) {
      passwordValid = true;
      console.log(` [SIGN-IN] Password already verified during user lookup: ${normalizedEmail}`);
    } else {
      console.log(` [SIGN-IN] Verifying password for: ${normalizedEmail}`);
      console.log(` [SIGN-IN] Password hash exists: ${!!user.passwordHash}, hash length: ${user.passwordHash ? user.passwordHash.length : 0}`);
      
      passwordValid = await verifyPassword(password, user.passwordHash);
      if (!passwordValid) {
        console.log(` [SIGN-IN] Password verification failed: ${normalizedEmail}`);
        console.log(` [SIGN-IN] User details: id=${user.id}, tenantId=${user.tenantId}, role=${user.role}, status=${user.status}`);
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials',
          message: 'Invalid email or password',
        });
      }
      console.log(` [SIGN-IN] Password verified for: ${normalizedEmail}`);
    }

    // Check if email is verified
    if (!user.emailVerified) {
      console.log(` [SIGN-IN] Email not verified: ${normalizedEmail}`);
      return res.status(403).json({
        success: false,
        error: 'Email not verified',
        message: 'Please verify your email address before signing in. Check your inbox for the verification link.',
      });
    }

    // Check if user is active
    if (user.status !== USER_STATUS.ACTIVE) {
      console.log(` [SIGN-IN] User not active: ${normalizedEmail}, status: ${user.status}`);
      return res.status(403).json({
        success: false,
        error: 'Account not active',
        message: `Your account is ${user.status}. Please contact support.`,
      });
    }

    console.log(` [SIGN-IN] All checks passed for: ${normalizedEmail}`);

    // Upgrade @cloudsecurityweb.com users to SUPER_ADMIN if they're not already
    if (normalizedEmail.endsWith('@cloudsecurityweb.com') && user.role !== USER_ROLES.SUPER_ADMIN) {
      console.log(`🔐 [SIGN-IN] Upgrading @cloudsecurityweb.com user to SUPER_ADMIN: ${normalizedEmail}`);
      try {
        const { updateUserRole } = await import('../services/userService.js');
        const updatedUser = await updateUserRole(user.id, user.tenantId, user.role, USER_ROLES.SUPER_ADMIN, user.id);
        user = updatedUser; // Use updated user for response
        console.log(` [SIGN-IN] User upgraded to SUPER_ADMIN: ${normalizedEmail}`);
      } catch (error) {
        console.error(` [SIGN-IN] Failed to upgrade user to SUPER_ADMIN:`, error.message);
        // Continue with existing role if upgrade fails
      }
    }

    // Get organization if user belongs to one (SUPER_ADMIN users don't need organizations)
    let organization = null;
    if (user.organizationId && user.role !== USER_ROLES.SUPER_ADMIN) {
      const orgContainer = getContainer('organizations');
      if (orgContainer) {
        try {
          const { resource: org } = await orgContainer.item(user.organizationId, user.tenantId).read();
          organization = org;
        } catch (error) {
          // Organization not found, continue without it
        }
      }
    }

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
        backendRole: user.role,
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
