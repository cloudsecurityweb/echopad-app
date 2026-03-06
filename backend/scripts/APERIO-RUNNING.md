# Running echopad-aperio (single App Service in production)

To save cost, **Aperio runs inside the same process** as the echopad-app backend. No separate Azure App Service for Aperio.

## Where things run

| Part | Development | Production |
|------|-------------|------------|
| **Aperio frontend** | Option A: Vite dev server on **5174** (`npm run dev:aperio`). Option B: Built and served by main backend at **/aperio**. | Served by **echopad-app backend** at **/aperio** (same App Service). |
| **Aperio backend (API)** | Option A: Standalone on **3001** (`npm run dev:aperio:backend`) if you want to run it separately. Option B: **In-process** – main backend loads `echopad-aperio` via dynamic `import()` and mounts it at **/aperio** (API + static from package). | **In-process.** Same App Service as echopad-app backend. Backend loads the echopad-aperio package and mounts its router at **/aperio**, so `/aperio/health`, `/aperio/api/aperio/*`, and the Aperio SPA are all served by the one server. |

## How it works (production)

1. **Deploy** the echopad-app backend to one Azure App Service as usual.
2. In the **build step**, run `npm install` and `npm run build:aperio`. That installs the echopad-aperio dependency and builds its frontend into `node_modules/echopad-aperio/frontend/dist`.
3. **Start** the backend (`node src/server.js`). On startup, the server:
   - Tries to `import('echopad-aperio')` (ESM).
   - If it succeeds, it mounts the Aperio router at **/aperio**. That router serves the Aperio API and the Aperio frontend from the package’s `frontend/dist`.
   - If it fails (e.g. package not installed), it falls back to serving the static build from `public/aperio` and a stub that returns 503 for API requests.
4. **One App Service** serves both the main Echopad API and Aperio at `/aperio` (API + SPA). No second host or extra cost for Aperio.

## Development

- **In-process (recommended):** Just start the main backend (`npm run dev`). After `npm run build:aperio`, it will load the echopad-aperio package and mount it at /aperio. Hit `http://localhost:3000/aperio` for the Aperio app and API.
- **Separate Aperio frontend (optional):** Run `npm run dev:aperio` for the Aperio Vite app on 5174 (it is started with `VITE_APERIO_API_URL=http://localhost:3000` so it uses the echopad-app backend). Set `VITE_APERIO_URL=http://localhost:5174` in the main app’s frontend `.env` so “Start using Aperio” opens the dev server.
- **Separate Aperio backend (optional):** Run `npm run dev:aperio:backend` for the Aperio API on 3001 if you want to run it as a separate process (e.g. to debug Aperio in isolation). The in-process mount still works without this. **Set `JWT_SECRET` in `backend/.env`** (same value as `EMAIL_PASSWORD_JWT_SECRET` so auth works); otherwise you’ll see “JWT_SECRET not set. Email/Password Auth will fail.”

## Env / config

- The **echopad-aperio** backend (when loaded in-process) reads its own config from the package (e.g. Cosmos, Blob). Use the same env vars you would use for a standalone Aperio backend (e.g. on the same App Service as echopad-app, so they share the same environment).
- **Standalone Aperio backend (3001):** It loads `backend/.env` via dotenv. Set **`JWT_SECRET`** (use the same value as `EMAIL_PASSWORD_JWT_SECRET` so tokens issued by the main app are valid). Without it you get “JWT_SECRET not set. Email/Password Auth will fail.”
- **Aperio at 5174:** Start it with `npm run dev:aperio` from the **backend** directory so it uses the code that reads the sign-in token from the URL hash (`#access_token=...`). The app at 5174 does **not** read `echopad-app/frontend/.env`; it reads `.env` from `backend/node_modules/echopad-aperio/frontend/` (or uses the token from the URL when you open it via "Start using Aperio"). See [APERIO-TOKEN-IN-HASH.md](APERIO-TOKEN-IN-HASH.md) and [APERIO-APERIOAPI-SNIPPET.md](APERIO-APERIOAPI-SNIPPET.md) for making the token-from-hash fix permanent in the echopad-aperio repo.

## Summary

- **No separate Azure App Service for Aperio.** One backend process serves both Echopad and Aperio at `/aperio`.
- **GitHub dependency** (`echopad-aperio`) is installed and built in the deploy pipeline; the server loads it with dynamic `import()` and mounts it at `/aperio`.
