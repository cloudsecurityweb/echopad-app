/**
 * License Model Schema
 * 
 * Represents a license for a product assigned to an organization
 */

/**
 * License statuses
 */
export const LICENSE_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  EXPIRED: "expired",
  SUSPENDED: "suspended",
};

/**
 * Create a new license document
 * @param {Object} data - License data
 * @param {string} data.id - Unique license ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.productId - Product ID this license is for
 * @param {string} data.ownerOrgId - Organization ID that owns this license
 * @param {number} data.seats - Number of seats/licenses
 * @param {string[]} [data.assignedUserIds=[]] - Array of user IDs assigned to this license
 * @param {string} [data.status="active"] - License status
 * @param {Date} [data.expiresAt] - Expiration timestamp (optional)
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} License document
 */
export function createLicense(data) {
  const now = new Date();
  
  return {
    id: data.id,
    tenantId: data.tenantId,
    productId: data.productId,
    ownerOrgId: data.ownerOrgId,
    seats: data.seats,
    assignedUserIds: data.assignedUserIds || [],
    status: data.status || LICENSE_STATUS.ACTIVE,
    expiresAt: data.expiresAt || null,
    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Validate license data
 * @param {Object} data - License data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateLicense(data) {
  const errors = [];
  
  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.productId) errors.push("productId is required");
  if (!data.ownerOrgId) errors.push("ownerOrgId is required");
  if (data.seats === undefined || data.seats === null) {
    errors.push("seats is required");
  } else if (typeof data.seats !== "number" || data.seats < 0) {
    errors.push("seats must be a non-negative number");
  }
  if (data.assignedUserIds && !Array.isArray(data.assignedUserIds)) {
    errors.push("assignedUserIds must be an array");
  }
  if (data.status && !Object.values(LICENSE_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(LICENSE_STATUS).join(", ")}`);
  }
  
  // Validate that assigned users don't exceed seats
  if (data.assignedUserIds && data.seats !== undefined) {
    if (data.assignedUserIds.length > data.seats) {
      errors.push("assignedUserIds cannot exceed seats count");
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Check if a license has available seats
 * @param {Object} license - License document
 * @returns {boolean} True if license has available seats
 */
export function hasAvailableSeats(license) {
  const assignedCount = license.assignedUserIds?.length || 0;
  return assignedCount < license.seats;
}

/**
 * Check if a license is expired
 * @param {Object} license - License document
 * @returns {boolean} True if license is expired
 */
export function isLicenseExpired(license) {
  if (!license.expiresAt) return false;
  return new Date(license.expiresAt) < new Date();
}
