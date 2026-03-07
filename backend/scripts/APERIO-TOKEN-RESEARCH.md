# Token flow: echopad-app ↔ echopad-aperio

## How tokens work on the echopad-app side

### Where tokens come from

| Auth provider   | Access token source | Refresh behavior |
|-----------------|---------------------|------------------|
| **Microsoft**   | MSAL `acquireTokenSilent` / popup; stored in React state | MSAL refreshes automatically; `getAccessToken()` returns current valid token |
| **Google**      | OAuth response; stored in `sessionStorage` (`google_id_token`) | No refresh in app; user re-signs when expired |
| **Email/password** | Backend `POST /api/auth/sign-in-email` returns `sessionToken` (JWT); stored in `sessionStorage` + `localStorage` (`echopad_email_token`) | Backend has `POST /api/auth/refresh`; app stores `refreshToken` in `sessionStorage` (`echopad_email_refresh_token`) but does not auto-refresh in the frontend today |
| **Magic link**   | Backend returns token after magic link; stored in `sessionStorage` (`magic_token`) | No refresh |

### What happens on sign out

- **AuthContext.logout()** clears:
  - Microsoft: `instance.clearCache()`, state cleared, redirect
  - Google: `sessionStorage` `google_id_token` / `google_user`
  - Email/password: `sessionStorage` + `localStorage` for token and session, `EMAIL_REFRESH_TOKEN_SESSION_KEY`
  - Magic: `sessionStorage` `magic_token`
- So after sign out, **a new sign-in always produces new tokens** (new session token for email/password, new MSAL/Google tokens for OAuth).

### How the token is passed to Aperio today

- User clicks **"Start using Aperio"** in `ProductDownloadCard`.
- App calls `getAccessToken()` **once** and appends `#access_token=<JWT>` to `APERIO_APP_URL`, then opens that URL in a **new tab** (`window.open(..., '_blank')`).
- So Aperio receives the token **only at open time** via the URL hash.

---

## The problem on the echopad-aperio side

1. **Token is one-shot**  
   Aperio reads `access_token` from the hash on load, then (optionally) clears the hash and caches the token. It has no way to get a **new** token when:
   - The user has **signed out and signed in again** in echopad-app (new token in app, Aperio tab still has old or none).
   - The **session token has expired** (Aperio keeps using the old JWT and gets 401).

2. **No refresh path**  
   - For **email/password**, the backend exposes `POST /api/auth/refresh` (body: `{ refreshToken }`), but the **refresh token is never passed to Aperio**, so Aperio cannot refresh the session token itself.
   - For **Microsoft/Google**, refresh is handled inside echopad-app (MSAL/Google). Aperio does not have access to that flow.

3. **Cross-tab**  
   Aperio runs in a **separate tab**. When the user signs out in the main app tab, Aperio does not get notified and keeps using the cached (now invalid) token.

So: **we are unable to refresh or update tokens on the echopad-aperio side** with the current design.

---

## Approach: let Aperio request a fresh token from echopad-app

When Aperio is opened from echopad-app, `window.opener` is the echopad-app tab. We can:

1. **echopad-app**  
   - Listens for a postMessage from any window: `{ type: 'APERIO_REQUEST_TOKEN' }`.
   - When received (and origin matches), calls `getAccessToken()`, then sends back to `event.source`: `{ type: 'APERIO_TOKEN', access_token: token }` (or `APERIO_TOKEN_ERROR` on failure).
   - So whenever Aperio needs a fresh token (on load or after 401), it can ask the opener and get the **current** token after sign-in/sign-out.

2. **echopad-aperio**  
   - When opened with `window.opener`:
     - On load: use hash token if present; else send `APERIO_REQUEST_TOKEN` to opener and use the token received via `APERIO_TOKEN` postMessage.
     - On **401**: clear cached token, send `APERIO_REQUEST_TOKEN` to opener; if opener responds with a new token, cache it and retry the request; otherwise show "Please sign in again in the main app and reopen Aperio".
   - When opened without an opener (e.g. direct URL): keep current behavior (hash → env → "API not configured").

This way, **new tokens generated after sign out / sign in on the echopad-app side** are available to Aperio whenever it asks (on load or on 401), without implementing refresh inside Aperio for Microsoft/Google, and without passing a refresh token in the URL.

---

## Optional: email/password refresh inside Aperio

If we later pass the **refresh token** to Aperio in a secure way (e.g. postMessage from opener after load, not in the URL), Aperio could:

- On 401, call `POST /api/auth/refresh` with that refresh token.
- Use the new `sessionToken` from the response and retry the request.

That would allow token refresh entirely inside Aperio for email/password, without going back to the opener. The "request token from opener" approach still works for all providers and is the main fix for "new tokens after sign out / sign in".

---

## Summary

| Topic | Detail |
|-------|--------|
| **Why Aperio can't refresh** | Token is passed once in the URL hash; Aperio caches it and has no channel for a new token after sign out/sign in or expiry. |
| **Fix (echopad-app)** | Global postMessage listener: on `APERIO_REQUEST_TOKEN`, call `getAccessToken()` and send `APERIO_TOKEN` (or error) back to the sender. |
| **Fix (echopad-aperio)** | When `window.opener` exists: on load (if no hash token) and on 401, request token via postMessage and use the response; clear cache and show re-open message if no token. |
| **Optional** | For email/password only: pass refresh token to Aperio (e.g. via postMessage) so Aperio can call `POST /api/auth/refresh` on 401. |

---

## echopad-aperio implementation (request token from opener)

When Aperio is opened in a new tab from echopad-app, `window.opener` is the app tab. To get a fresh token on load or after 401:

1. **On load** (if no token in hash): Send `{ type: 'APERIO_REQUEST_TOKEN' }` to `window.opener`; listen for `APERIO_TOKEN` or `APERIO_TOKEN_ERROR`.
2. **On 401**: Clear cached token, request token from opener; if received, retry; else show "Please sign in again in the main app and reopen Aperio."
3. **Target origin**: Use echopad-app origin (e.g. from `document.referrer` or `VITE_ECHOPAD_APP_ORIGIN`). Allowed origins are in `frontend/src/utils/aperioTokenBridge.js`. **Implemented** in echopad-aperio (APERIO-ECHOPAD-APP-INTEGRATION.md); for cross-origin dev set `VITE_APERIO_URL` in echopad-app and `VITE_ECHOPAD_APP_ORIGIN` in Aperio.
