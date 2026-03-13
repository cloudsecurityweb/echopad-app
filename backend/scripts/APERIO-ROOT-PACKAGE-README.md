# Root package.json for echopad-Aperio repo

So that `npm install github:cloudsecurityweb/echopad-Aperio` works, the **echopad-Aperio** repo must have a `package.json` at its **root**. This root file **uses the existing backend and frontend package.json** via npm **workspaces** (no duplication).

**Steps (in the echopad-Aperio repo):**

1. Copy `backend/scripts/aperio-root-package.json` from this repo (or the content below) into the **root** of the **echopad-Aperio** repo and rename it to `package.json`.

2. If the backend entry point is not `backend/src/server.js`, change the `"main"` field to match (e.g. whatever `backend/package.json` has as its main).

3. Commit and push. Then in echopad-app backend run `npm install`; the dependency `github:cloudsecurityweb/echopad-Aperio` will resolve correctly.

**How it works**

- **`workspaces`** points to `backend` and `frontend`. When someone runs `npm install` at the repo root, npm installs dependencies from both `backend/package.json` and `frontend/package.json` (those files are used as-is).
- **`scripts.build`** runs the frontend’s build script (`npm run build --workspace=frontend`), so `npm run build:aperio` in echopad-app works.

**Root package.json content** (adjust `main` if your backend entry differs):

```json
{
  "name": "echopad-aperio",
  "version": "1.0.0",
  "private": true,
  "description": "Aperio – root package; uses backend and frontend package.json via workspaces",
  "main": "backend/src/server.js",
  "files": ["backend", "frontend"],
  "workspaces": ["backend", "frontend"],
  "scripts": {
    "build": "npm run build --workspace=frontend"
  }
}
```
