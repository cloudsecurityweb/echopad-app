/**
 * Authentication Routes
 * 
 * Handles sign-in, sign-up, and user profile endpoints
 */

import express from 'express';
import { verifyEntraToken, attachUserFromDb } from '../middleware/entraAuth.js';
import { verifyGoogleToken } from '../middleware/googleAuth.js';
import { verifyMagicToken, attachMagicUserFromDb } from '../middleware/magicAuth.js';
import { signIn, signUp, getCurrentUser } from '../controllers/authController.js';
import { signUpEmail, signInEmail } from '../controllers/passwordAuthController.js';
import { verifyEmail, resendVerificationEmail } from '../controllers/emailVerificationController.js';

const router = express.Router();

/**
 * Middleware to detect and route to appropriate auth middleware
 * Checks for magic tokens first, then Google, then Microsoft
 */
async function detectAuthProvider(req, res, next) {
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
      
      // Check for magic token first (issuer is 'echopad-magic')
      if (payload.iss === 'echopad-magic') {
        return verifyMagicToken(req, res, (err) => {
          if (err) {
            return next(err);
          }
          // Use magic user attachment instead of regular attachUserFromDb
          return attachMagicUserFromDb(req, res, next);
        });
      }
      
      // Check for Google ID token
      if (payload.iss && payload.iss.includes('accounts.google.com')) {
        return verifyGoogleToken(req, res, next);
      }
      
      // Default to Microsoft token
      return verifyEntraToken(req, res, next);
    } catch (e) {
      // Invalid JWT, try Google verification (for opaque access tokens)
      return verifyGoogleToken(req, res, (err) => {
        if (err) {
          // If Google verification fails, try Microsoft
          return verifyEntraToken(req, res, next);
        }
        next();
      });
    }
  } else {
    // Not a JWT, likely Google access token (opaque)
    return verifyGoogleToken(req, res, (err) => {
      if (err) {
        // If Google verification fails, try Microsoft
        return verifyEntraToken(req, res, next);
      }
      next();
    });
  }
}

/**
 * POST /api/auth/sign-in
 * Sign in with existing account (OAuth - Microsoft/Google)
 * Requires: Authorization header with Bearer token
 * Supports both Microsoft and Google tokens
 */
router.post('/sign-in', detectAuthProvider, signIn);

/**
 * POST /api/auth/sign-up
 * Sign up new organization and user (OAuth - Microsoft/Google)
 * Requires: Authorization header with Bearer token
 * Body: { organizationName?, organizerName?, email? } (all optional for OAuth)
 * Supports both Microsoft and Google tokens
 */
router.post('/sign-up', detectAuthProvider, signUp);

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
