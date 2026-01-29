/**
 * Invite Model Schema
 * 
 * Represents an invitation sent to a user to join an organization
 */

/**
 * Invite statuses
 */
export const INVITE_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  EXPIRED: "expired",
  CANCELLED: "cancelled",
};

/**
 * Invite types
 */
export const INVITE_TYPES = {
  CLIENT: "client",
  USER: "user",
};

/**
 * Create a new invite document
 * @param {Object} data - Invite data
 * @param {string} data.id - Unique invite ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.email - Email address to invite
 * @param {string} data.role - Role to assign (clientAdmin|user)
 * @param {string} data.token - Unique invitation token
 * @param {string} data.createdBy - User ID who created the invite
 * @param {string} [data.organizationId] - Organization ID for the invite
 * @param {string} [data.type] - Invite type (client|user)
 * @param {string} [data.productId] - Product ID to assign (for client invites)
 * @param {string} [data.status="pending"] - Invite status
 * @param {Date} [data.expiresAt] - Expiration timestamp (default: 7 days from now)
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Invite document
 */
export function createInvite(data) {
  const now = new Date();
  const expiresAt = data.expiresAt || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days default
  
  return {
    id: data.id,
    tenantId: data.tenantId,
    email: data.email.toLowerCase().trim(),
    role: data.role,
    token: data.token,
    status: data.status || INVITE_STATUS.PENDING,
    organizationId: data.organizationId || null,
    type: data.type || INVITE_TYPES.USER,
    productId: data.productId || null,
    createdBy: data.createdBy,
    expiresAt: expiresAt.toISOString(),
    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
    acceptedAt: null,
  };
}

/**
 * Validate invite data
 * @param {Object} data - Invite data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateInvite(data) {
  const errors = [];
  
  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.email) {
    errors.push("email is required");
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("email must be a valid email address");
    }
  }
  if (!data.role) {
    errors.push("role is required");
  } else if (!["clientAdmin", "user"].includes(data.role)) {
    errors.push("role must be either 'clientAdmin' or 'user'");
  }
  if (!data.token) errors.push("token is required");
  if (!data.createdBy) errors.push("createdBy is required");
  if (data.status && !Object.values(INVITE_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(INVITE_STATUS).join(", ")}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if an invite is expired
 * @param {Object} invite - Invite document
 * @returns {boolean} True if invite is expired
 */
export function isInviteExpired(invite) {
  if (!invite.expiresAt) return false;
  return new Date(invite.expiresAt) < new Date();
}
