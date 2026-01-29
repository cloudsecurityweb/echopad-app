/**
 * Organization Model Schema
 * 
 * Represents an organization (super admin org or client org)
 */

/**
 * Organization types
 */
export const ORG_TYPES = {
  SUPER: "super",
  CLIENT: "client",
};

/**
 * Organization statuses
 */
export const ORG_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
};

/**
 * Create a new organization document
 * @param {Object} data - Organization data
 * @param {string} data.id - Unique organization ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.name - Organization name
 * @param {string} data.type - Organization type (super|client)
 * @param {string} [data.status="active"] - Organization status
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Organization document
 */
export function createOrganization(data) {
  const now = new Date();
  
  return {
    id: data.id,
    tenantId: data.tenantId,
    name: data.name,
    type: data.type, // "super" or "client"
    status: data.status || ORG_STATUS.ACTIVE,
    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Validate organization data
 * @param {Object} data - Organization data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateOrganization(data) {
  const errors = [];
  
  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.name) errors.push("name is required");
  if (!data.type) {
    errors.push("type is required");
  } else if (!Object.values(ORG_TYPES).includes(data.type)) {
    errors.push(`type must be one of: ${Object.values(ORG_TYPES).join(", ")}`);
  }
  if (data.status && !Object.values(ORG_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(ORG_STATUS).join(", ")}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
