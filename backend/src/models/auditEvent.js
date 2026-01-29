/**
 * Audit Event Model Schema
 * 
 * Represents an audit log entry for tracking system events
 */

/**
 * Audit event types
 */
export const AUDIT_EVENT_TYPES = {
  INVITE_CREATED: "invite_created",
  INVITE_ACCEPTED: "invite_accepted",
  INVITE_EXPIRED: "invite_expired",
  LICENSE_PURCHASED: "license_purchased",
  LICENSE_ASSIGNED: "license_assigned",
  LICENSE_REVOKED: "license_revoked",
  USER_CREATED: "user_created",
  USER_UPDATED: "user_updated",
  USER_DELETED: "user_deleted",
  PRODUCT_CREATED: "product_created",
  PRODUCT_UPDATED: "product_updated",
  ORGANIZATION_CREATED: "organization_created",
  ORGANIZATION_UPDATED: "organization_updated",
};

/**
 * Create a new audit event document
 * @param {Object} data - Audit event data
 * @param {string} data.id - Unique audit event ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.type - Event type
 * @param {string} data.actorUserId - User ID who performed the action
 * @param {Object} [data.details] - Additional event details
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Audit event document
 */
export function createAuditEvent(data) {
  const now = new Date();
  
  return {
    id: data.id,
    tenantId: data.tenantId,
    type: data.type,
    actorUserId: data.actorUserId,
    details: data.details || {},
    createdAt: data.createdAt || now.toISOString(),
  };
}

/**
 * Validate audit event data
 * @param {Object} data - Audit event data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateAuditEvent(data) {
  const errors = [];
  
  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.type) {
    errors.push("type is required");
  } else if (!Object.values(AUDIT_EVENT_TYPES).includes(data.type)) {
    errors.push(`type must be one of: ${Object.values(AUDIT_EVENT_TYPES).join(", ")}`);
  }
  if (!data.actorUserId) errors.push("actorUserId is required");
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
