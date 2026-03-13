# Using @echopad/aperio from Azure Artifacts (instead of GitHub)

This guide covers using the **Azure Artifacts** npm feed for the **@echopad/aperio** package, on both the **echopad-aperio** (publisher) and **echopad-app** (consumer) sides. echopad-app consumes the **scoped** package `@echopad/aperio`; the previous GitHub dependency (`github:cloudsecurityweb/echopad-Aperio#dev-vk`) has been removed.

---

## Your feed (cloudsecurityweb / echopad / echopad_aperio)

| Item        | Value            |
|------------|------------------|
| Organization | `cloudsecurityweb` |
| Project    | `echopad`        |
| Feed       | `echopad_aperio` |

**Registry URL for scoped package (use in echopad-app `backend/.npmrc`):**
```ini
@echopad:registry=https://pkgs.dev.azure.com/cloudsecurityweb/echopad/_packaging/echopad_aperio/npm/registry/
```

**Registry URL for publishing (use in echopad-aperio root `.npmrc`):**
```ini
registry=https://pkgs.dev.azure.com/cloudsecurityweb/echopad/_packaging/echopad_aperio/npm/registry/
```

Next step in the Azure DevOps UI: click **Connect to Feed** → choose **npm** → copy the snippet if it differs (e.g. project-level vs org-level); the line above is the standard project feed URL.

---

## Prerequisites (both sides)

- Azure DevOps organization and project
- An **Azure Artifacts feed** (e.g. `echopad-packages` or similar)
- Node.js and npm installed
- **vsts-npm-auth** (for local auth):
  ```bash
  npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
  ```

---

# Part 1: echopad-aperio (publish to Azure Artifacts)

## 1.1 Create the feed (one-time, in Azure DevOps)

You already have the feed **echopad_aperio** in project **echopad** (org **cloudsecurityweb**). No need to create another—use it for both publishing echopad-aperio and consuming from echopad-app.

If you ever need a new feed: Artifacts → **+ Create Feed** → name it and create.

## 1.2 Make the repo an npm package

In the **echopad-aperio** repo:

1. **Root `package.json`**  
   Ensure it has:
   - `"name": "@echopad/aperio"` (scoped; echopad-app consumes this).
   - `"version": "x.y.z"` (semver; you’ll bump this for each publish).
   - `"main"` or `"exports"` pointing to the entry file the backend will `import()` (e.g. backend router).
   - A **`build`** script that builds the frontend (so echopad-app’s `build-aperio.js` can run `npm run build` inside the package).

   Example (adjust paths to match your layout):

   ```json
   {
     "name": "@echopad/aperio",
     "version": "1.0.0",
     "main": "backend/src/router.js",
     "scripts": {
       "build": "npm run build --prefix frontend"
     }
   }
   ```

2. **`.npmignore`** (optional but recommended)  
   Exclude dev-only and heavy folders so the published tarball stays small, e.g.:

   ```
   .git
   node_modules
   frontend/node_modules
   *.log
   .env*
   ```

   Don’t ignore `frontend/` if echopad-app builds the frontend from the package; only ignore what isn’t needed at install/build time.

## 1.3 Configure auth and registry (echopad-aperio repo)

1. In Azure DevOps: **Artifacts** → feed **echopad_aperio** → **Connect to Feed** → **npm**.
2. Copy the **Project** `.npmrc` snippet, or use this (same as the table above):
   ```ini
   registry=https://pkgs.dev.azure.com/cloudsecurityweb/echopad/_packaging/echopad_aperio/npm/registry/
   ```
3. In **echopad-aperio** root (same directory as `package.json`), create **`.npmrc`** with that line.
4. Run (from echopad-aperio root):
   ```bash
   vsts-npm-auth -config .npmrc
   ```
   This writes credentials to your user-level `.npmrc`; you don’t need to commit those.

## 1.4 Publish

From **echopad-aperio** root:

```bash
npm version patch   # or minor/major, or set version manually in package.json
npm publish --access restricted
```

- Scoped packages require `--access restricted` (or `public` if the feed allows it).
- If you get **403**, the version likely already exists (Azure Artifacts versions are immutable). Bump version and run `npm publish` again.

## 1.5 Optional: Publish from Azure Pipelines

- Add a pipeline in the **echopad-aperio** repo that:
  1. Restores dependencies and runs the frontend build if needed.
  2. Uses the **npmAuthenticate** task for the feed.
  3. Runs `npm publish` (or `npm publish --access restricted` for scoped packages).

You can use the “Connect to Feed” → **Pipeline** instructions in Azure Artifacts to get the exact YAML.

---

# Part 2: echopad-app (consume from Azure Artifacts)

## 2.1 Dependency and registry (current setup)

echopad-app uses the **scoped** package **@echopad/aperio**:

1. **backend/.npmrc** contains:
   ```ini
   @echopad:registry=https://pkgs.dev.azure.com/cloudsecurityweb/echopad/_packaging/echopad_aperio/npm/registry/
   ```

2. **backend/package.json** has:
   ```json
   "@echopad/aperio": "1.0.0"
   ```
   Use `"^1.0.0"` if you want to allow patch/minor updates.

3. The backend imports the package as `import('@echopad/aperio')` and all scripts reference `node_modules/@echopad/aperio`.

## 2.2 Updating Aperio

To pull the latest allowed version and rebuild the Aperio frontend, from **backend** directory:

```bash
npm run update:aperio
```

This runs `npm update @echopad/aperio` then `npm run build:aperio`. No GitHub-specific steps (no removing the package dir or installing deps inside the package).

## 2.3 Authenticate on the machine / in CI

**Local (developer machine)**  
From **echopad-app/backend** (where the `.npmrc` is):

```bash
vsts-npm-auth -config .npmrc
```

Then:

```bash
npm install
npm run build:aperio
```

**CI (e.g. Azure Pipelines)**  
- Use the **npmAuthenticate** task for the same feed and run `npm ci` / `npm install` and `npm run build:aperio` in the backend.
- If the pipeline runs from the repo root, either:
  - Run `npm install` and `npm run build:aperio` from the `backend` directory and keep `.npmrc` in `backend`, or
  - Put a root-level `.npmrc` that points the `@echopad` scope to the feed and run install from root if that’s your pattern.

## 2.4 Package location

The scoped package installs to **`node_modules/@echopad/aperio`**. All backend scripts (`build-aperio.js`, `update-aperio.js`, `run-aperio-dev.js`, `run-aperio-backend.js`) and **server.js** use this path and the import `@echopad/aperio`.

## 2.5 Aperio auth (echopad-app token verification)

When users sign in to echopad-app (email/password, Microsoft, Google, or magic link) and open Aperio, the same access token is sent to Aperio (via URL hash or postMessage). The backend must have the following environment variables set so that **both** echopad-app and the mounted Aperio router can verify these tokens:

| Variable | Purpose |
|----------|---------|
| `EMAIL_PASSWORD_JWT_SECRET` | Used for email/password JWTs. server.js copies this to `JWT_SECRET` for Aperio when `JWT_SECRET` is not set. |
| `MAGIC_LINK_JWT_SECRET` | Required if Aperio verifies magic-link tokens (same as main app auth). |
| `AZURE_TENANT_ID` | Required for Microsoft Entra ID token verification (JWKS). |
| `AZURE_CLIENT_ID` | Required for Microsoft Entra ID token verification (audience). |
| Google OAuth client ID | As used by the main app for Google token verification (e.g. in auth config). |

Ensure these are set in your deployment environment (e.g. Azure App Service application settings) so that Aperio API calls with `Authorization: Bearer <token>` succeed for all sign-in methods.

**Frontend (echopad-app):** Set `VITE_API_BASE_URL` to your backend base URL. For local dev, optional `VITE_APERIO_URL` and `VITE_APERIO_TOKEN` in `frontend/.env` are used by `run-aperio-dev.js` when running the Aperio frontend on a separate port.

---

# Quick reference

| Side                | Action |
|---------------------|--------|
| **echopad-aperio**  | 1) Root `package.json` with `"name": "@echopad/aperio"`, version, main, build script. 2) Add `.npmrc` with feed registry. 3) Run `vsts-npm-auth -config .npmrc`. 4) `npm version patch && npm publish --access restricted`. |
| **echopad-app**     | 1) `backend/.npmrc` with `@echopad:registry=...`. 2) `backend/package.json` has `"@echopad/aperio": "1.0.0"` (or exact version). 3) Run `vsts-npm-auth -config .npmrc` in backend. 4) `npm install` and `npm run build:aperio`. To get the **newest** version: `npm run update:aperio` (installs `@echopad/aperio@latest` from the feed and runs `build:aperio`). Optionally enable the **Update @echopad/aperio to latest** GitHub Action (`.github/workflows/update-aperio.yml`) to open a PR when a new version is published. |

---

# Troubleshooting

- **401 Unauthorized** when installing in echopad-app: run `vsts-npm-auth -config .npmrc -F` in the backend directory (or re-run with `-config` pointing at the same `.npmrc`).
- **403 on publish** (echopad-aperio): version already exists; bump version in `package.json` and publish again.
- **404 / package not found** in echopad-app: confirm feed name and org/project in `.npmrc`, that the scope is `@echopad`, and that you’ve published `@echopad/aperio` at that version from echopad-aperio.

### Windows: EPERM or "npm is not recognized" during install

Two issues can occur on Windows when installing **@echopad/aperio**: (1) **EPERM** on paths like `framer-motion\dist\es`—something is locking files under `node_modules\@echopad\aperio`. (2) **'npm' is not recognized**—the package postinstall runs `npm install --prefix frontend` in a subprocess where `npm` is not in PATH.

**Workaround:** Close terminals/IDEs using the backend folder, then delete `backend\node_modules`. Run `npm install --ignore-scripts`, then `npm run install:aperio-deps` (this runs the frontend install using the same Node/npm as your shell). Then `npm run build:aperio` and `npm run dev`. If EPERM persists when deleting `node_modules`, run PowerShell as Administrator or find the process locking the folder.

---

# Smoke tests (Aperio auth)

After implementing token integration, verify that each sign-in method works with Aperio:

1. **Email/password**
   - Sign in to echopad-app with email and password.
   - From the dashboard, open the Aperio product and click **Start using Aperio**.
   - Confirm the Aperio tab opens and does **not** show "API not configured".
   - In the browser Network tab, confirm requests to `/api/aperio/*` include `Authorization: Bearer ...` and return 2xx (not 401).

2. **Microsoft**
   - Sign in to echopad-app with Microsoft.
   - Open Aperio via **Start using Aperio**.
   - Same checks: no "API not configured", and `/api/aperio/*` requests have Bearer token and succeed.

3. **Google**
   - Sign in to echopad-app with Google.
   - Open Aperio via **Start using Aperio**.
   - Same checks as above.

**Optional:** Call `GET /api/aperio/health-auth` with `Authorization: Bearer <your-token>` (e.g. from the browser or Postman after copying the token from the app). The response should be `{ success: true, userId, email, provider }` for a valid token from any provider. Backend logs will show `hasAuth=true` for requests that include the header.
