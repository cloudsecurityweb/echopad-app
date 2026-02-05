/**
 * Invite Service
 * 
 * Handles invitation creation, validation, and acceptance with tenant isolation
 */

import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import { createInvite, validateInvite, isInviteExpired, INVITE_STATUS } from "../models/invite.js";
import { createAuditEvent, AUDIT_EVENT_TYPES } from "../models/auditEvent.js";
import { createUser, USER_STATUS } from "../models/user.js";
import { getUserByEmailAnyRole } from "./userService.js";

const CONTAINER_NAME = "invites";
const AUDIT_CONTAINER_NAME = "auditEvents";

/**
 * Generate a unique invitation token
 * @returns {string} Invitation token
 */
function generateInviteToken() {
  return `inv_${Date.now()}_${randomUUID().replace(/-/g, "")}`;
}

/**
 * Create a new invitation
 * @param {Object} inviteData - Invite data
 * @param {string} actorUserId - User ID creating the invite
 * @param {Object} [options] - Optional: { tempPassword } to include in email for sign-in
 * @returns {Promise<Object>} Created invite
 */
export async function createInvitation(inviteData, actorUserId, options = {}) {
  const validation = validateInvite({
    ...inviteData,
    token: inviteData.token || generateInviteToken(),
  });
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  
  const invite = createInvite({
    ...inviteData,
    token: inviteData.token || generateInviteToken(),
  });
  
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource } = await container.items.create(invite);
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: invite.tenantId,
        type: AUDIT_EVENT_TYPES.INVITE_CREATED,
        actorUserId,
        details: { inviteId: invite.id, email: invite.email, role: invite.role },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }

  // Send invitation email - track success/failure (same pattern as email verification)
  let emailSent = false;
  let emailError = null;
  
  try {
    const { sendInvitationEmail, isEmailConfigured } = await import('./emailService.js');
    const { getUserById } = await import('./userService.js');
    
    // Check if email service is configured
    if (!isEmailConfigured()) {
      emailError = 'Email service is not configured. Please contact support to enable invitation emails.';
      console.warn(`⚠️  [INVITE] Email service not configured. Invitation created but email not sent to: ${invite.email}`);
    } else {
      // Get inviter name
      let inviterName = 'A team member';
      try {
        const inviter = await getUserById(actorUserId, invite.tenantId);
        if (inviter) {
          inviterName = inviter.displayName || inviter.email || inviterName;
        }
      } catch (error) {
        console.warn('⚠️  [INVITE] Failed to get inviter name:', error.message);
      }

      // Get organization name
      let organizationName = 'the organization';
      if (invite.organizationId) {
        try {
          const { getOrgById } = await import('./organizationService.js');
          const org = await getOrgById(invite.organizationId, invite.tenantId);
          if (org) {
            organizationName = org.name || organizationName;
          }
        } catch (error) {
          console.warn('⚠️  [INVITE] Failed to get organization name:', error.message);
        }
      }

      console.log(`📧 [INVITE] Sending invitation email to: ${invite.email}`);
      const emailResult = await sendInvitationEmail(invite.email, invite.token, inviterName, organizationName, options.tempPassword);
      emailSent = true;
      console.log(`✅ [INVITE] Invitation email sent successfully. Message ID: ${emailResult.messageId || 'N/A'}`);
    }
  } catch (emailError) {
    emailSent = false;
    emailError = emailError.message || 'Failed to send invitation email';
    console.error(`❌ [INVITE] Failed to send invitation email to ${invite.email}:`, emailError);
    console.error('   Error details:', {
      message: emailError.message,
      stack: emailError.stack,
      email: invite.email,
      tokenLength: invite.token.length,
    });
    // Don't fail invitation creation if email fails, but track it for user feedback
  }
  
  // Attach email status to the invite resource for response tracking
  resource.emailSent = emailSent;
  resource.emailError = emailError;
  
  return resource;
}

/**
 * Mark an invite as accepted by token and email (e.g. after user signs in with temp password)
 * @param {string} token - Invitation token
 * @param {string} email - Invite email (must match signed-in user)
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<boolean>} True if invite was found and marked accepted
 */
export async function markInviteAcceptedByToken(token, email, tenantId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) return false;
  const invite = await getInviteByToken(token, tenantId);
  if (!invite || invite.email?.toLowerCase() !== email.toLowerCase() || invite.status !== INVITE_STATUS.PENDING) {
    return false;
  }
  await container.item(invite.id, tenantId).replace({
    ...invite,
    status: INVITE_STATUS.ACCEPTED,
    acceptedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return true;
}

/**
 * Get invite by token (for invite acceptance flow)
 * @param {string} token - Invitation token
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object|null>} Invite or null if not found
 */
export async function getInviteByToken(token, tenantId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.token = @token",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@token", value: token },
    ],
  }).fetchAll();
  
  return resources.length > 0 ? resources[0] : null;
}

/**
 * Get all invites for a tenant
 * @param {string} tenantId - Tenant ID
 * @param {string} [status] - Optional filter by status
 * @returns {Promise<Array>} Array of invites
 */
export async function getInvitesByTenant(tenantId, status = null) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];
  
  if (status) {
    query += " AND c.status = @status";
    parameters.push({ name: "@status", value: status });
  }
  
  const { resources } = await container.items.query({
    query,
    parameters,
  }).fetchAll();
  
  return resources;
}

/**
 * Accept an invitation (creates user and marks invite as accepted)
 * @param {string} token - Invitation token
 * @param {string} tenantId - Tenant ID
 * @param {Object} userData - User data (id, email, displayName, etc.)
 * @returns {Promise<Object>} Created user
 */
export async function acceptInvitation(token, tenantId, userData) {
  const container = getContainer(CONTAINER_NAME);
  
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  // Get and validate invite
  const invite = await getInviteByToken(token, tenantId);
  if (!invite) {
    throw new Error("Invitation not found");
  }
  
  if (invite.status !== INVITE_STATUS.PENDING) {
    throw new Error(`Invitation is ${invite.status}`);
  }
  
  if (isInviteExpired(invite)) {
    // Mark as expired
    await container.item(invite.id, tenantId).replace({
      ...invite,
      status: INVITE_STATUS.EXPIRED,
      updatedAt: new Date().toISOString(),
    });
    throw new Error("Invitation has expired");
  }
  
  // Check if user already exists (e.g. created with temp password at invite time)
  const existingUser = await getUserByEmailAnyRole(invite.email, tenantId);
  if (existingUser) {
    // Mark invite as accepted and return existing user (no duplicate creation)
    await container.item(invite.id, tenantId).replace({
      ...invite,
      status: INVITE_STATUS.ACCEPTED,
      acceptedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return existingUser;
  }
  
  // Create user
  // OAuth users (Microsoft/Google) and magic link users are auto-verified
  // Email/password users need verification, but invitations are considered trusted
  // For invitations: magic link and OAuth are auto-verified, email/password still needs verification
  const emailVerified = userData.authMethod && ['microsoft', 'google', 'magic'].includes(userData.authMethod);
  
  // Invited users are always UserAdmin (USER role) and linked to the inviting organization
  // Ensure role is 'user' (UserAdmin) for all invitations - invitations always create UserAdmin users
  const userRole = 'user'; // Always USER (UserAdmin) for invitations, regardless of invite.role
  
  const user = createUser({
    id: userData.id,
    tenantId,
    email: invite.email,
    displayName: userData.displayName || invite.email.split("@")[0],
    role: userRole, // Always USER (UserAdmin) for invitations
    status: emailVerified ? USER_STATUS.ACTIVE : USER_STATUS.PENDING, // Active if verified, pending if not
    organizationId: invite.organizationId, // Always link to inviting organization
    emailVerified: emailVerified, // Auto-verify OAuth and magic link users
  });
  
  // Use the role-specific container for user creation
  const { getContainerNameByRole } = await import('../models/user.js');
  const userContainerName = getContainerNameByRole(userRole);
  const userContainer = getContainer(userContainerName);
  
  if (!userContainer) {
    throw new Error(`Cosmos DB container '${userContainerName}' not available`);
  }
  
  const { resource: createdUser } = await userContainer.items.create(user);

  // If this invitation is tied to a specific product, automatically assign
  // the user to an active license for that product (when available).
  // This links the invited user to the product at acceptance time so that
  // their dashboard can immediately reflect product access.

  // Temp comment intensionally
  // if (invite.productId && invite.organizationId) {
  //   try {
  //     const { getLicensesByTenant, assignLicenseToUser } = await import("./licenseService.js");

  //     // Find licenses for this tenant, organization, and product
  //     const licenses = await getLicensesByTenant(tenantId, invite.organizationId, invite.productId);

  //     // Try to assign the user to the first license that can accept them.
  //     // assignLicenseToUser internally validates status, expiry, and seat availability.
  //     for (const license of licenses) {
  //       try {
  //         await assignLicenseToUser(license.id, tenantId, createdUser.id, invite.createdBy || createdUser.id);
  //         // Successfully assigned; no need to try additional licenses
  //         break;
  //       } catch (assignError) {
  //         // If assignment fails for this license (no seats, expired, etc.),
  //         // log and continue to the next one.
  //         console.warn("Failed to auto-assign license on invite acceptance:", {
  //           licenseId: license.id,
  //           error: assignError.message,
  //         });
  //       }
  //     }
  //   } catch (licenseError) {
  //     // Never fail invitation acceptance because of license issues.
  //     console.warn("License auto-assignment skipped on invite acceptance:", licenseError);
  //   }
  // }

  // Mark invite as accepted
  await container.item(invite.id, tenantId).replace({
    ...invite,
    status: INVITE_STATUS.ACCEPTED,
    acceptedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        type: AUDIT_EVENT_TYPES.INVITE_ACCEPTED,
        actorUserId: user.id,
        details: { inviteId: invite.id, userId: user.id, email: invite.email },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return createdUser;
}
