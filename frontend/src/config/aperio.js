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
 */
const apiBase = import.meta.env.VITE_API_BASE_URL || '';
export const APERIO_APP_URL = import.meta.env.VITE_APERIO_URL || (apiBase ? `${apiBase.replace(/\/$/, '')}/aperio` : '/aperio');
