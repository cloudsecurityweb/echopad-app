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
 * License types
 */
export const LICENSE_TYPES = {
  SEAT: "seat",
  UNLIMITED: "unlimited",
};

/**
 * Create a new license document
 * @param {Object} data - License data
 * @param {string} data.id - Unique license ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.productId - Product ID this license is for
 * @param {string} data.organizationId - Organization ID that owns this license
 * @param {string} data.ownerOrgId - (legacy) Organization ID that owns this license
 * @param {string} data.licenseType - License type (seat|unlimited)
 * @param {number} data.totalSeats - Total number of seats (for seat licenses)
 * @param {number} data.usedSeats - Seats already assigned
 * @param {number} data.seats - (legacy) Number of seats/licenses
 * @param {string[]} [data.assignedUserIds=[]] - (legacy) Array of user IDs assigned to this license
 * @param {string} [data.status="active"] - License status
 * @param {Date} [data.startDate] - License start date
 * @param {Date} [data.startDate] - License start date
 * @param {Date} [data.expiresAt] - Expiration timestamp (optional)
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} License document
 */
export function createLicense(data) {
  const now = new Date();
  const organizationId = data.organizationId || data.ownerOrgId;
  const assignedUserIds = Array.isArray(data.assignedUserIds) ? data.assignedUserIds : [];
  const totalSeats = data.totalSeats ?? null;
  const usedSeats = data.usedSeats ?? assignedUserIds.length;
  const licenseType = data.licenseType || (totalSeats === null ? LICENSE_TYPES.UNLIMITED : LICENSE_TYPES.SEAT);
  const expiresAt = data.expiresAt || null;

  return {
    id: data.id,
    tenantId: data.tenantId,
    productId: data.productId,
    organizationId,
    ownerOrgId: organizationId,
    licenseType,
    totalSeats,
    usedSeats,
    assignedUserIds,
    startDate: data.startDate || now.toISOString(),
    expiresAt, // Use expiresAt instead of endDate
    status: data.status || LICENSE_STATUS.ACTIVE,
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
  const organizationId = data.organizationId || data.ownerOrgId;
  const totalSeats = data.totalSeats ?? null;
  const usedSeats = data.usedSeats ?? (Array.isArray(data.assignedUserIds) ? data.assignedUserIds.length : 0);
  const licenseType = data.licenseType || (totalSeats === null ? LICENSE_TYPES.UNLIMITED : LICENSE_TYPES.SEAT);

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.productId) errors.push("productId is required");
  if (!organizationId) errors.push("organizationId is required");
  if (licenseType && !Object.values(LICENSE_TYPES).includes(licenseType)) {
    errors.push(`licenseType must be one of: ${Object.values(LICENSE_TYPES).join(", ")}`);
  }
  if (licenseType === LICENSE_TYPES.SEAT) {
    if (totalSeats === null || totalSeats === undefined) {
      errors.push("totalSeats is required for seat licenses");
    } else if (typeof totalSeats !== "number" || totalSeats < 0) {
      errors.push("totalSeats must be a non-negative number");
    }
  }
  if (data.assignedUserIds && !Array.isArray(data.assignedUserIds)) {
    errors.push("assignedUserIds must be an array");
  }
  if (data.status && !Object.values(LICENSE_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(LICENSE_STATUS).join(", ")}`);
  }

  if (licenseType === LICENSE_TYPES.SEAT && totalSeats !== null && usedSeats > totalSeats) {
    errors.push("usedSeats cannot exceed totalSeats");
  }
  if (data.assignedUserIds && totalSeats !== null && data.assignedUserIds.length > totalSeats) {
    errors.push("assignedUserIds cannot exceed totalSeats");
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
  if (license.licenseType === LICENSE_TYPES.UNLIMITED) {
    return true;
  }
  const totalSeats = license.totalSeats ?? license.seats ?? 0;
  const usedSeats = license.usedSeats ?? (license.assignedUserIds?.length || 0);
  return usedSeats < totalSeats;
}

/**
 * Check if a license is expired
 * @param {Object} license - License document
 * @returns {boolean} True if license is expired
 */
export function isLicenseExpired(license) {
  const expiresAt = license.expiresAt;
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}
