# Aperio: use callback token from URL hash for auth

When the user clicks **"Start using Aperio"** in echopad-app, they are redirected to:

```
http://localhost:5174/#access_token=<JWT>
```

(or `http://localhost:3000/aperio/#access_token=<JWT>` when using the embedded app).

**Goal:** Use this **callback token** (the `access_token` in the hash) for auth in Aperio. Do **not** require `VITE_APERIO_TOKEN` in `.env` when the user arrives with a token in the URL.

---

## 1. Treat “API configured” when token is in hash

Wherever the echopad-aperio app currently checks “API not configured” and requires `VITE_APERIO_TOKEN`, change the logic to:

- **If** there is an `access_token` in `window.location.hash` → treat API as configured and use that token for auth.
- **Else** if `VITE_APERIO_TOKEN` is set (e.g. for standalone dev) → use that.
- **Else** → show “API not configured” and ask for `VITE_APERIO_TOKEN` only for dev.

So: **callback token from hash takes precedence**; env token is only a fallback for dev.

---

## 2. Read the callback token on load

Run this once on app init (e.g. in your root component, `main.jsx`, or an auth provider):

```js
function getTokenFromHash() {
  const hash = window.location.hash.slice(1);
  if (!hash) return null;
  const params = new URLSearchParams(hash);
  const token = params.get('access_token');
  return token ? decodeURIComponent(token) : null;
}
```

Use it like this on load:

```js
let token = getTokenFromHash();
if (token) {
  // Optional: remove token from URL so it isn’t visible or shared
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}
// If no token in hash, fall back to env (e.g. import.meta.env.VITE_APERIO_TOKEN)
if (!token && import.meta.env.VITE_APERIO_TOKEN) {
  token = import.meta.env.VITE_APERIO_TOKEN;
}
// Now: token is either from callback (hash) or from env; use it for “API configured” and for requests
```

---

## 3. Use the token for API auth

- Store the token (e.g. in React state, context, or `sessionStorage`) so the rest of the app can read it.
- On every request to the backend, send:

  ```
  Authorization: Bearer <token>
  ```

- Your existing API layer (e.g. `request()` or `doFetch()` in `aperioApi.js`) should read this token and add the header. Example:

  ```js
  const token = getStoredToken(); // from context or sessionStorage
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  ```

---

## 4. “API configured” check (concrete)

Replace the current “API not configured” condition with something like:

```js
const tokenFromHash = getTokenFromHash();
const tokenFromEnv = import.meta.env.VITE_APERIO_TOKEN;
const hasToken = !!(tokenFromHash || tokenFromEnv);

if (!hasToken) {
  // Show: "API not configured. Set VITE_APERIO_TOKEN in .env for dev, or open Aperio via 'Start using Aperio' from echopad-app."
  return <ApiNotConfiguredMessage />;
}

const token = tokenFromHash || tokenFromEnv;
// Store token, then run app and send it as Bearer on all API calls
```

After reading the token from the hash, call `history.replaceState(...)` so the hash is cleared and the token is no longer in the URL.

---

## 5. Summary

| Source              | When it’s used |
|---------------------|----------------|
| **Hash `#access_token=...`** | When user clicks “Start using Aperio” and is redirected with the callback token. Use this first. |
| **`VITE_APERIO_TOKEN`**     | Optional fallback for local dev (e.g. when opening Aperio directly without going through echopad-app). |

Use the **callback token** from the URL as the main auth token; use `VITE_APERIO_TOKEN` only when there is no token in the hash. That way “Start using Aperio” works without setting any token in `.env`.

**Exact code for `frontend/src/api/aperioApi.js` in the echopad-aperio repo:** see [APERIO-APERIOAPI-SNIPPET.md](APERIO-APERIOAPI-SNIPPET.md).
