# Microsoft Authentication Configuration Reference

## ✅ Use echopad-app Repository

**For Microsoft authentication setup, refer to: `echopad-app` repository**

The `echopad-website` repository is the OLD repository and should NOT be used for new deployments.

## Microsoft Authentication Configuration

### Frontend Configuration
**File:** `frontend/src/config/authConfig.js`

**Client IDs:**
- **Frontend SPA Client ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
- **Backend API Client ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
- **Tenant ID:** `502d9d81-2020-456b-b113-b84108acf846`

**Authority:** `https://login.microsoftonline.com/common` (allows both work/school and personal Microsoft accounts)

### Environment Variables

**For Frontend (Static Web App):**
```bash
VITE_MSAL_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
VITE_MSAL_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
```

**For Backend (App Service):**
```bash
AZURE_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
AZURE_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
```

### Azure App Registration Details

**App Registration Name:** (Check Azure Portal)
- **Application (Client) ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
- **Directory (Tenant) ID:** `502d9d81-2020-456b-b113-b84108acf846`

**Redirect URIs (must be configured in Azure Portal):**
- Production: `https://calm-smoke-0ef35d31e.4.azurestaticapps.net`
- Development: (Check DEV Static Web App URL)
- Local: `http://localhost:5173`

**Platform:** Single-page application (SPA)

## Important Notes

1. **Repository:** Always use `echopad-app` for deployments
2. **Authority:** Uses `/common` to allow both work/school and personal Microsoft accounts
3. **Redirect URIs:** Must match exactly in Azure Portal App Registration
4. **Scopes:** `["User.Read", "openid", "profile", "email"]`

## Verification Checklist

- [ ] Using `echopad-app` repository (NOT `echopad-website`)
- [ ] Client ID matches: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
- [ ] Tenant ID matches: `502d9d81-2020-456b-b113-b84108acf846`
- [ ] Redirect URI configured in Azure Portal
- [ ] Authority is `/common` (not `/organizations`)
- [ ] Environment variables set correctly in deployment

## Where to Find Configuration

**echopad-app repository:**
- Frontend: `frontend/src/config/authConfig.js`
- Backend: `backend/src/middleware/entraAuth.js`

**DO NOT use echopad-website repository for new deployments!**
