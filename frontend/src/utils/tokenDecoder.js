/**
 * JWT Token Decoder Utility
 * 
 * Decodes JWT tokens to extract claims, especially roles from Entra ID
 * Note: This does NOT verify the token signature - it only decodes the payload
 * Token verification is done by the backend
 */

/**
 * Decode JWT token without verification
 * @param {string} token - JWT token string
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function decodeJWT(token) {
  if (!token) {
    return null;
  }

  try {
    // JWT format: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid JWT format - expected 3 parts');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Add padding if needed (base64url decoding)
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    
    // Decode from base64url
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    // Parse JSON
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
}

/**
 * Extract roles from JWT token
 * @param {string} token - JWT token string
 * @returns {Array<string>} Array of role names (e.g., ['SuperAdmin', 'ClientAdmin'])
 */
export function getRolesFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) {
    return [];
  }

  // Roles are in the 'roles' claim
  const roles = payload.roles || [];
  
  // Only warn if no roles found (common for new users)
  if (roles.length === 0 && import.meta.env.DEV) {
    console.warn('[TOKEN] No roles found in token - will use database role');
  }

  return Array.isArray(roles) ? roles : [];
}

/**
 * Extract OID (Object ID) from JWT token
 * @param {string} token - JWT token string
 * @returns {string|null} OID (Object ID) or null if not found
 */
export function getOIDFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  const oid = payload.oid || payload.sub;
  
  if (oid) {
    console.log('🔐 [TOKEN] OID extracted:', oid);
  } else {
    console.warn('⚠️ [TOKEN] No OID found in token payload');
    console.log('📋 [TOKEN] Token payload keys:', Object.keys(payload));
  }

  return oid || null;
}

/**
 * Extract user info from JWT token
 * @param {string} token - JWT token string
 * @returns {Object|null} User info object with oid, email, name, roles, etc.
 */
export function getUserInfoFromToken(token) {
  const payload = decodeJWT(token);
  if (!payload) {
    return null;
  }

  const oid = payload.oid || payload.sub;

  // Log OID for debugging
  if (oid) {
    console.log('🔐 [TOKEN] User info extracted - OID:', oid);
  } else {
    console.warn('⚠️ [TOKEN] No OID found in token payload');
  }

  return {
    oid: oid,
    tid: payload.tid,
    email: payload.email || payload.preferred_username || payload.upn,
    name: payload.name || payload.preferred_username || 'User',
    roles: payload.roles || [],
    aud: payload.aud,
    iss: payload.iss,
    exp: payload.exp,
    iat: payload.iat,
  };
}

/**
 * Map Entra ID role to frontend role constant
 * @param {string} entraRole - Entra ID role name (e.g., 'SuperAdmin')
 * @returns {string} Frontend role constant
 */
export function mapEntraRoleToFrontendRole(entraRole) {
  const roleMap = {
    'SuperAdmin': 'super_admin',
    'ClientAdmin': 'client_admin',
    'UserAdmin': 'user_admin',
  };

  return roleMap[entraRole] || 'user_admin';
}
