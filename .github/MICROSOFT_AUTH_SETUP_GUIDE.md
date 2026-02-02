# Microsoft Authentication Setup Guide

## 📍 Where to Refer (Source of Truth)

### ✅ Use echopad-app Repository
**Repository:** `cloudsecurityweb/echopad-app`  
**NOT:** `echopad-website` (this is the old repository)

### Configuration Files Location

1. **Frontend Configuration:**
   - **File:** `frontend/src/config/authConfig.js`
   - **Path:** `echopad-app/frontend/src/config/authConfig.js`
   - **Contains:** MSAL client ID, tenant ID, authority, redirect URI

2. **Backend Configuration:**
   - **File:** `backend/src/middleware/entraAuth.js`
   - **Path:** `echopad-app/backend/src/middleware/entraAuth.js`
   - **Contains:** Tenant ID, client ID for token validation

3. **Environment Variables:**
   - **File:** `.github/DEV_SECRETS_SETUP.md` (for dev)
   - **File:** `COMPLETE_DEPLOYMENT_GUIDE.md` (for production)
   - **Contains:** All required environment variables

## 🔧 Where to Update

### 1. Azure Portal - App Registration (CRITICAL)

**Location:** Azure Portal → Azure Active Directory → App registrations

**App Registration Name:** (Check your Azure subscription)
- **Application (Client) ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
- **Directory (Tenant) ID:** `502d9d81-2020-456b-b113-b84108acf846`

#### What to Update in Azure Portal:

**A. Redirect URIs (Authentication → Platform configurations → Single-page application)**

Add these redirect URIs:
```
Production:
https://calm-smoke-0ef35d31e.4.azurestaticapps.net

Development:
https://<DEV_STATIC_WEB_APP_URL>  (Check your DEV Static Web App URL)

Local:
http://localhost:5173
```

**B. API Permissions**
- Ensure `User.Read` permission is granted
- Check that Microsoft Graph permissions are configured

**C. App Roles (if using role-based access)**
- Verify app roles are defined in App Registration
- Assign users/groups to roles if needed

**D. Optional Claims**
- Go to Token configuration
- Add `roles` claim if using app roles

### 2. GitHub Secrets (For Deployment)

**Location:** GitHub → `cloudsecurityweb/echopad-app` → Settings → Secrets and variables → Actions

#### Production Secrets (PROD_*):
```
PROD_VITE_MSAL_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
PROD_VITE_MSAL_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
PROD_AZURE_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
PROD_AZURE_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
```

#### Development Secrets (DEV_*):
```
DEV_VITE_MSAL_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
DEV_VITE_MSAL_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
DEV_AZURE_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
DEV_AZURE_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
```

### 3. Azure Static Web App Settings

**Location:** Azure Portal → Static Web Apps → Your App → Configuration → Application settings

**Add/Update:**
```
VITE_MSAL_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
VITE_MSAL_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
```

### 4. Azure App Service Settings (Backend)

**Location:** Azure Portal → App Services → Your Backend App → Configuration → Application settings

**Add/Update:**
```
AZURE_TENANT_ID=502d9d81-2020-456b-b113-b84108acf846
AZURE_CLIENT_ID=d4ea5537-8b2a-4b88-9dbd-80bf02596c1a
```

## 📋 Step-by-Step Setup Checklist

### For New Deployment:

- [ ] **1. Verify App Registration in Azure Portal**
  - [ ] Check Client ID: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
  - [ ] Check Tenant ID: `502d9d81-2020-456b-b113-b84108acf846`
  - [ ] Verify platform is "Single-page application"

- [ ] **2. Update Redirect URIs in Azure Portal**
  - [ ] Add production URL: `https://calm-smoke-0ef35d31e.4.azurestaticapps.net`
  - [ ] Add development URL (if different)
  - [ ] Add localhost: `http://localhost:5173`

- [ ] **3. Set GitHub Secrets**
  - [ ] Go to: `https://github.com/cloudsecurityweb/echopad-app/settings/secrets/actions`
  - [ ] Add/Update `PROD_VITE_MSAL_CLIENT_ID`
  - [ ] Add/Update `PROD_VITE_MSAL_TENANT_ID`
  - [ ] Add/Update `DEV_VITE_MSAL_CLIENT_ID` (if using dev environment)
  - [ ] Add/Update `DEV_VITE_MSAL_TENANT_ID` (if using dev environment)

- [ ] **4. Verify Code Configuration**
  - [ ] Check `echopad-app/frontend/src/config/authConfig.js`
  - [ ] Verify authority is `/common` (not `/organizations`)
  - [ ] Verify redirect URI uses `window.location.origin`

- [ ] **5. Deploy and Test**
  - [ ] Deploy frontend (Static Web App)
  - [ ] Deploy backend (App Service)
  - [ ] Test Microsoft login
  - [ ] Verify redirect works correctly

## 🔍 How to Find Current Configuration

### Check Current App Registration:
1. Go to Azure Portal
2. Azure Active Directory → App registrations
3. Search for Client ID: `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`
4. Check Authentication → Redirect URIs

### Check Current GitHub Secrets:
1. Go to: `https://github.com/cloudsecurityweb/echopad-app/settings/secrets/actions`
2. Look for `PROD_VITE_MSAL_CLIENT_ID` and `PROD_VITE_MSAL_TENANT_ID`

### Check Current Azure Settings:
1. Static Web App → Configuration → Application settings
2. App Service → Configuration → Application settings

## ⚠️ Common Issues

### Issue: "redirect_uri_mismatch" Error
**Solution:** Add the exact redirect URI to Azure Portal App Registration

### Issue: "Invalid client" Error
**Solution:** Verify Client ID matches in:
- Azure Portal App Registration
- GitHub Secrets
- Azure Static Web App settings
- Code (authConfig.js)

### Issue: Can't login with personal Microsoft account
**Solution:** Verify authority is `/common` (not `/organizations`) in `authConfig.js`

## 📚 Reference Files

- **Configuration:** `echopad-app/frontend/src/config/authConfig.js`
- **Backend Auth:** `echopad-app/backend/src/middleware/entraAuth.js`
- **Deployment Guide:** `echopad-app/COMPLETE_DEPLOYMENT_GUIDE.md`
- **Dev Secrets:** `echopad-app/.github/DEV_SECRETS_SETUP.md`

## 🎯 Quick Reference

**Repository to use:** `cloudsecurityweb/echopad-app`  
**Client ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`  
**Tenant ID:** `502d9d81-2020-456b-b113-b84108acf846`  
**Authority:** `https://login.microsoftonline.com/common`
