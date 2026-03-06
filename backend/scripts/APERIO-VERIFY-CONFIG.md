# echopad-aperio config verification checklist

Use this when you have the **echopad-aperio** repo open to confirm the implementation.

---

## 1. `frontend/src/config.js`

**Must use `import.meta.env`** (Vite injects these at build time):

```js
const raw =
  import.meta.env.VITE_APERIO_API_URL ??
  import.meta.env.VITE_APERIO_API_BASE ??
  import.meta.env.VITE_API_BASE_URL ??
  '';

export const API_BASE = raw;

/**
 * For error messages: show the configured API origin or the app server (same origin) when base is unset.
 */
export function getApiOriginForError() {
  const base = (API_BASE || '').toString().replace(/\/$/, '');
  return base || (typeof window !== 'undefined' ? window.location.origin : 'the app server');
}
```

- [ ] Uses `import.meta.env.VITE_*`, not bare `VITE_*`
- [ ] Default is `''` (empty string)
- [ ] `getApiOriginForError()` returns `window.location.origin` when base is empty (and `window` exists)

---

## 2. `frontend/src/api/aperioApi.js` (or wherever `doFetch` lives)

**Building request URL:**

```js
import { API_BASE, getApiOriginForError } from '../config';

const base = (API_BASE || '').toString().replace(/\/$/, '');
const url = `${base}/api/aperio/...`;  // or your actual path
// When API_BASE is '' → url is '/api/aperio/...' (relative, same origin)
```

**In `doFetch` (or equivalent) when handling errors:**

```js
// When fetch fails or response not ok, use getApiOriginForError() in the message, e.g.:
const origin = getApiOriginForError();
throw new Error(`Cannot reach the API at ${origin}. Check that the server is running and the URL is correct.`);
```

- [ ] All API URLs use `API_BASE` (or `base` derived from it) with trailing-slash trimmed
- [ ] Error message uses `getApiOriginForError()` so it shows app server when base is empty

---

## 3. `frontend/.env.example`

- [ ] Says to **leave unset** when embedded in echopad-app (same origin)
- [ ] Says to set `VITE_APERIO_API_URL=http://localhost:3001` when running Aperio frontend alone
- [ ] No typo in variable name (`VITE_APERIO_API_URL`)

---

## 4. Quick test in echopad-aperio (standalone)

1. In echopad-aperio frontend, create or set in `.env`:
   ```env
   VITE_APERIO_API_URL=http://localhost:3001
   ```
2. Run Vite and the Aperio backend on 3001. Confirm API calls go to `http://localhost:3001/...`.
3. Remove or comment out `VITE_APERIO_API_URL`, rebuild. Confirm API calls are relative (e.g. `/api/aperio/...`).

---

## 5. After publishing / linking

In **echopad-app**:

```bash
cd backend
npm install   # or npm link / install from local path
npm run build:aperio
npm run dev   # or start server
```

Open `http://localhost:3000/aperio` and check Network tab: requests should be to same origin (no `localhost:3001`).
