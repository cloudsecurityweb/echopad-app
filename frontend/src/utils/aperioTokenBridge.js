/**
 * Aperio token bridge: when Aperio is opened in a new tab (window.opener = echopad-app),
 * it can request a fresh token by posting APERIO_REQUEST_TOKEN. We respond with the
 * current token so that after sign-out/sign-in new tokens are available in Aperio
 * without reopening the tab.
 *
 * Message protocol:
 * - Child (Aperio) -> Parent (echopad-app): { type: 'APERIO_REQUEST_TOKEN' }
 * - Parent -> Child: { type: 'APERIO_TOKEN', access_token: string } | { type: 'APERIO_TOKEN_ERROR', error: string }
 */

import { authRef } from '../api/auth';
import { APERIO_APP_URL } from '../config/aperio';

const MESSAGE_TYPE_REQUEST = 'APERIO_REQUEST_TOKEN';
const MESSAGE_TYPE_TOKEN = 'APERIO_TOKEN';
const MESSAGE_TYPE_ERROR = 'APERIO_TOKEN_ERROR';

function getAllowedOrigins() {
  const origins = [window.location.origin];
  try {
    const url = APERIO_APP_URL.startsWith('http') ? APERIO_APP_URL : new URL(APERIO_APP_URL, window.location.origin).href;
    const aperioOrigin = new URL(url).origin;
    if (aperioOrigin && aperioOrigin !== window.location.origin) {
      origins.push(aperioOrigin);
    }
  } catch {
    // ignore
  }
  return origins;
}

export function initAperioTokenBridge() {
  if (typeof window === 'undefined') return;

  const allowedOrigins = getAllowedOrigins();

  const handler = async (event) => {
    if (event.data?.type !== MESSAGE_TYPE_REQUEST || !event.source || event.source === window) return;
    if (!allowedOrigins.includes(event.origin)) return;

    try {
      const token = await authRef.getAccessToken();
      event.source.postMessage(
        token ? { type: MESSAGE_TYPE_TOKEN, access_token: token } : { type: MESSAGE_TYPE_ERROR, error: 'No token available' },
        event.origin
      );
    } catch (err) {
      if (typeof import.meta !== 'undefined' && import.meta.env?.DEV) {
        console.warn('[Aperio] Token bridge: getAccessToken failed — Aperio may show "API not configured"', err?.message || err);
      }
      event.source.postMessage(
        { type: MESSAGE_TYPE_ERROR, error: err?.message || 'Failed to get token' },
        event.origin
      );
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}
