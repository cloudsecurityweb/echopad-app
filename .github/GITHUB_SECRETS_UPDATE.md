# GitHub Secrets Update Guide

## ✅ PROD_AZURE_CREDS Secret

**Copy this entire JSON block and paste it into GitHub Secret `PROD_AZURE_CREDS`:**

```json
{
  "clientId": "d4ea5537-8b2a-4b88-9dbd-80bf02596c1a",
  "clientSecret": "YOUR_CLIENT_SECRET_VALUE_HERE",
  "tenantId": "42619268-2056-407a-9f6c-72e6741615e5",
  "subscriptionId": "c31376b6-ec72-4a1a-9fb6-ec8c53edf6d2"
}
```

**⚠️ IMPORTANT:** Replace `YOUR_CLIENT_SECRET_VALUE_HERE` with the actual secret value. 
   
   **To get the secret value:**
   1. Run: `az ad app credential reset --id d4ea5537-8b2a-4b88-9dbd-80bf02596c1a --append`
   2. Copy the `password` value from the output (you'll only see it once!)
   3. Or check the `.github/SECRET_VALUE.txt` file (local only, not committed)

## 📋 Steps to Update GitHub Secret

1. **Go to GitHub Repository:**
   - Navigate to: https://github.com/cloudsecurityweb/echopad-app
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Update PROD_AZURE_CREDS:**
   - Find `PROD_AZURE_CREDS` secret
   - Click **Update**
   - Paste the JSON above (as a single line or multi-line - both work)
   - Click **Update secret**

3. **Verify:**
   - The secret should show as updated
   - Trigger a workflow to test

## 🔐 All Required GitHub Secrets

### Production Secrets (PROD_*)

| Secret Name | Value | Notes |
|------------|------|-------|
| `PROD_AZURE_CREDS` | JSON above | Service principal credentials |
| `PROD_AZURE_WEBAPP_NAME` | `echopad-app-service` | Backend App Service name |
| `PROD_AZURE_STATIC_WEB_APP_NAME` | `echopad-frontend` | Frontend Static Web App name |
| `PROD_AZURE_RESOURCE_GROUP` | `cosmosdb-serverless-nonprod` | Resource group name |
| `PROD_FRONTEND_URL` | `https://icy-mushroom-045ce1b0f.4.azurestaticapps.net` | Frontend URL |
| `PROD_VITE_MSAL_CLIENT_ID` | `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a` | MSAL Client ID |
| `PROD_VITE_MSAL_TENANT_ID` | `502d9d81-2020-456b-b113-b84108acf846` | MSAL Tenant ID |
| `PROD_VITE_GOOGLE_CLIENT_ID` | `606135389544-41ed3f4jm0njuh64k7a97nmrjiur4hsp.apps.googleusercontent.com` | Google Client ID |
| `PROD_VITE_API_BASE_URL` | `https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net` | Backend API URL |
| `PROD_AZURE_TENANT_ID` | `42619268-2056-407a-9f6c-72e6741615e5` | Azure Tenant ID |
| `PROD_AZURE_CLIENT_ID` | `d4ea5537-8b2a-4b88-9dbd-80bf02596c1a` | Azure Client ID |
| `PROD_COSMOS_ENDPOINT` | `https://cosmosdb-serverless-echopad-website.documents.azure.com:443/` | Cosmos DB endpoint |
| `PROD_COSMOS_KEY` | (Get from Azure Portal → Cosmos DB → Keys) | Cosmos DB key |
| `PROD_COSMOS_DATABASE` | `echopad` | Cosmos DB database name |
| `PROD_GOOGLE_CLIENT_ID` | `606135389544-41ed3f4jm0njuh64k7a97nmrjiur4hsp.apps.googleusercontent.com` | Google Client ID |
| `PROD_MAGIC_LINK_JWT_SECRET` | (Generate a secure random string) | JWT secret for magic links |
| `PROD_AZURE_COMMUNICATION_CONNECTION_STRING` | (From Azure Communication Service) | Email service connection string |
| `PROD_AZURE_COMMUNICATION_SENDER_EMAIL` | `DoNotReply@echopad.ai` | Sender email address |

### Development Secrets (DEV_*)

**Note:** If you have separate DEV environment, create `DEV_*` secrets with DEV values. Otherwise, you can use the same values as PROD for testing.

## 🔄 Quick Update Script

You can also use the script to generate the JSON:

```bash
cd .github
./update-azure-secrets.sh
```

## ✅ Verification

After updating secrets, test by:
1. Pushing to `main` or `develop` branch
2. Check GitHub Actions workflow runs
3. Verify Azure login succeeds
4. Check deployment completes

## 🔒 Security Notes

- ⚠️ **Never commit secrets to git**
- ⚠️ **Never share secrets in plain text**
- ⚠️ **Rotate secrets regularly**
- ⚠️ **Use separate secrets for PROD and DEV**

## 📝 Secret Expiration

The client secret created on **2026-02-02** will expire in **24 months** (default). Set a reminder to rotate before expiration.
