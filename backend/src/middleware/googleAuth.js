/**
 * Google OAuth Token Verification Middleware
 *
 * Validates Google OAuth access tokens or ID tokens and attaches user claims to req.auth
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const PLACEHOLDER_GOOGLE = /^your-google-client-id/i;

if (!GOOGLE_CLIENT_ID) {
  console.warn('⚠️  GOOGLE_CLIENT_ID not set. Google auth middleware will fail.');
}

/**
 * Decode JWT payload without verification (handles base64url)
 * @param {string} payloadB64 - Base64url-encoded payload
 * @returns {object|null} Decoded payload or null
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

/**
 * Detect if token is a Google ID token (JWT with iss containing accounts.google.com)
 * @param {string} token - Bearer token
 * @returns {boolean}
 */
function isGoogleIdToken(token) {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const payload = decodeJwtPayload(parts[1]);
  return payload && payload.iss && String(payload.iss).includes('accounts.google.com');
}

/**
 * Development only: accept Google ID token by decoding without verification (like email/password).
 */
function tryDevBypassGoogleToken(token, req, res, next) {
  if (process.env.NODE_ENV !== 'development') return false;
  const claims = tryDevBypassGoogleTokenReturnsClaims(token);
  if (!claims) return false;
  req.auth = claims;
  next();
  return true;
}

/** In development only: decode Google ID token and return claims without tokeninfo. Returns null if not applicable. */
function tryDevBypassGoogleTokenReturnsClaims(token) {
  if (process.env.NODE_ENV !== 'development') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payload = decodeJwtPayload(parts[1]);
  if (!payload) return null;
  const iss = payload.iss && String(payload.iss);
  if (!iss || !iss.includes('accounts.google.com')) return null;
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  const sub = payload.sub;
  if (!sub) return null;

  console.warn('⚠️ [GOOGLE-AUTH] Development bypass: accepting Google token without tokeninfo. Set GOOGLE_CLIENT_ID in .env for production.');
  return {
    oid: sub,
    tid: sub,
    preferred_username: payload.email,
    email: payload.email,
    name: payload.name || (payload.email && payload.email.split('@')[0]) || 'User',
    roles: [],
    provider: 'google',
    picture: payload.picture,
    _raw: { aud: payload.aud, exp: payload.exp, sub: payload.sub },
  };
}

/**
 * Verify a Google OAuth token (standalone, for use in controllers).
 * @param {string} token - Raw ID token or access token string
 * @returns {Promise<object>} Claims object (oid, tid, email, name, roles: [], provider: 'google', ...)
 * @throws {Error} On verification failure
 */
export async function verifyGoogleTokenStandalone(token) {
  const notConfigured = !GOOGLE_CLIENT_ID || PLACEHOLDER_GOOGLE.test(String(GOOGLE_CLIENT_ID).trim());
  if (process.env.NODE_ENV === 'development' && notConfigured) {
    const claims = tryDevBypassGoogleTokenReturnsClaims(token);
    if (claims) return claims;
    throw new Error('Google authentication not configured. GOOGLE_CLIENT_ID environment variable must be set.');
  }
  if (!GOOGLE_CLIENT_ID) {
    throw new Error('Google authentication not configured. GOOGLE_CLIENT_ID environment variable must be set.');
  }

  const useIdToken = isGoogleIdToken(token);
  const tokeninfoParam = useIdToken ? 'id_token' : 'access_token';
  const tokeninfoUrl = `https://oauth2.googleapis.com/tokeninfo?${tokeninfoParam}=${encodeURIComponent(token)}`;

  const tokenInfoResponse = await fetch(tokeninfoUrl);

  if (!tokenInfoResponse.ok) {
    if (process.env.NODE_ENV === 'development') {
      const claims = tryDevBypassGoogleTokenReturnsClaims(token);
      if (claims) return claims;
    }
    throw new Error('Failed to verify Google token');
  }

  const tokenInfo = await tokenInfoResponse.json();

  const audMatches = Array.isArray(tokenInfo.aud)
    ? tokenInfo.aud.includes(GOOGLE_CLIENT_ID)
    : tokenInfo.aud === GOOGLE_CLIENT_ID;
  if (!audMatches) {
    throw new Error('Token audience does not match configured client ID');
  }

  if (tokenInfo.exp && tokenInfo.exp < Date.now() / 1000) {
    throw new Error('The authentication token has expired. Please sign in again.');
  }

  let userInfo = { email: tokenInfo.email, name: tokenInfo.name, picture: tokenInfo.picture, sub: tokenInfo.sub };
  if (!useIdToken) {
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!userInfoResponse.ok) {
      throw new Error('Could not retrieve user information from Google');
    }
    userInfo = await userInfoResponse.json();
  }

  return {
    oid: tokenInfo.sub || userInfo.sub,
    tid: tokenInfo.sub || userInfo.sub,
    preferred_username: userInfo.email,
    email: userInfo.email,
    name: userInfo.name || (userInfo.email && userInfo.email.split('@')[0]) || 'User',
    roles: [],
    provider: 'google',
    picture: userInfo.picture,
    _raw: { aud: tokenInfo.aud, exp: tokenInfo.exp, sub: tokenInfo.sub },
  };
}

/**
 * Middleware to verify Google OAuth access tokens or ID tokens
 *
 * Validates:
 * - Token using Google's tokeninfo endpoint (access_token= or id_token= as appropriate)
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
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
    });
  }

  const token = authHeader.substring(7);

  const notConfigured = !GOOGLE_CLIENT_ID || PLACEHOLDER_GOOGLE.test(String(GOOGLE_CLIENT_ID).trim());
  if (process.env.NODE_ENV === 'development' && notConfigured) {
    if (tryDevBypassGoogleToken(token, req, res, next)) return;
    return res.status(503).json({
      success: false,
      error: 'Google authentication not configured',
      message: 'GOOGLE_CLIENT_ID environment variable must be set',
    });
  }

  if (!GOOGLE_CLIENT_ID) {
    return res.status(503).json({
      success: false,
      error: 'Google authentication not configured',
      message: 'GOOGLE_CLIENT_ID environment variable must be set',
    });
  }

  try {
    req.auth = await verifyGoogleTokenStandalone(token);
    next();
  } catch (error) {
    if (process.env.NODE_ENV === 'development' && tryDevBypassGoogleToken(token, req, res, next)) return;
    console.error('Google token verification failed:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed',
      message: error.message || 'Failed to verify Google authentication token',
    });
  }
}
