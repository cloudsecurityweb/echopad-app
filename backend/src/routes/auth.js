/**
 * Authentication Routes
 * 
 * Handles sign-in, sign-up, and user profile endpoints
 */

import express from 'express';
import { verifyEntraToken, attachUserFromDb } from '../middleware/entraAuth.js';
import { verifyGoogleToken } from '../middleware/googleAuth.js';
import { verifyMagicToken, attachMagicUserFromDb } from '../middleware/magicAuth.js';
import { verifyEmailPasswordToken, attachEmailPasswordUserFromDb } from '../middleware/emailPasswordAuth.js';
import { signIn, signUp, getCurrentUser } from '../controllers/authController.js';
import { signUpEmail, signInEmail } from '../controllers/passwordAuthController.js';
import { verifyEmail, resendVerificationEmail } from '../controllers/emailVerificationController.js';

const router = express.Router();

/**
 * Middleware to detect and route to appropriate auth middleware
 * Checks for magic tokens first, then Google, then Microsoft
 */
export async function detectAuthProvider(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return verifyEntraToken(req, res, next);
  }

  const token = req.headers.authorization.substring(7);
  
  // Try to detect if it's a JWT
  const parts = token.split('.');
  if (parts.length === 3) {
    // It's a JWT - check issuer to determine type
    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      
      // Debug logging in development
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [AUTH-DETECT] JWT detected, issuer:', payload.iss || 'no issuer');
      }
      
      // Check for magic token first (issuer is 'echopad-magic')
      if (payload.iss === 'echopad-magic') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 [AUTH-DETECT] Routing to Magic token verification');
        }
        return verifyMagicToken(req, res, (err) => {
          if (err) {
            return next(err);
          }
          // Use magic user attachment instead of regular attachUserFromDb
          return attachMagicUserFromDb(req, res, next);
        });
      }
      
      // Check for email/password token (issuer is 'echopad-email-password')
      if (payload.iss === 'echopad-email-password') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 [AUTH-DETECT] Routing to Email/Password token verification');
        }
        return verifyEmailPasswordToken(req, res, (err) => {
          if (err) {
            return next(err);
          }
          return attachEmailPasswordUserFromDb(req, res, next);
        });
      }
      
      // Check for Google ID token (explicit check)
      if (payload.iss && payload.iss.includes('accounts.google.com')) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 [AUTH-DETECT] Routing to Google token verification (ID token)');
        }
        return verifyGoogleToken(req, res, next);
      }
      
      // Check for Microsoft token (issuer contains login.microsoftonline.com or sts.windows.net)
      // Microsoft tokens are always JWTs, so check this before fallback
      // Note: Microsoft tokens can have issuer: login.microsoftonline.com or sts.windows.net
      if (payload.iss && (payload.iss.includes('login.microsoftonline.com') || payload.iss.includes('sts.windows.net'))) {
        if (process.env.NODE_ENV === 'development') {
          console.log('🔍 [AUTH-DETECT] Routing to Microsoft token verification');
        }
        return verifyEntraToken(req, res, next);
      }
      
      // If issuer doesn't match known providers and it's a JWT:
      // - Microsoft tokens are always JWTs, so try Microsoft first
      // - Google ID tokens are also JWTs, but we already checked for those
      // Default to Microsoft for unknown JWT issuers (most likely Microsoft)
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 [AUTH-DETECT] Unknown JWT issuer, defaulting to Microsoft verification');
      }
      return verifyEntraToken(req, res, (err) => {
        if (err) {
          // If Microsoft verification fails, try Google as fallback
          // (in case it's a Google ID token with unexpected issuer format)
          if (process.env.NODE_ENV === 'development') {
            console.log('🔍 [AUTH-DETECT] Microsoft verification failed, trying Google as fallback');
          }
          return verifyGoogleToken(req, res, (err2) => {
            if (err2) {
              // Both failed, return the original Microsoft error (more likely)
              return next(err);
            }
            next();
          });
        }
        next();
      });
    } catch (e) {
      // Invalid JWT format - can't parse payload
      // Microsoft tokens are always valid JWTs, so this is likely not Microsoft
      // Try Google first (for opaque access tokens), then Microsoft as fallback
      return verifyGoogleToken(req, res, (err) => {
        if (err) {
          // If Google verification fails, try Microsoft (might be a malformed JWT)
          return verifyEntraToken(req, res, next);
        }
        next();
      });
    }
  } else {
    // Not a JWT (not 3 parts)
    // Microsoft tokens are always JWTs, so this is NOT a Microsoft token
    // Google access tokens are opaque (not JWTs), so try Google first
    return verifyGoogleToken(req, res, (err) => {
      if (err) {
        // If Google verification fails, don't try Microsoft for non-JWT tokens
        // Non-JWT tokens that aren't Google are likely invalid
        return res.status(401).json({
          success: false,
          error: 'Invalid token format',
          message: 'Token could not be verified. Please sign in again.',
        });
      }
      next();
    });
  }
}

/**
 * POST /api/auth/sign-in
 * Sign in with existing account (OAuth - Microsoft/Google)
 * Body: { provider: 'microsoft'|'google', token: string } (required)
 * Token verification is provider-driven; no Bearer header for this endpoint.
 */
router.post('/sign-in', signIn);

/**
 * POST /api/auth/sign-up
 * Sign up new organization and user (OAuth - Microsoft/Google)
 * Body: { provider: 'microsoft'|'google', token: string, organizationName?, organizerName?, email? }
 * Token verification is provider-driven; no Bearer header for this endpoint.
 */
router.post('/sign-up', signUp);

/**
 * POST /api/auth/sign-up-email
 * Sign up with email and password
 * Body: { organizationName, organizerName, email, password }
 */
router.post('/sign-up-email', signUpEmail);

/**
 * POST /api/auth/sign-in-email
 * Sign in with email and password
 * Body: { email, password }
 */
router.post('/sign-in-email', signInEmail);

/**
 * GET /api/auth/verify-email
 * Verify email address using token
 * Query: ?email=xxx&token=xxx
 */
router.get('/verify-email', verifyEmail);

/**
 * POST /api/auth/resend-verification
 * Resend verification email
 * Body: { email }
 */
router.post('/resend-verification', resendVerificationEmail);

/**
 * GET /api/auth/me
 * Get current user profile
 * Requires: Authorization header with Bearer token
 * Supports Microsoft, Google, and Magic tokens
 * Note: detectAuthProvider handles routing to appropriate middleware
 */
router.get('/me', detectAuthProvider, getCurrentUser);

export default router;
