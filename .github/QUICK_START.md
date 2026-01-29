# Quick Start: GitHub Actions Production Deployment

## Repository Setup
- **Repository**: `https://github.com/cloudsecurityweb/echopad-website`
- **Branch**: `Production`

## Step 1: Add GitHub Secrets

Go to: `https://github.com/cloudsecurityweb/echopad-website/settings/secrets/actions`

Add these secrets (copy from `GITHUB_SECRETS_REFERENCE.txt`):

### Azure Authentication
- `PROD_AZURE_CLIENT_ID`
- `PROD_AZURE_TENANT_ID`
- `PROD_AZURE_SUBSCRIPTION_ID`

### Azure Resources
- `PROD_AZURE_RESOURCE_GROUP`
- `PROD_AZURE_WEBAPP_NAME`
- `PROD_AZURE_STATIC_WEB_APP_NAME`
- `PROD_AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN`

### URLs & Database
- `PROD_FRONTEND_URL`
- `PROD_COSMOS_ENDPOINT`
- `PROD_COSMOS_KEY`
- `PROD_COSMOS_DATABASE`

### Frontend Build Variables
- `PROD_VITE_MSAL_CLIENT_ID`
- `PROD_VITE_MSAL_TENANT_ID`
- `PROD_VITE_GOOGLE_CLIENT_ID`
- `PROD_VITE_API_BASE_URL`

### Backend Environment Variables
- `PROD_GOOGLE_CLIENT_ID`
- `PROD_MAGIC_LINK_JWT_SECRET`
- `PROD_AZURE_COMMUNICATION_CONNECTION_STRING`
- `PROD_AZURE_COMMUNICATION_SENDER_EMAIL`

## Step 2: Set Up Self-Hosted Runner

Follow: `.github/SELF_HOSTED_RUNNER_SETUP.md`

Quick steps:
1. Create/use VM in `sandeepd@deepikachavala2015outlook.onmicrosoft.com` account
2. Install Node.js 20, Azure CLI, Git
3. Add runner to repository
4. Configure as service (optional)

## Step 3: Push Code to Production Branch

```bash
# If Production branch doesn't exist
git checkout -b Production

# Push to GitHub
git push origin Production
```

## Step 4: Trigger Deployment

### Automatic
- Push to `Production` branch
- Changes to `backend/**` → Backend deployment
- Changes to `frontend/**` → Frontend deployment
- Changes to both → Full deployment

### Manual
1. Go to: `https://github.com/cloudsecurityweb/echopad-website/actions`
2. Select workflow (Backend/Frontend/Full)
3. Click "Run workflow"
4. Select `Production` branch
5. Click "Run workflow"

## Workflows

- **production-backend-deploy.yml**: Deploys backend to Azure App Service
- **production-frontend-deploy.yml**: Deploys frontend to Azure Static Web App
- **production-full-deploy.yml**: Deploys both (runs in parallel)

## Verification

After deployment:
- Backend: `https://echopad-prod-api.azurewebsites.net/health`
- Frontend: `https://calm-smoke-0ef35d31e.4.azurestaticapps.net`

## Troubleshooting

- Check runner status: `https://github.com/cloudsecurityweb/echopad-website/settings/actions/runners`
- View workflow logs: `https://github.com/cloudsecurityweb/echopad-website/actions`
- Check Azure App Service logs: Azure Portal → App Service → Log stream
