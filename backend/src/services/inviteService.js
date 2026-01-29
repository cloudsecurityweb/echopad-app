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
import { getUserByEmail } from "./userService.js";

const CONTAINER_NAME = "invites";
const AUDIT_CONTAINER_NAME = "auditEvents";
const USERS_CONTAINER_NAME = "users";

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
 * @returns {Promise<Object>} Created invite
 */
export async function createInvitation(inviteData, actorUserId) {
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

  // Send invitation email
  try {
    const { sendInvitationEmail } = await import('./emailService.js');
    const { getUserById } = await import('./userService.js');
    
    // Get inviter name
    let inviterName = 'A team member';
    try {
      const inviter = await getUserById(actorUserId, invite.tenantId);
      if (inviter) {
        inviterName = inviter.displayName || inviter.email;
      }
    } catch (error) {
      console.warn('Failed to get inviter name:', error);
    }

    // Get organization name
    let organizationName = 'the organization';
    if (invite.organizationId) {
      try {
        const { getOrgById } = await import('./organizationService.js');
        const org = await getOrgById(invite.organizationId, invite.tenantId);
        if (org) {
          organizationName = org.name;
        }
      } catch (error) {
        console.warn('Failed to get organization name:', error);
      }
    }

    await sendInvitationEmail(invite.email, invite.token, inviterName, organizationName);
  } catch (emailError) {
    console.error('Failed to send invitation email:', emailError);
    // Don't fail invitation creation if email fails, but log it
  }
  
  return resource;
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
  const usersContainer = getContainer(USERS_CONTAINER_NAME);
  
  if (!container || !usersContainer) {
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
  
  // Check if user already exists
  const existingUser = await getUserByEmail(invite.email, tenantId);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }
  
  // Create user
  // OAuth users (Microsoft/Google) are auto-verified, email/password users need verification
  const emailVerified = userData.authMethod && ['microsoft', 'google'].includes(userData.authMethod);
  
  const user = createUser({
    id: userData.id,
    tenantId,
    email: invite.email,
    displayName: userData.displayName || invite.email.split("@")[0],
    role: invite.role,
    status: USER_STATUS.ACTIVE,
    organizationId: invite.organizationId,
    emailVerified: emailVerified, // Auto-verify OAuth users
  });
  
  const { resource: createdUser } = await usersContainer.items.create(user);
  
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
