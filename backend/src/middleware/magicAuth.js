/**
 * Magic Link Token Verification Middleware
 * 
 * Validates internal JWT tokens issued for magic link authentication
 */

import { jwtVerify, SignJWT } from 'jose';
import { getUserByEmailAnyRole } from '../services/userService.js';
import { isConfigured } from '../config/cosmosClient.js';

const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_JWT_SECRET;
const MAGIC_LINK_TTL_MINUTES = parseInt(process.env.MAGIC_LINK_TTL_MINUTES || '1440', 10); // Default 24 hours

if (!MAGIC_LINK_SECRET) {
  console.warn('⚠️  MAGIC_LINK_JWT_SECRET not set. Magic link auth will fail.');
}

/**
 * Generate a magic link session token
 * @param {Object} payload - Token payload { userId, tenantId, email, role }
 * @returns {Promise<string>} Signed JWT token
 */
export async function generateMagicToken(payload) {
  if (!MAGIC_LINK_SECRET) {
    throw new Error('MAGIC_LINK_JWT_SECRET not configured');
  }

  const secret = new TextEncoder().encode(MAGIC_LINK_SECRET);
  const expiresIn = `${MAGIC_LINK_TTL_MINUTES}m`;

  const token = await new SignJWT({
    userId: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('echopad-magic')
    .setSubject(payload.userId)
    .setAudience('echopad-api')
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}

/**
 * Middleware to verify magic link JWT tokens
 * 
 * Validates:
 * - Token signature using secret
 * - Token expiration
 * - Issuer (iss) matches 'echopad-magic'
 * 
 * On success, attaches user claims to req.auth:
 * - req.auth.oid: User ID (from userId claim)
 * - req.auth.tid: Tenant ID
 * - req.auth.email: Email
 * - req.auth.roles: Empty array (magic tokens don't have Entra roles)
 * - req.auth.provider: 'magic'
 */
export async function verifyMagicToken(req, res, next) {
  // Skip if not configured
  if (!MAGIC_LINK_SECRET) {
    return res.status(503).json({
      success: false,
      error: 'Magic link authentication not configured',
      message: 'MAGIC_LINK_JWT_SECRET environment variable must be set',
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
    const secret = new TextEncoder().encode(MAGIC_LINK_SECRET);

    // Verify token
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'echopad-magic',
      audience: 'echopad-api',
    });

    // Attach claims to request (similar format to Microsoft/Google tokens)
    req.auth = {
      oid: payload.userId, // Use userId as oid for consistency
      tid: payload.tenantId,
      preferred_username: payload.email,
      email: payload.email,
      name: payload.email?.split('@')[0] || 'User',
      roles: [], // Magic tokens don't have Entra roles
      provider: 'magic',
      // Raw payload for debugging
      _raw: {
        userId: payload.userId,
        tenantId: payload.tenantId,
        email: payload.email,
        role: payload.role,
        exp: payload.exp,
        iat: payload.iat,
      },
    };

    next();
  } catch (error) {
    console.error('Magic token verification failed:', error.message);
    
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
      message: error.message || 'Failed to verify magic link token',
    });
  }
}

/**
 * Middleware to attach user from database for magic token auth
 * Similar to attachUserFromDb but works with magic tokens
 */
export async function attachMagicUserFromDb(req, res, next) {
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
    const { oid, tid } = req.auth;
    
    // For magic tokens, userId is stored in oid
    // Try to find user by ID first (if using OID as ID)
    let user = null;
    
    // Try getUserByEmailAnyRole as fallback (since magic link users may not have OID as ID)
    if (req.auth.email) {
      user = await getUserByEmailAnyRole(req.auth.email, tid);
    }

    if (!user) {
      console.warn(`⚠️ [MAGIC-AUTH] User not found for magic token: ${oid.substring(0, 8)}...`);
      return res.status(401).json({
        success: false,
        error: 'User not registered',
        message: 'User account not found. Please contact support.',
      });
    }

    // Attach user to request
    req.currentUser = user;
    next();
  } catch (error) {
    console.error('Error attaching magic user from DB:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to load user information',
    });
  }
}
