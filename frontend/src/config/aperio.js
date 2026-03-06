/**
 * Aperio app URL for redirects and links.
 * Points to the Aperio SPA from echopad-aperio repo, served by the backend at /aperio.
 * Set VITE_APERIO_URL to override (e.g. when frontend and backend are on different origins).
 *
 * When used from echopad-app, Aperio runs on the same server — only the Echopad app backend
 * needs to be running (no separate Aperio server on port 3001).
 *
 * When the user is logged in, "Start using Aperio" appends #access_token=<JWT> so the Aperio app
 * can use it for Authorization: Bearer when calling the same backend. echopad-aperio should read
 * window.location.hash or use a router hash fragment to get access_token on load.
 *
 * In dev, if neither env is set, we default to backend :3000/aperio so the link opens the real
 * Aperio SPA (not the main app's /aperio marketing route).
 */
const apiBase = import.meta.env.VITE_API_BASE_URL || '';
const inDev = import.meta.env.DEV;
const defaultAperioBase = inDev ? 'http://localhost:3000' : (typeof window !== 'undefined' ? window.location.origin : '');
export const APERIO_APP_URL =
  import.meta.env.VITE_APERIO_URL ||
  (apiBase ? `${apiBase.replace(/\/$/, '')}/aperio` : '') ||
  (defaultAperioBase ? `${defaultAperioBase.replace(/\/$/, '')}/aperio` : '/aperio');
