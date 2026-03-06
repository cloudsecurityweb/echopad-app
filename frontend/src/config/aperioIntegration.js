/**
 * Helpers to pass token to Aperio when it is embedded in an iframe (echopad-aperio
 * postMessage / direct API). Not used when Aperio is opened in a new tab with hash.
 *
 * When you have an iframe that loads the Aperio SPA (e.g. <iframe src="/aperio" ref={aperioRef} />):
 * - After load or when the user signs in: sendAperioToken(aperioRef, accessToken)
 * - When the user signs out: sendAperioLogout(aperioRef)
 *
 * Aperio accepts:
 * - postMessage: { type: 'APERIO_TOKEN', access_token } | { type: 'APERIO_LOGOUT' }
 * - Direct (same-origin): contentWindow.__APERIO_SET_TOKEN__(token) | __APERIO_CLEAR_TOKEN__()
 */

const MESSAGE_TYPE_TOKEN = 'APERIO_TOKEN';
const MESSAGE_TYPE_LOGOUT = 'APERIO_LOGOUT';

/**
 * Send the current access token to the Aperio iframe so it can call the API.
 * Safe to call when ref is null or the iframe isn't loaded yet.
 * @param {React.RefObject<HTMLIFrameElement>|{ current: HTMLIFrameElement | null }} iframeRef
 * @param {string} accessToken
 */
export function sendAperioToken(iframeRef, accessToken) {
  const frame = iframeRef?.current;
  const win = frame?.contentWindow;
  if (!win || !accessToken) return;
  try {
    if (typeof win.__APERIO_SET_TOKEN__ === 'function') {
      win.__APERIO_SET_TOKEN__(accessToken);
    } else {
      win.postMessage({ type: MESSAGE_TYPE_TOKEN, access_token: accessToken }, window.location.origin);
    }
  } catch (e) {
    console.warn('[Aperio] Could not send token to iframe:', e);
  }
}

/**
 * Tell the Aperio iframe to clear its token (e.g. on sign-out).
 * Safe to call when ref is null.
 * @param {React.RefObject<HTMLIFrameElement>|{ current: HTMLIFrameElement | null }} iframeRef
 */
export function sendAperioLogout(iframeRef) {
  const frame = iframeRef?.current;
  const win = frame?.contentWindow;
  if (!win) return;
  try {
    if (typeof win.__APERIO_CLEAR_TOKEN__ === 'function') {
      win.__APERIO_CLEAR_TOKEN__();
    } else {
      win.postMessage({ type: MESSAGE_TYPE_LOGOUT }, window.location.origin);
    }
  } catch (e) {
    console.warn('[Aperio] Could not send logout to iframe:', e);
  }
}
