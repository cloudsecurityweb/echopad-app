/**
 * User License Model
 *
 * Maps a user to a specific license for product access.
 */

export function createUserLicense(data) {
  const now = new Date().toISOString();

  return {
    id: data.id,
    tenantId: data.tenantId,
    userId: data.userId,
    organizationId: data.organizationId,
    licenseId: data.licenseId,
    productId: data.productId,
    assignedBy: data.assignedBy,
    assignedAt: data.assignedAt || now,
    expiresAt: data.expiresAt || null,
    entityType: "userLicense",
  };
}

export function validateUserLicense(data) {
  const errors = [];

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.userId) errors.push("userId is required");
  if (!data.organizationId) errors.push("organizationId is required");
  if (!data.licenseId) errors.push("licenseId is required");
  if (!data.productId) errors.push("productId is required");
  if (!data.assignedBy) errors.push("assignedBy is required");

  if (data.expiresAt && isNaN(Date.parse(data.expiresAt))) {
    errors.push("expiresAt must be a valid date string");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
