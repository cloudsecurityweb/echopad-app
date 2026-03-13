/**
 * EchoPad Electron desktop app auth only.
 * Do not use for Aperio. Aperio has its own flow: config/aperio.js, aperioTokenBridge.js, aperioIntegration.js.
 *
 * Flow: Desktop app opens web app with ?redirect_uri=http://localhost:...
 * → SignIn stores payload in sessionStorage under DESKTOP_REDIRECT_KEY
 * → Navigate to /login-complete → LoginComplete reads payload and redirects back to desktop app with token in URL.
 */

export const DESKTOP_REDIRECT_KEY = 'echopad_desktop_redirect';

/**
 * Validates that the redirect URI is allowed for the Electron desktop app (localhost, http only).
 * @param {string} uri
 * @returns {boolean}
 */
export function isValidDesktopRedirectUri(uri) {
  try {
    const url = new URL(uri);
    return url.hostname === 'localhost' && url.protocol === 'http:';
  } catch {
    return false;
  }
}
