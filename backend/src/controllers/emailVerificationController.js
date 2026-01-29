/**
 * Email Verification Controller
 * 
 * Handles email verification flow
 */

import { getUserByEmail, updateUser, getUserByEmailAnyRole } from '../services/userService.js';
import { USER_STATUS } from '../models/user.js';
import { isConfigured, getContainer } from '../config/cosmosClient.js';

/**
 * GET /api/auth/verify-email
 * Verify email address using token
 * 
 * Query params:
 * - email: string (required)
 * - token: string (required)
 */
export async function verifyEmail(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
      message: 'COSMOS_ENDPOINT and COSMOS_KEY environment variables are required',
    });
  }

  try {
    const { email, token } = req.query;

    if (!email || !token) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Email and token are required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    // Decode URL-encoded token (Express should auto-decode, but ensure it's decoded)
    const normalizedToken = decodeURIComponent(token);

    console.log(` [VERIFY-EMAIL] Verification attempt:`, {
      email: normalizedEmail,
      tokenReceived: normalizedToken.substring(0, 50) + '...',
      tokenLength: normalizedToken.length,
    });

    // First, check the emailVerifications container - this is the source of truth for tokens sent
    let verificationRecord = null;
    let userTenantId = null;
    try {
      const verificationContainer = getContainer('emailVerifications');
      if (verificationContainer) {
        // Enable cross-partition query to find verification record
        const { resources: verifications } = await verificationContainer.items.query({
          query: 'SELECT * FROM c WHERE c.email = @email AND c.token = @token',
          parameters: [
            { name: '@email', value: normalizedEmail },
            { name: '@token', value: normalizedToken },
          ],
        }, {
          enableCrossPartitionQuery: true
        }).fetchAll();

        if (verifications.length > 0) {
          verificationRecord = verifications[0];
          userTenantId = verificationRecord.tenantId;
          console.log(` [VERIFY-EMAIL] Found verification record for ${normalizedEmail}`);
        }
      }
    } catch (error) {
      console.warn('Error checking verification container:', error.message);
    }

    // Find user by email across all role containers
    // We don't know the tenantId, so we need to search across all tenants
    // This is a known limitation - in production, consider maintaining an email-to-tenant mapping
    let user = null;
    const { getContainerNameByRole, USER_ROLES } = await import('../models/user.js');
    const roles = [USER_ROLES.CLIENT_ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER];
    
    // If we found a verification record, use its tenantId to find the user more efficiently
    if (userTenantId) {
      for (const role of roles) {
        try {
          const container = getContainer(getContainerNameByRole(role));
          if (container) {
            try {
              const { resource } = await container.item(userTenantId, userTenantId).read();
              // This won't work - we need the user ID, not tenantId
              // Let's search by email with tenantId filter instead
            } catch (error) {
              // Continue
            }
          }
        } catch (error) {
          // Continue
        }
      }
    }
    
    // Search each role container
    for (const role of roles) {
      try {
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
            // If we have a verification record, prefer the user with matching tenantId
            if (userTenantId) {
              const matchingUser = resources.find(u => u.tenantId === userTenantId);
              if (matchingUser) {
                user = matchingUser;
                console.log(` [VERIFY-EMAIL] Found user with matching tenantId: ${user.id}`);
                break;
              }
            }
            // If multiple users, prefer the one that's not verified (most recent sign-up)
            if (resources.length > 1) {
              console.warn(`  [VERIFY-EMAIL] Multiple users found with email ${normalizedEmail} in ${role} container: ${resources.length}`);
              // Prefer unverified user (most recent sign-up)
              const unverifiedUser = resources.find(u => !u.emailVerified);
              if (unverifiedUser) {
                user = unverifiedUser;
                console.log(` [VERIFY-EMAIL] Using unverified user: ${user.id}`);
                break;
              }
            }
            // Otherwise, use the first one found
            if (!user) {
              user = resources[0];
              console.log(` [VERIFY-EMAIL] Using first user found: ${user.id}`);
              break;
            }
          }
        }
      } catch (error) {
        // Continue searching other containers
        console.warn(`Error searching ${role} container:`, error.message);
      }
    }

    if (!user) {
      console.log(` [VERIFY-EMAIL] User not found: ${normalizedEmail}`);
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No account found with this email address',
      });
    }

    // Check if already verified
    if (user.emailVerified) {
      console.log(` [VERIFY-EMAIL] Email already verified: ${normalizedEmail}`);
      return res.status(200).json({
        success: true,
        message: 'Email already verified',
        data: {
          email: user.email,
          emailVerified: true,
        },
      });
    }

    // Verify token matches - check both user record and verification record
    const tokenMatches = user.verificationToken === normalizedToken || 
                        (verificationRecord && verificationRecord.token === normalizedToken);

    // Log token comparison for debugging
    console.log(` [VERIFY-EMAIL] Token comparison:`, {
      storedToken: user.verificationToken ? user.verificationToken.substring(0, 50) + '...' : 'null',
      verificationRecordToken: verificationRecord ? verificationRecord.token.substring(0, 50) + '...' : 'null',
      receivedToken: normalizedToken.substring(0, 50) + '...',
      tokensMatch: tokenMatches,
      storedTokenLength: user.verificationToken ? user.verificationToken.length : 0,
      receivedTokenLength: normalizedToken.length,
    });

    // Verify token matches
    if (!tokenMatches) {
      console.log(` [VERIFY-EMAIL] Token mismatch for ${normalizedEmail}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid token',
        message: 'The verification token is invalid or expired',
      });
    }

    // Check if token expired - check verification record first, then user record
    const expiresAt = verificationRecord?.expiresAt || user.verificationTokenExpiresAt;
    if (expiresAt) {
      const expirationDate = new Date(expiresAt);
      if (expirationDate < new Date()) {
        return res.status(400).json({
          success: false,
          error: 'Token expired',
          message: 'The verification token has expired. Please request a new verification email.',
        });
      }
    }

    // Update user: mark as verified and activate account
    // Ensure role is set correctly (email/password users are CLIENT_ADMIN)
    const userRole = user.role || USER_ROLES.CLIENT_ADMIN;
    
    console.log(`🔄 [VERIFY-EMAIL] Updating user: ${user.id}, tenant: ${user.tenantId}, role: ${userRole}`);
    
    try {
      await updateUser(user.id, user.tenantId, {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
        status: USER_STATUS.ACTIVE, // Activate account after verification
      }, user.id, userRole);
      console.log(` [VERIFY-EMAIL] User updated successfully: ${normalizedEmail}`);
    } catch (updateError) {
      console.error(` [VERIFY-EMAIL] Failed to update user:`, updateError.message);
      throw updateError;
    }

    // Update verification record if it exists
    try {
      const verificationContainer = getContainer('emailVerifications');
      if (verificationContainer) {
        const { resources: verifications } = await verificationContainer.items.query({
          query: 'SELECT * FROM c WHERE c.email = @email AND c.token = @token',
          parameters: [
            { name: '@email', value: normalizedEmail },
            { name: '@token', value: normalizedToken },
          ],
        }, {
          enableCrossPartitionQuery: true
        }).fetchAll();

        if (verifications.length > 0) {
          const verification = verifications[0];
          await verificationContainer.item(verification.id, verification.tenantId).replace({
            ...verification,
            verifiedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }
    } catch (error) {
      console.warn('Failed to update verification record:', error);
      // Continue even if verification container doesn't exist
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      data: {
        email: user.email,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Verification failed',
      message: error.message,
    });
  }
}

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 * 
 * Body:
 * - email: string (required)
 */
export async function resendVerificationEmail(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'CosmosDB not configured',
    });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user across all role containers
    let user = null;
    const { getContainerNameByRole, USER_ROLES } = await import('../models/user.js');
    const roles = [USER_ROLES.CLIENT_ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.USER];
    
    // Search each role container
    for (const role of roles) {
      try {
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
            user = resources[0];
            break; // Found user, stop searching
          }
        }
      } catch (error) {
        // Continue searching other containers
        console.warn(`Error searching ${role} container:`, error.message);
      }
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'No account found with this email address',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Already verified',
        message: 'This email is already verified',
      });
    }

    // Generate new verification token
    const { randomUUID } = await import('crypto');
    const verificationToken = `verify_${Date.now()}_${randomUUID().replace(/-/g, '')}`;
    const verificationExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Update user with new token
    await updateUser(user.id, user.tenantId, {
      verificationToken,
      verificationTokenExpiresAt,
    }, user.id, user.role);

    // Send verification email
    const { sendVerificationEmail } = await import('../services/emailService.js');
    try {
      await sendVerificationEmail(normalizedEmail, verificationToken, user.displayName);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        success: false,
        error: 'Failed to send email',
        message: 'Could not send verification email. Please try again later.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to resend verification email',
      message: error.message,
    });
  }
}
