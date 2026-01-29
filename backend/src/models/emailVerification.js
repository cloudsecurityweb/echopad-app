/**
 * Email Verification Model
 * 
 * Represents an email verification token
 */

/**
 * Create a new email verification document
 * @param {Object} data - Verification data
 * @param {string} data.id - Unique verification ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.email - Email address to verify
 * @param {string} data.token - Verification token
 * @param {Date} [data.expiresAt] - Expiration timestamp (default: 24 hours from now)
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Verification document
 */
export function createEmailVerification(data) {
  const now = new Date();
  const expiresAt = data.expiresAt || new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours default
  
  return {
    id: data.id,
    tenantId: data.tenantId,
    email: data.email.toLowerCase().trim(),
    token: data.token,
    expiresAt: expiresAt.toISOString(),
    verifiedAt: null,
    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Check if verification token is expired
 * @param {Object} verification - Verification document
 * @returns {boolean} True if expired
 */
export function isVerificationExpired(verification) {
  if (!verification.expiresAt) return false;
  return new Date(verification.expiresAt) < new Date();
}

/**
 * Validate verification data
 * @param {Object} data - Verification data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateVerification(data) {
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
  if (!data.token) errors.push("token is required");
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
