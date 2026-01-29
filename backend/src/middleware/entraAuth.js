/**
 * Microsoft Entra ID (Azure AD) JWT Verification Middleware
 * 
 * Validates JWT tokens from Microsoft Entra ID and attaches user claims to req.auth
 */

import { jwtVerify, createRemoteJWKSet } from 'jose';
import { ENTRA_ROLE_UUIDS, USER_ROLES, getContainerNameByRole } from '../models/user.js';
import { getContainer } from '../config/cosmosClient.js';
import { isConfigured } from '../config/cosmosClient.js';
import { getUserByOIDAnyRole } from '../services/userService.js';

/**
 * Map Entra ID roles to backend roles
 * This is the authoritative mapping - Entra ID roles are the source of truth
 * @param {Array<string>} entraRoles - Array of Entra ID role names (e.g., ['SuperAdmin', 'ClientAdmin'])
 * @returns {string} Backend role (superAdmin|clientAdmin|user)
 */
function mapEntraRoleToBackendRole(entraRoles) {
  if (!entraRoles || !Array.isArray(entraRoles) || entraRoles.length === 0) {
    return USER_ROLES.USER; // Default to regular user
  }

  // Check for SuperAdmin first (highest privilege)
  if (entraRoles.includes('SuperAdmin')) {
    return USER_ROLES.SUPER_ADMIN;
  }

  // Check for ClientAdmin
  if (entraRoles.includes('ClientAdmin')) {
    return USER_ROLES.CLIENT_ADMIN;
  }

  // Check for UserAdmin
  if (entraRoles.includes('UserAdmin')) {
    return USER_ROLES.USER;
  }

  // Default to regular user
  return USER_ROLES.USER;
}

const TENANT_ID = process.env.AZURE_TENANT_ID;
const CLIENT_ID = process.env.AZURE_CLIENT_ID;

if (!TENANT_ID || !CLIENT_ID) {
  console.warn('⚠️  AZURE_TENANT_ID or AZURE_CLIENT_ID not set. Entra auth middleware will fail.');
}

// Create JWKS client for token verification
const JWKS_URL = `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`;
const JWKS = TENANT_ID ? createRemoteJWKSet(new URL(JWKS_URL)) : null;

/**
 * Middleware to verify Microsoft Entra ID JWT tokens
 * 
 * Validates:
 * - Token signature using JWKS
 * - Token expiration
 * - Audience (aud) matches AZURE_CLIENT_ID
 * - Issuer (iss) matches expected Entra ID issuer
 * 
 * On success, attaches user claims to req.auth:
 * - req.auth.oid: Object ID (user ID)
 * - req.auth.tid: Tenant ID
 * - req.auth.preferred_username: Email
 * - req.auth.name: Display name
 * - req.auth.roles: Array of app roles
 */
export async function verifyEntraToken(req, res, next) {
  // Skip if not configured
  if (!TENANT_ID || !CLIENT_ID || !JWKS) {
    return res.status(503).json({
      success: false,
      error: 'Entra ID authentication not configured',
      message: 'AZURE_TENANT_ID and AZURE_CLIENT_ID must be set',
    });
  }

  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
      audience: CLIENT_ID,
    });

    // Map role names to Entra ID role UUIDs
    const roles = payload.roles || [];
    console.log('🔐 [AUTH] Token verified - Entra ID roles:', roles, '| User:', payload.preferred_username || payload.email);
    let entraRoleId = null;
    
    // Find the first matching role and get its UUID
    if (roles.includes('SuperAdmin')) {
      entraRoleId = ENTRA_ROLE_UUIDS.SUPER_ADMIN;
    } else if (roles.includes('ClientAdmin')) {
      entraRoleId = ENTRA_ROLE_UUIDS.CLIENT_ADMIN;
    } else if (roles.includes('UserAdmin')) {
      entraRoleId = ENTRA_ROLE_UUIDS.USER_ADMIN;
    }

    // Attach claims to request
    req.auth = {
      oid: payload.oid || payload.sub, // Object ID (user ID)
      tid: payload.tid, // Tenant ID
      preferred_username: payload.preferred_username || payload.email || payload.upn,
      email: payload.email || payload.preferred_username || payload.upn,
      name: payload.name || payload.preferred_username || 'User',
      roles: roles, // App roles from Entra ID
      entraRoleId: entraRoleId, // Entra ID role UUID (mapped from role name)
      // Include other useful claims
      given_name: payload.given_name,
      family_name: payload.family_name,
      // Raw payload for debugging (remove in production if needed)
      _raw: {
        aud: payload.aud,
        iss: payload.iss,
        exp: payload.exp,
        iat: payload.iat,
      },
    };

    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    
    if (error.code === 'ERR_JWT_EXPIRED') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'The authentication token has expired. Please sign in again.',
      });
    }
    
    if (error.code === 'ERR_JWT_INVALID') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'The authentication token is invalid.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error.message || 'Failed to verify authentication token',
    });
  }
}

/**
 * Middleware to attach user from database to request
 * Must be called after verifyEntraToken
 * Attaches req.currentUser with DB user record
 */
export async function attachUserFromDb(req, res, next) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: 'Database not configured',
      message: 'CosmosDB not available',
    });
  }

  if (!req.auth || !req.auth.oid || !req.auth.tid) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }

  try {
    const { oid, tid, roles } = req.auth;
    
    // OID-FIRST LOOKUP: Use OID to find user across all containers
    // This is more efficient and doesn't require guessing the role first
    console.log(`🔍 [OID-LOOKUP] Searching for user with OID: ${oid.substring(0, 8)}...`);
    let user = await getUserByOIDAnyRole(oid, tid);

    if (!user) {
      console.warn(`⚠️ [OID-LOOKUP] User with OID ${oid.substring(0, 8)}... not found in database`);
      return res.status(401).json({
        success: false,
        error: 'User not registered',
        message: 'User account not found. Please sign up first.',
      });
    }

    // Log successful OID lookup
    console.log(`✅ [OID-LOOKUP] Found user with OID ${oid.substring(0, 8)}... | Email: ${user.email} | DB Role: ${user.role}`);

    // OVERRIDE DB role with fresh Entra ID token role (Entra ID is source of truth)
    // This ensures roles always reflect current Entra ID assignment
    if (roles && roles.length > 0) {
      const tokenRole = mapEntraRoleToBackendRole(roles);
      const originalDbRole = user.role;
      
      // Always log role information for debugging
      console.log('👤 [USER] Role mapping (OID-first):', {
        oid: oid.substring(0, 8) + '...',
        email: user.email,
        tokenRoles: roles,
        mappedTokenRole: tokenRole,
        dbRole: originalDbRole,
        finalRole: tokenRole,
        override: originalDbRole !== tokenRole ? 'YES' : 'NO'
      });
      
      // Override with token role
      user.role = tokenRole;
      
      // Log role override for debugging
      if (originalDbRole !== tokenRole) {
        console.log(`✅ [OID-LOOKUP] Role override: DB role (${originalDbRole}) → Token role (${tokenRole}) from Entra ID`);
      }
    } else {
      // If no token roles, keep DB role but log warning
      console.warn(`⚠️ [OID-LOOKUP] No roles in token for OID ${oid.substring(0, 8)}..., using DB role:`, user.role);
      console.log('👤 [USER] Using DB role (no token roles):', {
        oid: oid.substring(0, 8) + '...',
        email: user.email,
        dbRole: user.role
      });
    }

    // Ensure role is always set (safety check)
    if (!user.role) {
      console.error(`❌ [OID-LOOKUP] CRITICAL: No role found in database for user ${user.email} (OID: ${oid.substring(0, 8)}...)`);
      console.error('   User record exists but has no role field. This should not happen.');
      // Default to 'user' as fallback, but this is an error condition
      user.role = 'user';
      console.warn('   ⚠️ Defaulting to "user" role as fallback');
    }

    // Attach user to request (with overridden role from token, or DB role if token roles empty)
    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Error attaching user from DB:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to load user information',
    });
  }
}

/**
 * Middleware to require specific roles
 * Uses Entra ID token roles as primary source of truth (req.currentUser.role is overridden with token role)
 * Must be called after verifyEntraToken and attachUserFromDb
 * Usage: app.get('/admin', verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), handler)
 * 
 * @param {Array<string>} allowedEntraRoles - Entra ID role names (e.g., ['SuperAdmin', 'ClientAdmin'])
 * @param {Array<string>} allowedDbRoles - Backend role names (e.g., ['superAdmin', 'clientAdmin'])
 * Note: req.currentUser.role is already overridden with token role, so both checks should match
 */
export function requireRole(allowedEntraRoles = [], allowedDbRoles = []) {
  return (req, res, next) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required',
      });
    }

    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        error: 'User not loaded',
        message: 'User information not available. attachUserFromDb middleware required.',
      });
    }

    // Primary check: Entra ID token roles (source of truth)
    // For magic tokens, skip Entra role check and rely on DB role only
    const isMagicToken = req.auth?.provider === 'magic';
    const entraRoles = req.auth.roles || [];
    const hasEntraAccess = isMagicToken || allowedEntraRoles.length === 0 || 
      allowedEntraRoles.some(role => entraRoles.includes(role));

    // Secondary check: req.currentUser.role (which is now overridden with token role)
    // This provides an additional layer but should match token roles
    const userRole = req.currentUser.role; // Already overridden with token role in attachUserFromDb
    const hasRoleAccess = allowedDbRoles.length === 0 || 
      allowedDbRoles.includes(userRole);

    // Log authorization check
    console.log('🔒 [AUTHZ] Role check:', {
      route: req.path || req.url,
      method: req.method,
      userEmail: req.currentUser?.email,
      provider: req.auth?.provider || 'unknown',
      userEntraRoles: entraRoles,
      userRole: userRole,
      requiredEntraRoles: allowedEntraRoles,
      requiredDbRoles: allowedDbRoles,
      entraAccess: hasEntraAccess,
      roleAccess: hasRoleAccess,
      authorized: hasEntraAccess && hasRoleAccess
    });

    // Both checks should pass (token role is authoritative, or DB role for magic tokens)
    if (!hasEntraAccess || !hasRoleAccess) {
      console.warn('❌ [AUTHZ] Access denied:', {
        userEmail: req.currentUser?.email,
        userEntraRoles: entraRoles,
        userRole: userRole,
        requiredEntraRoles: allowedEntraRoles,
        requiredDbRoles: allowedDbRoles
      });
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: `Access denied. Required Entra roles: ${allowedEntraRoles.join(', ') || 'any'}, Required roles: ${allowedDbRoles.join(', ') || 'any'}`,
        userEntraRoles: entraRoles,
        userRole: userRole, // This is the token role (overridden)
      });
    }

    console.log('✅ [AUTHZ] Access granted');
    next();
  };
}
