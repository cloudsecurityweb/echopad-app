# 🔑 Frontend Environment Variables

Complete reference for all environment variables used by the Echopad frontend. All variables are prefixed with `VITE_` to be exposed to the browser bundle by Vite.

---

## Configuration

Create a `.env` file in the `frontend/` directory:

```bash
# Copy and fill in your values
VITE_API_BASE_URL=http://localhost:3000
VITE_MSAL_CLIENT_ID=your-msal-client-id
VITE_MSAL_TENANT_ID=your-tenant-id
```

---

## Variable Reference

### API Connection

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_BASE_URL` | ✅ | `http://localhost:3000` | Backend API base URL |

---

### Microsoft Entra ID (MSAL)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_MSAL_CLIENT_ID` | ✅ | — | Azure App Registration client ID |
| `VITE_MSAL_TENANT_ID` | ✅ | — | Azure AD tenant ID |

> **⚠️ Important:** These must match the backend's `AZURE_CLIENT_ID` and `AZURE_TENANT_ID`. Both frontend and backend must use the **same app registration**.

**Where to find:** Azure Portal → Azure AD → App registrations → Your app

---

### Google OAuth

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GOOGLE_CLIENT_ID` | ❌ | — | Google OAuth client ID |

**Where to find:** Google Cloud Console → APIs & Services → Credentials

---

### Intercom

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_INTERCOM_APP_ID` | ❌ | — | Intercom application ID for live chat |

**Where to find:** Intercom Dashboard → Settings → Installation

---

### Google Analytics

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_GA_MEASUREMENT_ID` | ❌ | — | Google Analytics 4 measurement ID |

**Where to find:** Google Analytics → Admin → Data Streams → Your stream

---

### Whisper API (Transcription)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_ENDPOINT` | ❌ | — | Whisper API endpoint URL |
| `VITE_API_ROUTE` | ❌ | — | Whisper API route path |

---

## Security Note

> **⚠️ Warning:** All `VITE_` variables are bundled into the client-side JavaScript and are **visible to end users**. Never put secrets (API keys, database credentials, etc.) in frontend env vars.

Sensitive operations should always go through the backend API.

---

## Production Values

In production (CI/CD), these are set as **GitHub Secrets** and injected during the build step:

| Secret | Maps To |
|--------|---------|
| `VITE_MSAL_CLIENT_ID` | `VITE_MSAL_CLIENT_ID` |
| `VITE_MSAL_TENANT_ID` | `VITE_MSAL_TENANT_ID` |
| `VITE_GOOGLE_CLIENT_ID` | `VITE_GOOGLE_CLIENT_ID` |
| `VITE_API_BASE_URL` | `VITE_API_BASE_URL` |

---

## Related Pages

- [Getting Started](../getting-started.md) — First-time setup
- [Authentication](./authentication.md) — How MSAL and Google are configured
- [Deployment](./deployment.md) — How env vars are set in CI/CD
