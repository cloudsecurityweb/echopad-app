# 🚀 Frontend Deployment

This page covers deploying the Echopad frontend to **Azure Static Web Apps** and the CI/CD pipeline.

---

## Deployment Architecture

```
GitHub (main branch)
    │
    ▼  push triggers
GitHub Actions (deploy.yml)
    │
    ├─ npm install
    ├─ Inject VITE_* env vars from secrets
    ├─ npm run build → dist/
    └─ Deploy dist/ to Azure Static Web Apps
          │
          ▼
Azure Static Web Apps (CDN)
    │
    ├─ Serves static files globally
    ├─ SPA fallback routing (index.html)
    └─ nginx.conf for cache control
```

---

## Build Process

The frontend builds to a static `dist/` folder:

```bash
cd frontend
npm install
npm run build     # → frontend/dist/
```

The output is a set of static HTML, CSS, and JavaScript files that can be served from any static hosting. No server-side rendering is involved.

---

## Azure Static Web Apps

### Configuration

The app uses `staticwebapp.config.json` (or similar) for:

- **SPA routing** — All routes fall back to `index.html`
- **Cache headers** — Asset caching for performance

### Nginx Config

**File:** `frontend/nginx.conf`

This config is used for custom hosting scenarios:

```nginx
# SPA fallback
location / {
    try_files $uri $uri/ /index.html;
}

# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## CI/CD Pipeline

### Workflow File

`.github/workflows/deploy.yml` handles frontend deployment as part of the full-stack pipeline.

### Build Environment Variables

During CI/CD, `VITE_*` variables are set from GitHub Secrets before the build step:

```yaml
env:
  VITE_MSAL_CLIENT_ID: ${{ secrets.VITE_MSAL_CLIENT_ID }}
  VITE_MSAL_TENANT_ID: ${{ secrets.VITE_MSAL_TENANT_ID }}
  VITE_GOOGLE_CLIENT_ID: ${{ secrets.VITE_GOOGLE_CLIENT_ID }}
  VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
```

> **💡 Tip:** Vite injects `VITE_*` variables **at build time**, not at runtime. Changing env vars requires a rebuild.

---

## Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `AZURE_STATIC_WEB_APP_NAME` | Static Web App resource name |
| `AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN` | Deployment token from Azure |
| `VITE_MSAL_CLIENT_ID` | MSAL client ID |
| `VITE_MSAL_TENANT_ID` | Azure AD tenant ID |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_API_ENDPOINT` | Whisper API endpoint (optional) |
| `VITE_API_ROUTE` | Whisper API route (optional) |

---

## Verifying Deployment

### 1. Check Deployment Status

GitHub → Actions → Latest workflow run → Check "Deploy Frontend" step

### 2. Visit the App

Open the Static Web App URL (e.g., `https://your-app.azurestaticapps.net`)

### 3. Verify Routing

Navigate to a dashboard route (e.g., `/dashboard`) and refresh — it should not show 404 (SPA fallback working).

### 4. Check API Connectivity

Open browser DevTools → Network tab → Verify API calls go to the correct backend URL.

---

## Troubleshooting

### White screen / app won't load

- Check browser console for errors
- Verify `VITE_MSAL_CLIENT_ID` and `VITE_MSAL_TENANT_ID` are set correctly
- Ensure the build was clean (`npm run build` with no errors)

### 404 on refresh

- SPA fallback routing is not configured correctly
- Ensure `staticwebapp.config.json` has navigation fallback to `index.html`

### API calls failing in production

- Verify `VITE_API_BASE_URL` points to the production backend
- Check CORS: the backend must allow the frontend's production URL

### Env vars not taking effect

- `VITE_*` variables are injected at **build time**, not runtime
- After changing secrets, trigger a new build/deployment

---

## Related Pages

- [Architecture](./architecture.md) — Build and bundle overview
- [Environment Variables](./environment-variables.md) — All `VITE_*` vars
- [Backend Deployment](../backend/deployment.md) — Backend deploy guide
