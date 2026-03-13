# Sign-in and Sign-out in echopad-app → Implement in echopad-aperio

This document explains how **sign-in** and **sign-out** work in **echopad-app** and how to implement the same token flow in **echopad-aperio** so the "API not configured" issue is resolved after sign-in/sign-out.

---

## 1. How echopad-app handles sign-in

### 1.1 Auth providers

- **Microsoft (MSAL)** – popup/redirect, token from `instance.acquireTokenSilent` / `acquireTokenPopup`
- **Google** – OAuth, token in `sessionStorage` (`google_id_token`)
- **Email/password** – backend returns `sessionToken`; stored in `sessionStorage` + `localStorage` (`echopad_email_token`)
- **Magic link** – token in `sessionStorage` (`magic_token`)

### 1.2 Getting the access token in echopad-app

- **AuthContext** exposes `getAccessToken()` which returns the right token based on `authProvider`.
- **authRef** (in `frontend/src/api/auth.js`) is set to the same function so code that doesn’t have React context (e.g. the Aperio token bridge) can get the token:

```js
// frontend/src/api/auth.js
export const authRef = {
  getAccessToken: () => Promise.resolve(null),  // overwritten by AuthContext
};
// In AuthContext.jsx:
authRef.getAccessToken = getAccessToken;
```

### 1.3 Opening Aperio with the token (sign-in flow)

When the user clicks **"Start using Aperio"**:

1. **ProductDownloadCard** (`frontend/src/components/products/ProductDownloadCard.jsx`):
   - If `isAuthenticated`, calls `getAccessToken()`.
   - Builds URL: `APERIO_APP_URL + '/#access_token=' + encodeURIComponent(token)`.
   - Opens it in a new tab: `window.open(url, '_blank', 'noopener,noreferrer')`.

So **Aperio always receives the token in the URL hash** when opened from the dashboard while the user is signed in.

---

## 2. How echopad-app handles sign-out

### 2.1 Logout flow

- **"Sign out"** is wired in:
  - `DashboardNavbar.jsx` – `handleLogout` → `logout('popup')`
  - `Navigation.jsx` – same
  - `Settings.jsx` – same
- **AuthContext.logout** (`frontend/src/contexts/AuthContext.jsx`):
  - Clears provider-specific state (tokens, `sessionStorage`, `localStorage`).
  - For Microsoft: `instance.clearCache()`; for `'local'` then `window.location.href = redirectTo` (full page redirect).
  - For Google/Email/Magic: clears their storage and then redirects.

So after sign-out, the main app does a **full page redirect**; no token is left in the app.

### 2.2 Aperio token bridge (new-tab scenario)

- **Aperio opened in a new tab**: `window.opener` is the echopad-app tab.
- **aperioTokenBridge** (`frontend/src/utils/aperioTokenBridge.js`) runs inside echopad-app and listens for `postMessage`.
- When Aperio (child) sends `{ type: 'APERIO_REQUEST_TOKEN' }`, the parent (echopad-app) calls `authRef.getAccessToken()` and replies with:
  - `{ type: 'APERIO_TOKEN', access_token: token }` or
  - `{ type: 'APERIO_TOKEN_ERROR', error: '...' }`

So:

- **After sign-in**: Aperio can get a fresh token by sending `APERIO_REQUEST_TOKEN` to `window.opener`; parent responds with the current token.
- **After sign-out**: Parent has no token; it responds with `APERIO_TOKEN_ERROR`. Aperio should treat that as “not configured” / “please sign in from the main app” and clear its own token.

### 2.3 Iframe scenario (for reference)

If Aperio is ever embedded in an iframe:

- **aperioIntegration.js**: `sendAperioToken(iframeRef, accessToken)` and `sendAperioLogout(iframeRef)`.
- On sign-out, the app would call `sendAperioLogout(iframeRef)` so Aperio receives `{ type: 'APERIO_LOGOUT' }` and must clear its token and re-render.

---

## 3. Token sources in echopad-aperio (order to implement)

Implement this order in **echopad-aperio** so it matches echopad-app’s behavior:

| Priority | Source | When it’s used |
|----------|--------|----------------|
| 1 | **URL hash** `#access_token=...` | User clicked "Start using Aperio" while signed in. |
| 2 | **postMessage** from parent | `{ type: 'APERIO_TOKEN', access_token }` (e.g. iframe). |
| 3 | **Request to opener** | Aperio sends `{ type: 'APERIO_REQUEST_TOKEN' }` to `window.opener`; parent responds with `APERIO_TOKEN` or `APERIO_TOKEN_ERROR`. Use this after sign-in in the main app or when Aperio needs to refresh the token. |
| 4 | **Query** `?access_token=...` | Optional; read once and remove from URL. |
| 5 | **Cached token** | In memory or sessionStorage from one of the above. |
| 6 | **Env** `VITE_APERIO_TOKEN` | Fallback for standalone dev only. |

“API configured” = you have a token from **any** of these. Only show “API not configured” when **all** of these are missing (and after requesting from opener if you have an opener).

---

## 4. What to implement in echopad-aperio

### 4.1 Read token from URL hash on load

- On app init, parse `window.location.hash` for `access_token`.
- If present: store the token, then clear the hash with `history.replaceState` so the token is not visible or reused in the URL.
- Use this token as the first source before env.

Example (align with your existing API module, e.g. `frontend/src/api/aperioApi.js`):

```js
let tokenFromHash = null;

function getTokenFromHash() {
  if (typeof window === 'undefined') return null;
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');
  if (!token) return null;
  try {
    return decodeURIComponent(token);
  } catch {
    return token;
  }
}

function readAndClearHashToken() {
  if (tokenFromHash != null) return tokenFromHash;
  const token = getTokenFromHash();
  if (token) {
    tokenFromHash = token;
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }
  return token;
}
```

### 4.2 Single `getToken()` used everywhere

Implement one function that checks sources in the order above, e.g.:

```js
// 1) Hash (from "Start using Aperio")
// 2) postMessage / setter from parent (store in a variable when you receive APERIO_TOKEN)
// 3) Request to opener (see below)
// 4) Env
function getToken() {
  const fromHash = readAndClearHashToken();
  if (fromHash) return fromHash;
  if (cachedTokenFromParent) return cachedTokenFromParent;  // set by postMessage handler
  return import.meta.env?.VITE_APERIO_TOKEN ?? null;
}
```

- Use this `getToken()` for both “is API configured?” and for `Authorization: Bearer <token>` on every request.
- When you add “request to opener”, that path should **set** the cached token (or clear it on error) and then return it; see below.

### 4.3 Request token from opener (after sign-in/sign-out)

When Aperio is opened as a new tab from echopad-app:

- If there is **no** token from hash/postMessage/cache/env, and `window.opener` exists and is not closed:
  1. Post to opener: `window.opener.postMessage({ type: 'APERIO_REQUEST_TOKEN' }, targetOrigin)`.
  2. Listen once for `message` with `event.data.type === 'APERIO_TOKEN'` or `'APERIO_TOKEN_ERROR'`.
  3. If `APERIO_TOKEN`: save `event.data.access_token` in your cache and use it (and return it from `getToken()`).
  4. If `APERIO_TOKEN_ERROR`: clear cache and show “API not configured” or “Please sign in from the main app”.

Implement `targetOrigin` from your config (e.g. `VITE_ECHOPAD_APP_ORIGIN` or the same origin if same-origin). Only accept messages from that origin.

Example (conceptual):

```js
const APERIO_REQUEST_TOKEN = 'APERIO_REQUEST_TOKEN';
const APERIO_TOKEN = 'APERIO_TOKEN';
const APERIO_TOKEN_ERROR = 'APERIO_TOKEN_ERROR';

function requestTokenFromOpener() {
  return new Promise((resolve) => {
    if (!window.opener || window.opener.closed) {
      resolve(null);
      return;
    }
    const origin = import.meta.env.VITE_ECHOPAD_APP_ORIGIN || window.location.origin;
    const handler = (event) => {
      if (event.origin !== origin) return;
      if (event.data?.type === APERIO_TOKEN && event.data.access_token) {
        cachedTokenFromParent = event.data.access_token;
        window.removeEventListener('message', handler);
        resolve(cachedTokenFromParent);
      } else if (event.data?.type === APERIO_TOKEN_ERROR) {
        cachedTokenFromParent = null;
        window.removeEventListener('message', handler);
        resolve(null);
      }
    };
    window.addEventListener('message', handler);
    window.opener.postMessage({ type: APERIO_REQUEST_TOKEN }, origin);
    // Optional: timeout after 2–3s and resolve(null)
  });
}
```

Call this when you need a token and don’t have one yet (e.g. on first load when hash is empty, or after you’ve cleared token on 401 or APERIO_LOGOUT).

### 4.4 Handle APERIO_LOGOUT (iframe)

If Aperio is embedded via iframe, listen for:

```js
if (event.data?.type === 'APERIO_LOGOUT') {
  cachedTokenFromParent = null;
  tokenFromHash = null;  // if you want to clear hash-sourced cache too
  // Re-render so "API not configured" shows
}
```

Clear all in-memory (and optionally sessionStorage) token caches and re-run your “is configured?” logic.

### 4.5 “API not configured” condition

Only show “API not configured” when:

- You have **no** token from hash, and  
- You have **no** token from postMessage/opener, and  
- You have **no** `VITE_APERIO_TOKEN`,  
and optionally after you’ve tried `requestTokenFromOpener()` once when `window.opener` exists.

Message can be:

- *“API not configured. Set VITE_APERIO_TOKEN in .env for standalone dev, or open Aperio via ‘Start using Aperio’ from echopad-app.”*

---

## 5. Summary

| Topic | echopad-app | echopad-aperio |
|-------|-------------|----------------|
| **Sign-in** | Multiple providers; token from AuthContext / authRef. | Receive token via **hash** (main path), postMessage, or request to opener. |
| **Opening Aperio** | ProductDownloadCard adds `#access_token=<token>` and opens in new tab. | Read hash first; clear it; use token for API and “configured” check. |
| **Sign-out** | Logout clears state and redirects; authRef.getAccessToken() then returns nothing. | When opener sends APERIO_TOKEN_ERROR or APERIO_LOGOUT, clear token and show “not configured”. |
| **After sign-in again** | User opens “Start using Aperio” again → new tab with hash. Or Aperio tab can request token from opener. | Hash on new open, or request token from opener in existing tab. |
| **API base URL** | N/A | Use `VITE_APERIO_API_URL`; when embedded, often empty (same origin). |

Implementing the **hash first**, then **request-from-opener**, then **env** in echopad-aperio will align its behavior with echopad-app’s sign-in and sign-out and resolve the “API not configured” issue when the user signs in or signs out in the main app.
