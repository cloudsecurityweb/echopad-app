# App-Side Auto-Update in Electron (EchoPad)

This guide documents the **application-side** auto-update implementation for the EchoPad Electron app: approach, configuration, update flow, platform notes, and hosting.

---

## 1. Recommended approach

### Use **electron-updater** with **electron-builder**

- **electron-updater** (from the same author as electron-builder) is the standard choice for production. It supports:
  - Generic HTTP/HTTPS update servers
  - GitHub Releases
  - S3, DigitalOcean Spaces, and other providers via generic URLs
  - Code-signed installers and delta updates (where supported)
- Electron's **built-in** `autoUpdater` (Squirrel) is macOS-focused and less flexible for cross-platform and custom backends.

**Recommendation:** Keep using **electron-updater** with **electron-builder** for production.

---

## 2. Required configuration

### 2.1 `package.json`

- **Version** is the single source of truth for "current" version. Bump it for every release (e.g. `1.0.0` → `1.0.2`).
- **electron-updater** must be a **dependency** (not devDependency) so it's available in the packaged app.

```json
{
  "name": "echopad-desktop",
  "version": "1.0.2",
  "dependencies": {
    "electron-updater": "^6.3.9"
  }
}
```

### 2.2 electron-builder `build.publish`

The `publish` section tells electron-updater where to look for update metadata and installers when not using the App Services backend.

**Option A – Backend (EchoPad default)**  
Updates are driven by `WEB_BASE_API_URL` (or `UPDATE_FEED_BASE_URL`). The app uses:

- Version API: `{WEB_BASE_API_URL}/api/download/ai-scribe/version`
- Update feed (platform-specific); electron-updater appends the filename to the feed base URL:
  - **Windows:** Feed base `{WEB_BASE_API_URL}/api/download/ai-scribe/update-feed/desktop/` → requests `.../update-feed/desktop/latest.yml`
  - **macOS:** Feed base `{WEB_BASE_API_URL}/api/download/ai-scribe/update-feed/mac/` → requests `.../update-feed/mac/latest-mac.yml`

No need to change `publish` for this; the update service overrides the feed URL from the backend.

**Option B – Generic URL (e.g. GitHub Releases, S3, custom server)**  
Set `publish` to your update base URL (no trailing slash):

```json
{
  "build": {
    "publish": [
      {
        "provider": "generic",
        "url": "https://your-update-server.com/releases"
      }
    ]
  }
}
```

Replace `https://your-update-server.com/releases` with:

- **GitHub Releases:**  
  `https://github.com/OWNER/REPO/releases/download/`  
  (you must upload `latest.yml` / `latest-mac.yml` and the installer files per release)
- **S3 / custom:**  
  Base URL where `latest.yml` (Windows) and `latest-mac.yml` (macOS) and installers are served.

### 2.3 Version comparison

The app compares versions with a **semver-like** comparison (e.g. `1.0.2` > `1.0.0`). The backend uses the same logic. Ensure your backend or feed exposes versions in the same format (e.g. `1.0.2`).

---

## 3. Update flow implementation

### 3.1 Main process

- **Entry points:** Check for updates (on startup and manually), download when user confirms, then quit and install.
- **Events to renderer:** `update-available`, `update-not-available`, `update-downloaded`, `update-error`, and optionally progress.

**Flow summary:**

1. **Check:** Backend (if `WEB_BASE_API_URL` / `UPDATE_FEED_BASE_URL` set) requests the platform-specific yml URL; else generic feed from `publish`.
2. **If update available:** Use electron-updater to download (or `downloadAndInstallFromBackend(version)` if using backend auth for installer).
3. **Install:** `quitAndInstall()` or run the downloaded installer and quit.

### 3.2 Triggering a manual check from the renderer

From any renderer (e.g. Settings), call the exposed check API and listen for events such as `update-available`, `update-not-available`, `update-downloaded`, `update-error`.

### 3.3 Background check on startup

A single background check runs shortly after app ready. It does not block startup. If an update is available, the UI can show a toast or badge.

---

## 4. Platform considerations

### Windows (NSIS)

- **Installer:** `.exe` (NSIS) produced by electron-builder.
- **Update:** electron-updater downloads the new `.exe` and runs it with `quitAndInstall(false, true)`.
- **Code signing:** For production, sign the installer so Windows SmartScreen doesn't block it. Enable `verifyUpdateCodeSignature` when you have a signing certificate.

### macOS (DMG)

- **Installer:** `.dmg` (and optionally `.zip` for auto-updater).
- **Notarization:** Required for macOS 10.15+. Configure `afterSign` in electron-builder to run notarization so the app is notarized before you upload the update.
- **Feed:** electron-updater expects `latest-mac.yml`. The backend serves it at `.../update-feed/mac/latest-mac.yml`.

### Code signing for updates

- **Windows:** Sign the NSIS installer so the updated app is trusted.
- **macOS:** Sign and notarize the app (and installers). electron-updater will replace the app bundle; the new bundle must be signed and notarized.

---

## 5. Hosting requirements

### Option A – App Services backend (EchoPad default)

- **Version API:** `GET {WEB_BASE_API_URL}/api/download/ai-scribe/version`  
  Returns JSON with per-platform version and metadata, e.g.:

  ```json
  {
    "desktop": { "version": "1.0.2", "filename": "Echopad-Setup-1.0.2.exe", "downloadPath": "..." },
    "mac":     { "version": "1.0.2", "filename": "Echopad-1.0.2.dmg", "downloadPath": "..." }
  }
  ```

- **Update feed (no auth):** The app requests the yml for the current platform. The backend **must not** use the old path `/api/download/ai-scribe/updates/`. The correct routes are:
  - **Windows:** `GET /api/download/ai-scribe/update-feed/desktop/latest.yml`
  - **macOS:** `GET /api/download/ai-scribe/update-feed/mac/latest-mac.yml`

  Each response must be YAML with:
  - **`version`** – e.g. `1.0.2`
  - **`path`** – full URL to the installer (e.g. `{base}/api/download/ai-scribe/desktop?version=1.0.2` for Windows, `{base}/api/download/ai-scribe/mac?version=1.0.2` for macOS)
  - **`releaseDate`** (optional) – ISO date string
  - **`Content-Type`:** `application/x-yaml`

  Set **`DOWNLOAD_BASE_URL`** (or **`PUBLIC_APP_URL`**) on the backend so the YAML `path` uses the correct public base (e.g. when behind a reverse proxy). Otherwise the updater may receive a wrong or empty installer URL.

- **Authenticated download (optional):**  
  If installers are protected, the app can use the backend download API with `Authorization: Bearer <token>`:
  - `GET {WEB_BASE_API_URL}/api/download/ai-scribe/desktop?version=x` (Windows)
  - `GET {WEB_BASE_API_URL}/api/download/ai-scribe/mac?version=x` (macOS)

No website changes are required when releasing a new version; the version API and update feed read from Azure Artifacts. For in-app download via electron-updater, the backend must serve the yml files at the **update-feed** paths above (and the installer URLs in the yml can point to the same backend’s download endpoints).

### Option B – GitHub Releases

- **publish:**  
  `"url": "https://github.com/OWNER/REPO/releases/download/"`

- **Per release:** Upload the installer(s) and the yml file(s) that electron-builder produces:
  - Windows: `Echopad-Setup-1.0.2.exe`, `latest.yml`
  - macOS: `Echopad-1.0.2.dmg` (or `.zip`), `latest-mac.yml`

- **Version:** Use the same version string in `package.json` and in the release tag (e.g. `v1.0.2`).

### Option C – Custom server / S3

- **publish:**  
  `"provider": "generic", "url": "https://your-domain.com/path/to/releases"`  
  (no trailing slash).

- **Required files:**  
  `latest.yml` (Windows), `latest-mac.yml` (macOS), and the installer files. The yml files point to the installer URLs (relative or absolute).

- **CORS / auth:** Configure CORS and, for backend, use the auth token getter so electron-updater or `downloadAndInstallFromBackend` can send the token if required.

---

## 6. Best practices

1. **Bump version** in `package.json` for every release and keep it in sync with your backend or release tag.
2. **Test updates** on a staging feed or with `TEST_UPDATES=1` in dev.
3. **One update check at a time** – avoid overlapping check calls; disable the button while checking.
4. **User choice:** Consider `autoDownload: false` so the user explicitly chooses to download; after download, prompt to "Restart and install".
5. **Errors:** Surface update and network errors in the UI.
6. **Backend auth:** When using the backend path with protected download URLs, set the auth token getter after auth is ready so the updater or download API can send the token.

---

## 7. Common mistakes to avoid

1. **Placeholder publish URL:** If you use a generic server, replace the placeholder in `publish` with your real URL.
2. **Wrong feed path:** Do **not** use `/api/download/ai-scribe/updates/`. The backend must serve platform-specific feeds:
   - **Windows:** `.../update-feed/desktop/latest.yml` (e.g. `GET /api/download/ai-scribe/update-feed/desktop/latest.yml`)
   - **macOS:** `.../update-feed/mac/latest-mac.yml` (e.g. `GET /api/download/ai-scribe/update-feed/mac/latest-mac.yml`)
   The feed base URL passed to electron-updater should be the **directory** so the app requests the correct yml file (e.g. `.../update-feed/desktop/` or `.../update-feed/mac/`).
3. **Version format:** Use consistent semver-like versions (e.g. `1.0.2`).
4. **macOS notarization:** Ship only notarized builds to avoid Gatekeeper blocks after an update.
5. **Running in dev:** Updates are typically disabled in development unless `TEST_UPDATES=1` is set.

---

## 8. File reference

| File | Role |
|------|------|
| `src/main/main.js` (app) | IPC handlers for update-*; `setAuthTokenGetter`; background check; sets feed URL from backend |
| `src/main/backendVersionService.js` (app) | Backend version API and platform-specific update-feed URL (`.../update-feed/desktop/` or `.../update-feed/mac/`) |
| `src/main/updateService.js` (app) | Check, download, install; events to renderer |
| `backend/src/routes/download.routes.js` | Version API (`/version`), installer streams (`/desktop`, `/mac`), update-feed routes (`/update-feed/desktop/latest.yml`, `/update-feed/mac/latest-mac.yml`), CORS OPTIONS for these paths |

**Single source of truth:** The app derives the update-feed base URL from `WEB_BASE_API_URL` (or `UPDATE_FEED_BASE_URL`). The backend must set **`DOWNLOAD_BASE_URL`** or **`PUBLIC_APP_URL`** so the YAML `path` field is the correct public installer URL.

For a **minimal** production setup with the existing backend:

1. Set `WEB_BASE_API_URL` or `UPDATE_FEED_BASE_URL` in the packaged app (e.g. to `https://your-app.azurewebsites.net/api/download/ai-scribe`).
2. Backend implements `GET /api/download/ai-scribe/version` returning `{ desktop: { version, filename }, mac: { version, filename } }`.
3. Backend implements the **update-feed** endpoints (do **not** use `.../updates/`):
   - `GET /api/download/ai-scribe/update-feed/desktop/latest.yml`
   - `GET /api/download/ai-scribe/update-feed/mac/latest-mac.yml`  
   Response: YAML with `version`, `path` (full installer URL), and optionally `releaseDate`. Set **`DOWNLOAD_BASE_URL`** (or **`PUBLIC_APP_URL`**) on the backend so `path` is correct. Then in-app download via electron-updater works.
4. Otherwise users can use "Open download page" and install manually.
