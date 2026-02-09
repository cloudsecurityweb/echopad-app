/**
 * Email Verification Model
 * 
 * Represents an email verification or password reset token
 */

/**
 * Token types
 */
export const TOKEN_TYPES = {
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
};

/**
 * Create a new email verification/password reset document
 * @param {Object} data - Verification data
 * @param {string} data.id - Unique verification ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.email - Email address
 * @param {string} data.token - Verification/reset token
 * @param {string} [data.type='email_verification'] - Token type
 * @param {Date} [data.expiresAt] - Expiration timestamp (default: 24h for verification, 1h for reset)
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Verification document
 */
export function createEmailVerification(data) {
  const now = new Date();
  const type = data.type || TOKEN_TYPES.EMAIL_VERIFICATION;

  // Default expiry: 24 hours for email verification, 1 hour for password reset
  const defaultExpiryHours = type === TOKEN_TYPES.PASSWORD_RESET ? 1 : 24;
  const expiresAt = data.expiresAt || new Date(now.getTime() + defaultExpiryHours * 60 * 60 * 1000);

  return {
    id: data.id,
    tenantId: data.tenantId,
    email: data.email.toLowerCase().trim(),
    token: data.token,
    type: type,
    expiresAt: expiresAt.toISOString(),
    verifiedAt: null,
    usedAt: null, // For password reset: tracks when token was used
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
 * Check if token has been used (for password reset)
 * @param {Object} verification - Verification document
 * @returns {boolean} True if already used
 */
export function isTokenUsed(verification) {
  return verification.usedAt !== null;
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
  if (data.type && !Object.values(TOKEN_TYPES).includes(data.type)) {
    errors.push(`type must be one of: ${Object.values(TOKEN_TYPES).join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
