/**
 * Google OAuth Token Verification Middleware
 * 
 * Validates Google OAuth access tokens and attaches user claims to req.auth
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️  GOOGLE_CLIENT_ID not set. Google auth middleware will fail.');
}

/**
 * Middleware to verify Google OAuth access tokens
 * 
 * Validates:
 * - Token using Google's tokeninfo endpoint
 * - Token expiration
 * - Audience (aud) matches GOOGLE_CLIENT_ID
 * 
 * On success, attaches user claims to req.auth:
 * - req.auth.oid: User ID from Google (sub claim)
 * - req.auth.tid: Tenant ID (using sub as tenant for Google users)
 * - req.auth.email: Email from Google
 * - req.auth.name: Display name from Google
 * - req.auth.roles: Empty array (Google doesn't provide roles)
 * - req.auth.provider: 'google'
 */
export async function verifyGoogleToken(req, res, next) {
  // Skip if not configured
  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({
      success: false,
      error: 'Google authentication not configured',
      message: 'GOOGLE_CLIENT_ID environment variable must be set',
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

    // Verify token using Google's tokeninfo endpoint
    const tokenInfoResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`
    );

    if (!tokenInfoResponse.ok) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Failed to verify Google token',
      });
    }

    const tokenInfo = await tokenInfoResponse.json();

    // Verify the token is for our client ID
    if (tokenInfo.aud !== GOOGLE_CLIENT_ID) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'Token audience does not match configured client ID',
      });
    }

    // Verify token hasn't expired
    if (tokenInfo.exp && tokenInfo.exp < Date.now() / 1000) {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'The authentication token has expired. Please sign in again.',
      });
    }

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userInfoResponse.ok) {
      return res.status(401).json({
        success: false,
        error: 'Failed to fetch user info',
        message: 'Could not retrieve user information from Google',
      });
    }

    const userInfo = await userInfoResponse.json();

    // Attach claims to request (similar format to Microsoft tokens)
    req.auth = {
      oid: tokenInfo.sub || userInfo.sub, // User ID (sub claim)
      tid: tokenInfo.sub || userInfo.sub, // Use sub as tenant ID for Google users
      preferred_username: userInfo.email,
      email: userInfo.email,
      name: userInfo.name || userInfo.email.split('@')[0],
      roles: [], // Google doesn't provide roles
      provider: 'google',
      picture: userInfo.picture,
      // Raw token info for debugging
      _raw: {
        aud: tokenInfo.aud,
        exp: tokenInfo.exp,
        sub: tokenInfo.sub,
      },
    };

    next();
  } catch (error) {
    console.error('Google token verification failed:', error.message);
    
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error.message || 'Failed to verify Google authentication token',
    });
  }
}
