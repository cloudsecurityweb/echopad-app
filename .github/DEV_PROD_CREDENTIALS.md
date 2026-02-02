# DEV and PROD Azure Credentials

## 📋 Subscription Details

### DEV Environment (develop branch)
- **Subscription Name:** `csw-echopad-nonprod`
- **Subscription ID:** `c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2`
- **Tenant ID:** `42619268-2056-407a-9f6c-72e6741615e5`
- **Client ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`

### PROD Environment (main branch)
- **Subscription Name:** `csw-echopad-prd`
- **Subscription ID:** `c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb`
- **Tenant ID:** `42619268-2056-407a-9f6c-72e6741615e5`
- **Client ID:** `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`

## 🔐 GitHub Secrets

### DEV_AZURE_CREDS (for develop branch)

**Copy this JSON and paste into GitHub Secret `DEV_AZURE_CREDS`:**

```json
{
  "clientId": "d4ea5537-8b2a-4b88-9dbd-80bf02596c1a",
  "clientSecret": "YOUR_CLIENT_SECRET_VALUE",
  "tenantId": "42619268-2056-407a-9f6c-72e6741615e5",
  "subscriptionId": "c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"
}
```

**⚠️ DEV Secret Value:** Use the same secret value as PROD (see PROD section below)

### PROD_AZURE_CREDS (for main branch)

**Copy this JSON and paste into GitHub Secret `PROD_AZURE_CREDS`:**

```json
{
  "clientId": "d4ea5537-8b2a-4b88-9dbd-80bf02596c1a",
  "clientSecret": "YOUR_CLIENT_SECRET_VALUE",
  "tenantId": "42619268-2056-407a-9f6c-72e6741615e5",
  "subscriptionId": "c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb"
}
```

**⚠️ Note:** Use the same client secret value for both DEV and PROD (app registration limit: max 2 passwords). Get the secret value by running: `az ad app credential list --id d4ea5537-8b2a-4b88-9dbd-80bf02596c1a`

## 📝 Steps to Update GitHub Secrets

1. **Go to GitHub Repository:**
   - Navigate to: https://github.com/cloudsecurityweb/echopad-app
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Update DEV_AZURE_CREDS:**
   - Find `DEV_AZURE_CREDS` secret (create if doesn't exist)
   - Click **Update** (or **New repository secret**)
   - Paste the DEV JSON above with the actual secret value (same as PROD - see PROD section)
   - Click **Update secret**

3. **Update PROD_AZURE_CREDS:**
   - Find `PROD_AZURE_CREDS` secret (create if doesn't exist)
   - Click **Update** (or **New repository secret**)
   - Paste the PROD JSON above with PROD secret value
   - Click **Update secret**

## 🔄 How Workflow Uses These

The workflow automatically selects the correct credentials based on branch:

- **develop branch** → Uses `DEV_AZURE_CREDS` → Deploys to DEV subscription
- **main branch** → Uses `PROD_AZURE_CREDS` → Deploys to PROD subscription

## 🔒 Security Notes

- ⚠️ **Never commit secrets to git**
- ⚠️ **DEV and PROD use separate secrets**
- ⚠️ **Rotate secrets regularly**
- ⚠️ **Secrets expire in 24 months (default)**

## 📝 Secret Expiration

- **DEV Secret:** Created 2026-02-02, expires ~2028-02-02
- **PROD Secret:** (Check creation date)

## 🔄 To Create New Secrets

If secrets expire, create new ones:

```bash
# For DEV
az account set --subscription "c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"
az ad app credential reset --id d4ea5537-8b2a-4b88-9dbd-80bf02596c1a --append --display-name "GitHub-Actions-DEV-$(date +%Y%m%d)"

# For PROD
az account set --subscription "c9ca9a88-e079-4b0d-a4ad-ed340a5d30fb"
az ad app credential reset --id d4ea5537-8b2a-4b88-9dbd-80bf02596c1a --append --display-name "GitHub-Actions-PROD-$(date +%Y%m%d)"
```
