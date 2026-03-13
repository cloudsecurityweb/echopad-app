# Implementing same-origin default in echopad-aperio (side project)

Apply these changes in the **echopad-aperio** repo so that when embedded in echopad-app the frontend uses the same server, and when run standalone it can still use a separate backend.

---

## 1. API base config (default = same origin)

**Where:** Frontend config that builds the API base URL (e.g. `src/config.js`, `src/config/api.js`, or wherever you read `import.meta.env`).

**Before (example):**
```js
export const API_BASE = import.meta.env.VITE_APERIO_API_URL ?? 'http://localhost:3001';
```

**After:**
```js
// Default empty = same origin (for echopad-app embed). Set VITE_APERIO_API_URL only when
// running Aperio frontend standalone (e.g. Vite on 5174) to point at standalone backend (e.g. 3001).
export const API_BASE = import.meta.env.VITE_APERIO_API_URL ?? '';
```

So:
- **Embedded in echopad-app:** Don’t set `VITE_APERIO_API_URL`. Requests are relative (e.g. `/api/aperio/transfers`) and go to the same host that serves the page (echopad-app backend).
- **Standalone:** In Aperio’s `.env` set `VITE_APERIO_API_URL=http://localhost:3001` (or your standalone backend URL).

Use `API_BASE` when building request URLs, e.g.:
```js
const url = `${API_BASE}/api/aperio/transfers`;
// If API_BASE is '' → '/api/aperio/transfers' (same origin)
// If API_BASE is 'http://localhost:3001' → 'http://localhost:3001/api/aperio/transfers'
```

---

## 2. Error message when fetch fails

**Where:** The place you show “Cannot reach the API at …” (e.g. a health-check or error boundary component).

**Logic:**
- If `API_BASE` is empty, the “server” is the same origin → say **“the app server”** or show **`window.location.origin`**.
- If `API_BASE` is set, you can show that URL (e.g. for standalone dev).

**Example:**
```js
function getApiUnreachableMessage() {
  const base = import.meta.env.VITE_APERIO_API_URL ?? '';
  if (!base) {
    return `Cannot reach the API at ${window.location.origin}. Check that the app server is running and the URL is correct.`;
  }
  return `Cannot reach the API at ${base}. Check that the Aperio server is running and the URL is correct.`;
}
```

Or shorter:
```js
const apiOrigin = (import.meta.env.VITE_APERIO_API_URL ?? '').replace(/\/$/, '') || window.location.origin;
const message = `Cannot reach the API at ${apiOrigin}. Check that the server is running and the URL is correct.`;
```

Use this message in your error UI when a health check or critical fetch fails.

---

## 3. `.env.example` in echopad-aperio frontend

**Path:** `echopad-aperio/frontend/.env.example` (or repo root if frontend is at root).

**Content (or add this block):**
```env
# API base URL for the Aperio backend.
# - When Aperio is embedded in echopad-app: leave unset so the app uses the same origin
#   (requests go to the echopad-app server; no separate Aperio server).
# - When running the Aperio frontend alone (e.g. Vite dev server): set to your
#   standalone Aperio backend, e.g.:
#   VITE_APERIO_API_URL=http://localhost:3001
# VITE_APERIO_API_URL=
```

---

## 4. Optional: align with echopad-app build env

echopad-app’s `build-aperio.js` already passes `VITE_API_BASE_URL=""` and `VITE_APERIO_API_BASE=""`. If you prefer one of those names in echopad-aperio, use it consistently:

```js
const raw = import.meta.env.VITE_APERIO_API_URL
  ?? import.meta.env.VITE_APERIO_API_BASE
  ?? import.meta.env.VITE_API_BASE_URL
  ?? '';
export const API_BASE = raw;
```

Then:
- echopad-app can keep passing `VITE_API_BASE_URL=""` / `VITE_APERIO_API_BASE=""`.
- In standalone Aperio you set `VITE_APERIO_API_URL=http://localhost:3001`.

---

## Checklist (in echopad-aperio repo)

- [ ] Default API base is `''` (only set via `VITE_APERIO_API_URL` when standalone).
- [ ] All API requests use this base (relative when empty).
- [ ] Error message when fetch fails uses “the app server” or `window.location.origin` when base is empty.
- [ ] `.env.example` documents: unset for embed, set for standalone.

After merging and publishing a new version, run `npm run build:aperio` in echopad-app and redeploy so the new behavior is used when serving Aperio at `/aperio`.
