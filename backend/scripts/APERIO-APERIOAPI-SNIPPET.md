# Permanent fix for echopad-aperio: use callback token from URL hash

Apply this in the **echopad-aperio** repo in `frontend/src/api/aperioApi.js` so the "API not configured" fix survives `npm install` in echopad-app.

## Replace `getToken` and add helpers

Add these at the top of the API layer (after `BASE_URL`), and replace the original `getToken` with the one below:

```js
// Token from URL hash (callback from "Start using Aperio") — read once, then use for all requests
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
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
  return token;
}

function getToken() {
  const fromHash = readAndClearHashToken();
  if (fromHash) return fromHash;
  return typeof import.meta !== 'undefined' ? import.meta.env?.VITE_APERIO_TOKEN : null;
}
```

Keep `isConfigured()` as `return !!getToken();`. All existing API calls that use `getToken()` will then use the hash token when present.
