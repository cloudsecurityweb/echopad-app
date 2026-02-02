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

const PLACEHOLDER_TENANT = /^(your-tenant-id|your-tenant-id\.onmicrosoft\.com)$/i;
const PLACEHOLDER_CLIENT = /^your-client-id$/i;

if (!TENANT_ID || !CLIENT_ID) {
  console.warn('⚠️  AZURE_TENANT_ID or AZURE_CLIENT_ID not set. Entra auth middleware will fail.');
} else if (PLACEHOLDER_TENANT.test(String(TENANT_ID).trim()) || PLACEHOLDER_CLIENT.test(String(CLIENT_ID).trim())) {
  console.warn('⚠️  [ENTRA-AUTH] AZURE_TENANT_ID or AZURE_CLIENT_ID look like placeholders. Set them in backend .env to your Azure app registration values (same app as frontend VITE_MSAL_CLIENT_ID). Otherwise Microsoft sign-in will return 401.');
}

/**
 * Decode JWT payload safely (handles base64url with or without padding)
 * @param {string} payloadB64 - Base64 or base64url-encoded payload
 * @returns {object|null} Decoded payload or null on failure
 */
function decodeJwtPayload(payloadB64) {
  try {
    let b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
    const pad = b64.length % 4;
    if (pad) b64 += '='.repeat(4 - pad);
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

// UUID (tenant ID) pattern for fallback extraction from issuer
const TENANT_UUID_REGEX = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

/**
 * Extract tenant ID from Microsoft issuer URL
 * Supports: login.microsoftonline.com/{tenant}/v2.0, login.microsoftonline.com/{tenant}/, sts.windows.net/{tenant}/
 * Fallback: any UUID in the issuer string (tenant IDs are GUIDs)
 * @param {string} iss - Issuer from token
 * @returns {string|null} Tenant ID or null
 */
function extractTenantFromIssuer(iss) {
  if (!iss || typeof iss !== 'string') return null;
  const normalized = iss.trim().replace(/\/+$/, '');
  const loginMatch = normalized.match(/login\.microsoftonline\.com\/([^/]+)/i);
  if (loginMatch) return loginMatch[1];
  const stsMatch = normalized.match(/sts\.windows\.net\/([^/]+)/i);
  if (stsMatch) return stsMatch[1];
  // Fallback: issuer contains Microsoft host but path format unexpected — extract first UUID (tenant)
  if (normalized.includes('login.microsoftonline.com') || normalized.includes('sts.windows.net')) {
    const uuidMatch = normalized.match(TENANT_UUID_REGEX);
    if (uuidMatch) return uuidMatch[0];
  }
  return null;
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
/** In development only: accept Microsoft token by decoding without verification (like email/password trust their JWT). */
function tryDevBypassEntraToken(token, req, res, next) {
  if (process.env.NODE_ENV !== 'development') return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = decodeJwtPayload(parts[1]);
  if (!payload) return false;
  const iss = payload.iss && String(payload.iss);
  const isMicrosoftIssuer = iss && (iss.includes('login.microsoftonline.com') || iss.includes('sts.windows.net'));
  if (!isMicrosoftIssuer) return false;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false;
  const oid = payload.oid || payload.sub;
  const tid = payload.tid;
  if (!oid || !tid) return false;

  console.warn('⚠️ [ENTRA-AUTH] Development bypass: accepting Microsoft token without JWKS verification. Set AZURE_TENANT_ID and AZURE_CLIENT_ID in .env for production.');
  const roles = payload.roles || [];
  let entraRoleId = null;
  if (roles.includes('SuperAdmin')) entraRoleId = ENTRA_ROLE_UUIDS.SUPER_ADMIN;
  else if (roles.includes('ClientAdmin')) entraRoleId = ENTRA_ROLE_UUIDS.CLIENT_ADMIN;
  else if (roles.includes('UserAdmin')) entraRoleId = ENTRA_ROLE_UUIDS.USER_ADMIN;

  req.auth = {
    oid,
    tid,
    preferred_username: payload.preferred_username || payload.email || payload.upn,
    email: payload.email || payload.preferred_username || payload.upn,
    name: payload.name || payload.preferred_username || 'User',
    roles,
    entraRoleId,
    given_name: payload.given_name,
    family_name: payload.family_name,
    _raw: { aud: payload.aud, iss: payload.iss, exp: payload.exp, iat: payload.iat },
  };
  next();
  return true;
}

export async function verifyEntraToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  // Development only: when Azure is not configured, accept token by decoding (no JWKS) so sign-in/me work like email/password
  const notConfigured = !TENANT_ID || !CLIENT_ID || !JWKS;
  const isPlaceholder = TENANT_ID && CLIENT_ID && (
    PLACEHOLDER_TENANT.test(String(TENANT_ID).trim()) || PLACEHOLDER_CLIENT.test(String(CLIENT_ID).trim())
  );
  if (process.env.NODE_ENV === 'development' && (notConfigured || isPlaceholder)) {
    if (tryDevBypassEntraToken(token, req, res, next)) return;
    return res.status(503).json({
      success: false,
      error: 'Entra ID authentication not configured',
      message: 'AZURE_TENANT_ID and AZURE_CLIENT_ID must be set',
    });
  }

  if (notConfigured) {
    return res.status(503).json({
      success: false,
      error: 'Entra ID authentication not configured',
      message: 'AZURE_TENANT_ID and AZURE_CLIENT_ID must be set',
    });
  }

  try {
    // First, decode the token to get the issuer and extract tenant ID
    // This allows us to use the correct JWKS endpoint for the token's tenant
    let tokenTenantId = TENANT_ID; // Default to configured tenant
    let tokenIssuer = null;
    const parts = token.split('.');

    if (parts.length === 3) {
      const payload = decodeJwtPayload(parts[1]);
      if (payload) {
        tokenIssuer = payload.iss;
        const extractedTenant = extractTenantFromIssuer(tokenIssuer);
        if (extractedTenant) {
          tokenTenantId = extractedTenant;
        } else if (tokenIssuer) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('⚠️ [ENTRA-AUTH] Could not extract tenant from issuer (unexpected format), using AZURE_TENANT_ID:', {
              tokenIssuer,
              configuredTenantId: TENANT_ID,
            });
          }
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ [ENTRA-AUTH] Could not decode JWT payload, using configured tenant:', TENANT_ID);
        }
      }
    }

    // Never use "common" for JWKS — we need the token's actual tenant keys for signature verification
    if (tokenTenantId === 'common') {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ [ENTRA-AUTH] Cannot verify token: JWKS tenant is "common". Token issuer:', tokenIssuer || '(not decoded)');
      }
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
        message: 'Could not determine token tenant. Set AZURE_TENANT_ID in backend .env to your Azure AD tenant ID (not "common"), or sign in with a token that includes a tenant-specific issuer.',
      });
    }

    const jwksUrl = `https://login.microsoftonline.com/${tokenTenantId}/discovery/v2.0/keys`;
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 [ENTRA-AUTH] Token issuer / tenant / JWKS:', {
        tokenIssuer: tokenIssuer || '(not decoded)',
        extractedTenantId: tokenTenantId,
        configuredTenantId: TENANT_ID,
        jwksUrl,
      });
    }

    // Create JWKS client for the token's tenant (or use default when same as configured)
    const tokenJWKS = tokenTenantId === TENANT_ID ? JWKS : createRemoteJWKSet(new URL(jwksUrl));

    // Decode token first to get audience before verification
    let tokenAudience = null;
    if (parts.length === 3) {
      const decodedPayload = decodeJwtPayload(parts[1]);
      if (decodedPayload) tokenAudience = decodedPayload.aud;
    }
    
    // ACCEPT BOTH: Microsoft Graph tokens and Backend API tokens
    // Microsoft Graph audience: 00000003-0000-0000-c000-000000000000
    // Backend API audience: CLIENT_ID (d4ea5537-8b2a-4b88-9dbd-80bf02596c1a)
    const MICROSOFT_GRAPH_AUDIENCE = '00000003-0000-0000-c000-000000000000';
    const validAudiences = [CLIENT_ID, MICROSOFT_GRAPH_AUDIENCE];
    
    // Log audience information for debugging
    if (process.env.NODE_ENV === 'development' && tokenAudience) {
      console.log('🔍 [ENTRA-AUTH] Token audience check:', {
        tokenAudience,
        validAudiences,
        audienceMatch: validAudiences.includes(tokenAudience) ? '✓' : '⚠ Mismatch',
      });
    }
    
    // Verify token signature and basic claims
    // Note: Microsoft tokens can have different issuer formats:
    // - https://login.microsoftonline.com/{tenant-id}/v2.0 (v2.0 endpoint)
    // - https://sts.windows.net/{tenant-id}/ (v1.0 endpoint)
    // For sts.windows.net tokens, we still use login.microsoftonline.com for JWKS
    
    let payload;
    let verifyOptions = {};
    
    // If we know the audience and it's valid, use it for verification
    if (tokenAudience && validAudiences.includes(tokenAudience)) {
      verifyOptions.audience = tokenAudience;
    } else {
      // Try backend API audience first (most common for custom APIs)
      verifyOptions.audience = CLIENT_ID;
    }
    
    try {
      payload = (await jwtVerify(token, tokenJWKS, verifyOptions)).payload;
      
      // Verify the audience is valid (double-check)
      const actualAudience = payload.aud;
      if (actualAudience && !validAudiences.includes(actualAudience)) {
        // If verification succeeded but audience doesn't match, try Microsoft Graph
        if (actualAudience === MICROSOFT_GRAPH_AUDIENCE && verifyOptions.audience === CLIENT_ID) {
          // Retry with Microsoft Graph audience
          payload = (await jwtVerify(token, tokenJWKS, {
            audience: MICROSOFT_GRAPH_AUDIENCE,
          })).payload;
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ [ENTRA-AUTH] Audience mismatch after verification:', {
              tokenAudience: actualAudience,
              validAudiences,
            });
          }
          throw new Error(`Token audience mismatch. Token is for '${actualAudience}', but backend expects one of: ${validAudiences.join(', ')}`);
        }
      }
    } catch (verifyError) {
      // If verification failed and we tried CLIENT_ID, try Microsoft Graph
      if (verifyOptions.audience === CLIENT_ID && verifyError.code !== 'ERR_JWT_EXPIRED') {
        try {
          payload = (await jwtVerify(token, tokenJWKS, {
            audience: MICROSOFT_GRAPH_AUDIENCE,
          })).payload;
        } catch (error2) {
          // Check if it's an audience mismatch
          if (tokenAudience && !validAudiences.includes(tokenAudience)) {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ [ENTRA-AUTH] Audience mismatch detected:', {
                tokenAudience,
                validAudiences,
                issue: 'Token audience is not Microsoft Graph or backend API',
              });
            }
            throw new Error(`Token audience mismatch. Token is for '${tokenAudience}', but backend expects one of: ${validAudiences.join(', ')}`);
          }
          // If signature verification fails, provide better error message
          if (error2.code === 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED') {
            if (process.env.NODE_ENV === 'development') {
              console.error('❌ [ENTRA-AUTH] Signature verification failed:', {
                error: error2.message,
                tokenTenantId,
                configuredTenantId: TENANT_ID,
                issuer: tokenIssuer,
                note: 'This could be due to wrong tenant ID, expired token, or invalid signature',
              });
            }
            const err = new Error('Token signature verification failed. Please sign in again.');
            err.code = 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED';
            throw err;
          }
          // Re-throw other errors
          throw error2;
        }
      } else {
        // If signature verification fails, provide better error message
        if (verifyError.code === 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED') {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ [ENTRA-AUTH] Signature verification failed:', {
              error: verifyError.message,
              tokenTenantId,
              configuredTenantId: TENANT_ID,
              issuer: tokenIssuer,
              note: 'This could be due to wrong tenant ID, expired token, or invalid signature',
            });
          }
          const err = new Error('Token signature verification failed. Please sign in again.');
          err.code = 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED';
          throw err;
        }
        // Re-throw other errors (including audience mismatch)
        throw verifyError;
      }
    }
    
    // Manually verify issuer matches Microsoft format
    if (!payload.iss || (!payload.iss.includes('login.microsoftonline.com') && !payload.iss.includes('sts.windows.net'))) {
      throw new Error(`Invalid issuer: ${payload.iss}. Expected Microsoft Entra ID issuer`);
    }
    
    // Log tenant information for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 [ENTRA-AUTH] Token verified:', {
        issuer: payload.iss,
        tokenTenantId,
        configuredTenantId: TENANT_ID,
        tenantMatch: tokenTenantId === TENANT_ID ? '✓' : '⚠ Different tenant',
      });
    }

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
    // Development only: on verification failure, try accepting token by decoding (no JWKS) so sign-in/me work like email/password
    const isVerificationFailure = error.code === 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED' ||
      error.code === 'ERR_JWT_INVALID' ||
      (error.message && /signature|verification failed/i.test(error.message));
    if (process.env.NODE_ENV === 'development' && isVerificationFailure) {
      if (tryDevBypassEntraToken(token, req, res, next)) return;
    }

    if (process.env.NODE_ENV === 'development') {
      let extractedTenantId = 'unknown';
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = decodeJwtPayload(parts[1]);
        if (payload?.iss) {
          const tid = extractTenantFromIssuer(payload.iss);
          if (tid) extractedTenantId = tid;
          else extractedTenantId = payload.iss;
        }
      }
      console.error('🔐 [ENTRA-AUTH] Token verification failed:', {
        error: error.message,
        code: error.code,
        tokenPreview: token.substring(0, 20) + '...',
        configuredTenantId: TENANT_ID,
        extractedTenantId,
        configuredClientId: CLIENT_ID,
        note: error.code === 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED'
          ? 'Signature verification failed - ensure backend AZURE_TENANT_ID and AZURE_CLIENT_ID match the Azure app used by the frontend'
          : 'Other verification error',
      });
    } else {
      if (error.code !== 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED') {
        console.error('🔐 [ENTRA-AUTH] Token verification failed:', error.message);
      }
    }

    if (error.code === 'ERR_JWT_EXPIRED') {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'The authentication token has expired. Please sign in again.',
      });
    }

    if (error.code === 'ERR_JWT_INVALID' || error.code === 'ERR_JWT_SIGNATURE_VERIFICATION_FAILED') {
      const msg = process.env.NODE_ENV === 'development'
        ? 'The authentication token is invalid or not a Microsoft token. Check backend logs and ensure AZURE_TENANT_ID and AZURE_CLIENT_ID in backend .env match the frontend Azure app.'
        : 'The authentication token is invalid or not a Microsoft token.';
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: msg,
      });
    }

    // Never send raw library messages (e.g. jose "signature verification failed") to client
    const safeMessage = (error.message && /signature|verification failed/i.test(error.message))
      ? 'The authentication token is invalid or not a Microsoft token. Please sign in again.'
      : (error.message || 'Failed to verify authentication token');

    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: safeMessage,
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

    console.log("----_____________", user);

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
  console.log('🔒 [AUTHZ] Configuring role requirement middleware:', )
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
    // For magic tokens and email/password tokens, skip Entra role check and rely on DB role only
    const isMagicToken = req.auth?.provider === 'magic';
    const isEmailPasswordToken = req.auth?.provider === 'email-password';
    const entraRoles = req.auth.roles || [];
    const hasEntraAccess = isMagicToken || isEmailPasswordToken || allowedEntraRoles.length === 0 || 
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
    if (!hasRoleAccess) {
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
