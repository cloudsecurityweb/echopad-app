/**
 * Email/Password Token Verification Middleware
 * 
 * Validates internal JWT tokens issued for email/password authentication
 */

import { jwtVerify, SignJWT } from 'jose';
import { getUserById as getUserByIdService, getUserByEmailAnyRole } from '../services/userService.js';
import { isConfigured } from '../config/cosmosClient.js';
import { getContainerNameByRole } from '../models/user.js';

const EMAIL_PASSWORD_SECRET = process.env.EMAIL_PASSWORD_JWT_SECRET;
const EMAIL_PASSWORD_TTL_MINUTES = parseInt(process.env.EMAIL_PASSWORD_TOKEN_TTL_MINUTES || '1440', 10); // Default 24 hours
const EMAIL_PASSWORD_REFRESH_TTL_DAYS = parseInt(process.env.EMAIL_PASSWORD_REFRESH_TTL_DAYS || '7', 10); // Default 7 days
const REFRESH_ISSUER = 'echopad-email-password-refresh';

if (!EMAIL_PASSWORD_SECRET) {
  console.warn('⚠️  EMAIL_PASSWORD_JWT_SECRET not set. Email/password auth will fail.');
}

/**
 * Generate an email/password session token
 * @param {Object} payload - Token payload { userId, tenantId, email, role }
 * @returns {Promise<string>} Signed JWT token
 */
export async function generateEmailPasswordToken(payload) {
  if (!EMAIL_PASSWORD_SECRET) {
    throw new Error('EMAIL_PASSWORD_JWT_SECRET not configured');
  }

  const secret = new TextEncoder().encode(EMAIL_PASSWORD_SECRET);
  const expiresIn = `${EMAIL_PASSWORD_TTL_MINUTES}m`;

  const token = await new SignJWT({
    userId: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer('echopad-email-password')
    .setSubject(payload.userId)
    .setAudience('echopad-api')
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}

/**
 * Generate an email/password refresh token (long-lived, for use with POST /api/auth/refresh)
 * @param {Object} payload - Token payload { userId, tenantId, email, role }
 * @returns {Promise<string>} Signed JWT refresh token
 */
export async function generateEmailPasswordRefreshToken(payload) {
  if (!EMAIL_PASSWORD_SECRET) {
    throw new Error('EMAIL_PASSWORD_JWT_SECRET not configured');
  }

  const secret = new TextEncoder().encode(EMAIL_PASSWORD_SECRET);
  const expiresIn = `${EMAIL_PASSWORD_REFRESH_TTL_DAYS}d`;

  const token = await new SignJWT({
    userId: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(REFRESH_ISSUER)
    .setSubject(payload.userId)
    .setAudience('echopad-api')
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}

/**
 * Verify an email/password refresh token and return the payload.
 * @param {string} token - JWT refresh token string
 * @returns {Promise<{ userId: string, tenantId: string, email: string, role: string }>} Decoded payload
 * @throws {Error} When token is invalid or expired
 */
export async function verifyEmailPasswordRefreshToken(token) {
  if (!EMAIL_PASSWORD_SECRET) {
    throw new Error('EMAIL_PASSWORD_JWT_SECRET not configured');
  }

  const secret = new TextEncoder().encode(EMAIL_PASSWORD_SECRET);
  const { payload } = await jwtVerify(token, secret, {
    issuer: REFRESH_ISSUER,
    audience: 'echopad-api',
  });

  return {
    userId: payload.userId,
    tenantId: payload.tenantId,
    email: payload.email,
    role: payload.role,
  };
}

/**
 * Middleware to verify email/password JWT tokens
 * 
 * Validates:
 * - Token signature using secret
 * - Token expiration
 * - Issuer (iss) matches 'echopad-email-password'
 * 
 * On success, attaches user claims to req.auth:
 * - req.auth.oid: User ID (from userId claim)
 * - req.auth.tid: Tenant ID
 * - req.auth.email: Email
 * - req.auth.roles: Empty array (email/password users don't have Entra roles)
 * - req.auth.provider: 'email-password'
 */
export async function verifyEmailPasswordToken(req, res, next) {
  // Skip if not configured
  if (!EMAIL_PASSWORD_SECRET) {
    return res.status(503).json({
      success: false,
      error: 'Email/password authentication not configured',
      message: 'EMAIL_PASSWORD_JWT_SECRET environment variable must be set',
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
    const secret = new TextEncoder().encode(EMAIL_PASSWORD_SECRET);

    // Verify token
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'echopad-email-password',
      audience: 'echopad-api',
    });

    // Attach claims to request (similar format to Microsoft/Google tokens)
    req.auth = {
      oid: payload.userId, // Use userId as oid for consistency
      tid: payload.tenantId,
      preferred_username: payload.email,
      email: payload.email,
      name: payload.email?.split('@')[0] || 'User',
      roles: [], // Email/password users don't have Entra roles
      provider: 'email-password',
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
    console.error('Email/password token verification failed:', error.message);
    
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
      message: error.message || 'Failed to verify email/password token',
    });
  }
}

/**
 * Middleware to attach user from database for email/password token auth
 * Similar to attachUserFromDb but works with email/password tokens
 */
export async function attachEmailPasswordUserFromDb(req, res, next) {
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
    
    // For email/password tokens, userId is stored in oid
    // Try to find user by ID across all role containers
    let user = null;
    const { USER_ROLES } = await import('../models/user.js');
    const roles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
    
    for (const role of roles) {
      try {
        user = await getUserByIdService(oid, tid, role);
        if (user) {
          break;
        }
      } catch (error) {
        // Continue searching other containers
        if (error.code !== 404) {
          console.warn(`Error searching ${role} container:`, error.message);
        }
      }
    }
    
    // Fallback to email lookup if ID lookup fails
    if (!user && req.auth.email) {
      user = await getUserByEmailAnyRole(req.auth.email, tid);
    }

    if (!user) {
      console.warn(`⚠️ [EMAIL-PASSWORD-AUTH] User not found for token: ${oid.substring(0, 8)}...`);
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
    console.error('Error attaching email/password user from DB:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to load user information',
    });
  }
}
