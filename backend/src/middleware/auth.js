/**
 * Unified Authentication Middleware
 * 
 * Supports multiple authentication providers:
 * - Email/Password (JWT tokens)
 * - Magic Link (JWT tokens)
 * - Google (OAuth tokens)
 * - Microsoft Entra ID (JWT tokens)
 * 
 * Tries each provider in order until one succeeds or all fail.
 */

import { verifyEmailPasswordToken, attachEmailPasswordUserFromDb } from './emailPasswordAuth.js';
import { verifyMagicToken, attachMagicUserFromDb } from './magicAuth.js';
import { verifyGoogleToken } from './googleAuth.js';
import { verifyEntraToken, attachUserFromDb } from './entraAuth.js';

/**
 * Unified authentication middleware that tries all providers
 * 
 * Order of attempts:
 * 1. Email/Password tokens
 * 2. Magic Link tokens
 * 3. Google tokens
 * 4. Microsoft Entra ID tokens
 * 
 * On success, attaches req.auth and req.currentUser
 */
export async function verifyAnyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
  }

  const token = authHeader.substring(7);
  
  // Try to detect token type by parsing JWT payload (if it's a JWT)
  const parts = token.split('.');
  if (parts.length === 3) {
    // It's a JWT - check issuer to determine type
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Try email/password tokens first
      if (payload.iss === 'echopad-email-password') {
        return verifyEmailPasswordToken(req, res, (err) => {
          if (err) return tryNextProvider(req, res, next, token, 'email-password');
          return attachEmailPasswordUserFromDb(req, res, next);
        });
      }
      
      // Try magic link tokens
      if (payload.iss === 'echopad-magic') {
        return verifyMagicToken(req, res, (err) => {
          if (err) return tryNextProvider(req, res, next, token, 'magic');
          return attachMagicUserFromDb(req, res, next);
        });
      }
      
      // Try Google ID tokens
      if (payload.iss && payload.iss.includes('accounts.google.com')) {
        return verifyGoogleToken(req, res, (err) => {
          if (err) return tryNextProvider(req, res, next, token, 'google');
          return attachUserFromDb(req, res, next);
        });
      }
      
      // Try Microsoft Entra ID tokens (default for unknown JWT issuers)
      if (payload.iss && (payload.iss.includes('login.microsoftonline.com') || payload.iss.includes('sts.windows.net'))) {
        return verifyEntraToken(req, res, (err) => {
          if (err) return tryNextProvider(req, res, next, token, 'microsoft');
          return attachUserFromDb(req, res, next);
        });
      }
      
      // Unknown JWT issuer - try Microsoft first (most common), then Google
      return verifyEntraToken(req, res, (err) => {
        if (err) {
          return verifyGoogleToken(req, res, (err2) => {
            if (err2) {
              return res.status(401).json({
                success: false,
                error: 'Invalid token',
                message: 'Token could not be verified. Please sign in again.',
              });
            }
            return attachUserFromDb(req, res, next);
          });
        }
        return attachUserFromDb(req, res, next);
      });
    } catch (e) {
      // Invalid JWT format - try Google (for opaque tokens), then Microsoft
      return verifyGoogleToken(req, res, (err) => {
        if (err) {
          return verifyEntraToken(req, res, (err2) => {
            if (err2) {
              return res.status(401).json({
                success: false,
                error: 'Invalid token format',
                message: 'Token could not be verified. Please sign in again.',
              });
            }
            return attachUserFromDb(req, res, next);
          });
        }
        return attachUserFromDb(req, res, next);
      });
    }
  } else {
    // Not a JWT (not 3 parts) - try Google (for opaque access tokens), then fail
    return verifyGoogleToken(req, res, (err) => {
      if (err) {
        return res.status(401).json({
          success: false,
          error: 'Invalid token format',
          message: 'Token could not be verified. Please sign in again.',
        });
      }
      return attachUserFromDb(req, res, next);
    });
  }
}

/**
 * Optional authentication middleware
 * Tries to authenticate if a token is provided, but doesn't fail if no token is present or invalid
 * Useful for routes where authentication is optional (e.g., invitation acceptance)
 * 
 * If token is provided and valid, attaches req.auth and req.currentUser
 * If no token is provided or verification fails, continues without setting req.auth
 * The controller can then check req.auth and handle authentication requirements accordingly
 * 
 * Note: This middleware only verifies email/password and magic link tokens.
 * For Microsoft/Google tokens, the controller should use verifyAnyAuth separately if needed.
 */
export async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  // If no auth header, continue without authentication
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);
  
  // Try to detect and verify token type (only for tokens we can verify without sending responses)
  const parts = token.split('.');
  if (parts.length === 3) {
    // It's a JWT - try to verify based on issuer
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Try email/password tokens
      if (payload.iss === 'echopad-email-password') {
        try {
          const { jwtVerify } = await import('jose');
          const EMAIL_PASSWORD_SECRET = process.env.EMAIL_PASSWORD_JWT_SECRET;
          if (EMAIL_PASSWORD_SECRET) {
            const secret = new TextEncoder().encode(EMAIL_PASSWORD_SECRET);
            const { payload: verifiedPayload } = await jwtVerify(token, secret, {
              issuer: 'echopad-email-password',
              audience: 'echopad-api',
            });
            req.auth = {
              oid: verifiedPayload.userId,
              tid: verifiedPayload.tenantId,
              email: verifiedPayload.email,
              roles: [],
              provider: 'email-password',
            };
            // Try to attach user from DB (non-blocking)
            try {
              const { attachEmailPasswordUserFromDb } = await import('./emailPasswordAuth.js');
              return attachEmailPasswordUserFromDb(req, res, (err) => {
                // If user attachment fails, continue without req.currentUser
                return next();
              });
            } catch {
              return next();
            }
          }
        } catch {
          // Verification failed, continue without auth
          return next();
        }
      }
      
      // Try magic link tokens
      if (payload.iss === 'echopad-magic') {
        try {
          const { jwtVerify } = await import('jose');
          const MAGIC_LINK_SECRET = process.env.MAGIC_LINK_JWT_SECRET;
          if (MAGIC_LINK_SECRET) {
            const secret = new TextEncoder().encode(MAGIC_LINK_SECRET);
            const { payload: verifiedPayload } = await jwtVerify(token, secret, {
              issuer: 'echopad-magic',
              audience: 'echopad-api',
            });
            req.auth = {
              oid: verifiedPayload.userId,
              tid: verifiedPayload.tenantId,
              email: verifiedPayload.email,
              roles: [],
              provider: 'magic',
            };
            try {
              const { attachMagicUserFromDb } = await import('./magicAuth.js');
              return attachMagicUserFromDb(req, res, (err) => {
                return next();
              });
            } catch {
              return next();
            }
          }
        } catch {
          return next();
        }
      }
      
      // Try Microsoft Entra ID tokens (for invitation acceptance with Microsoft auth)
      if (payload.iss && (payload.iss.includes('login.microsoftonline.com') || payload.iss.includes('sts.windows.net'))) {
        try {
          // Manually verify Microsoft token using JWKS (similar to verifyEntraToken)
          const { jwtVerify, createRemoteJWKSet } = await import('jose');
          const TENANT_ID = process.env.AZURE_TENANT_ID;
          const CLIENT_ID = process.env.AZURE_CLIENT_ID;
          
          if (TENANT_ID && CLIENT_ID) {
            // Extract tenant ID from issuer
            let tokenTenantId = TENANT_ID;
            const loginMatch = payload.iss.match(/login\.microsoftonline\.com\/([^\/]+)/);
            const stsMatch = payload.iss.match(/sts\.windows\.net\/([^\/]+)/);
            if (loginMatch) {
              tokenTenantId = loginMatch[1];
            } else if (stsMatch) {
              tokenTenantId = stsMatch[1];
            }
            
            // Create JWKS client for the token's tenant
            const JWKS_URL = `https://login.microsoftonline.com/${tokenTenantId}/discovery/v2.0/keys`;
            const JWKS = createRemoteJWKSet(new URL(JWKS_URL));
            
            // Verify token
            const { payload: verifiedPayload } = await jwtVerify(token, JWKS, {
              audience: CLIENT_ID,
            });
            
            req.auth = {
              oid: verifiedPayload.oid || verifiedPayload.sub,
              tid: verifiedPayload.tid || tokenTenantId,
              email: verifiedPayload.email || verifiedPayload.preferred_username || verifiedPayload.upn,
              roles: verifiedPayload.roles || [],
              provider: 'microsoft',
            };
            
            // Try to attach user from DB
            try {
              return attachUserFromDb(req, res, next);
            } catch {
              return next();
            }
          }
        } catch {
          // Microsoft token verification failed, continue without auth
          // Controller will handle Microsoft auth requirements
          return next();
        }
      }
      
      // Try Google tokens (similar approach)
      if (payload.iss && payload.iss.includes('accounts.google.com')) {
        // Google token verification is complex (requires tokeninfo API call)
        // For now, skip - controller can handle it if needed
        // Or we could add Google verification here later
        return next();
      }
    } catch (e) {
      // Invalid JWT format, continue without auth
      return next();
    }
  }
  
  // Not a JWT or couldn't verify - continue without auth
  return next();
}

/**
 * Helper function to try next authentication provider
 * Currently not used but kept for future extensibility
 */
function tryNextProvider(req, res, next, token, failedProvider) {
  // For now, if one provider fails, we don't try others
  // This could be enhanced to try remaining providers
  return next();
}
