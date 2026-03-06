/**
 * Aperio app URL and token integration with echopad-aperio.
 *
 * Aperio is served by the backend at /aperio (echopad-aperio SPA). Set VITE_APERIO_URL to
 * override (e.g. when frontend and backend are on different origins).
 *
 * --- How echopad-app currently opens Aperio ---
 * - "Start using Aperio" (ProductDownloadCard) opens Aperio in a NEW TAB via window.open().
 * - When the user is signed in, we append #access_token=<JWT> to the URL so Aperio reads it
 *   from window.location.hash (first token source in echopad-aperio).
 * - We have the token at click time (getAccessToken() from AuthContext).
 *
 * --- Token sources in echopad-aperio (order) ---
 * 1. URL hash – #access_token=... (we use this for new-tab open)
 * 2. postMessage – parent sends { type: 'APERIO_TOKEN', access_token: '...' } (for iframe)
 * 3. Query – ?access_token=... (read once, then removed)
 * 4. Cached token (from any of the above)
 * 5. Env – VITE_APERIO_TOKEN
 *
 * --- If we later embed Aperio in an iframe ---
 * Use sendAperioToken(iframeRef, token) when the iframe has loaded / user signs in, and
 * sendAperioLogout(iframeRef) when the user signs out. See aperioIntegration.js.
 *
 * --- 401 / sign-out ---
 * On 401, Aperio clears its token cache and UI can show "API not configured". For explicit
 * logout inside Aperio, the Aperio app calls clearTokenCache(); when we embed in iframe we
 * send APERIO_LOGOUT so the embedded app clears and re-renders.
 */
const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const inDev = import.meta.env.DEV;
const defaultAperioBase = inDev ? 'http://localhost:3000' : (typeof window !== 'undefined' ? window.location.origin : '');
export const APERIO_APP_URL =
  import.meta.env.VITE_APERIO_URL ||
  (apiBase ? `${apiBase.replace(/\/$/, '')}/aperio` : '') ||
  (defaultAperioBase ? `${defaultAperioBase.replace(/\/$/, '')}/aperio` : '/aperio');
