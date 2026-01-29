/**
 * User Model Schema
 * 
 * Represents a user in the system (super admin, client admin, or regular user)
 */

/**
 * User roles
 */
export const USER_ROLES = {
  SUPER_ADMIN: "superAdmin",
  CLIENT_ADMIN: "clientAdmin",
  USER: "user",
};

/**
 * Entra ID role UUIDs
 * These UUIDs correspond to the app roles defined in Microsoft Entra ID
 */
export const ENTRA_ROLE_UUIDS = {
  SUPER_ADMIN: "853c280b-4131-478b-8da7-a156a4ca97ed",
  CLIENT_ADMIN: "fbec320f-c640-4cb0-bb3c-cd2bb5521062",
  USER_ADMIN: "98e57e54-d700-4778-9133-1d68b5114f6a",
};

/**
 * Map backend role to container name
 * @param {string} role - Backend role (superAdmin|clientAdmin|user)
 * @returns {string} Container name
 */
export function getContainerNameByRole(role) {
  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
      return "superAdmins";
    case USER_ROLES.CLIENT_ADMIN:
      return "clientAdmins";
    case USER_ROLES.USER:
      return "userAdmins";
    default:
      throw new Error(`Unknown role: ${role}`);
  }
}

/**
 * User statuses
 */
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending", // For users who haven't accepted invite yet
  SUSPENDED: "suspended",
};

/**
 * Create a new user document
 * @param {Object} data - User data
 * @param {string} data.id - Unique user ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.email - User email address
 * @param {string} [data.displayName] - User display name
 * @param {string} data.role - User role (superAdmin|clientAdmin|user)
 * @param {string} [data.status="pending"] - User status
 * @param {string} [data.organizationId] - Organization ID this user belongs to
 * @param {string} [data.passwordHash] - Hashed password (for email/password users)
 * @param {boolean} [data.emailVerified] - Whether email is verified (default: true for OAuth, false for email/password)
 * @param {string} [data.verificationToken] - Email verification token
 * @param {string} [data.verificationTokenExpiresAt] - Verification token expiration
 * @param {string} [data.entraRoleId] - Entra ID role UUID (for OAuth users)
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} User document
 */
export function createUser(data) {
  const now = new Date();

  // Default emailVerified: true for OAuth users, false for email/password users
  const emailVerified = data.emailVerified !== undefined
    ? data.emailVerified
    : (data.passwordHash ? false : true);

  return {
    id: data.id,
    tenantId: data.tenantId,
    email: data.email.toLowerCase().trim(),
    displayName: data.displayName || data.email.split("@")[0],
    role: data.role,
    status: data.status || USER_STATUS.PENDING,
    organizationId: data.organizationId || null,
    passwordHash: data.passwordHash || null, // Only for email/password users
    emailVerified: emailVerified,
    verificationToken: data.verificationToken || null,
    verificationTokenExpiresAt: data.verificationTokenExpiresAt || null,
    entraRoleId: data.entraRoleId || null, // Entra ID role UUID (null for email/password users)
    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Validate user data
 * @param {Object} data - User data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateUser(data) {
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
  } else if (!Object.values(USER_ROLES).includes(data.role)) {
    errors.push(`role must be one of: ${Object.values(USER_ROLES).join(", ")}`);
  }
  if (data.status && !Object.values(USER_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(USER_STATUS).join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
