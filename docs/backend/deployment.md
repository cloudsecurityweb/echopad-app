# 🚀 Backend Deployment

This page covers deploying the Echopad backend to **Azure App Service** and the CI/CD pipeline via **GitHub Actions**.

---

## Deployment Architecture

```
GitHub (main branch)
    │
    ▼  push triggers
GitHub Actions (deploy.yml)
    │
    ├─ Build backend
    ├─ Set env vars
    └─ Deploy to Azure App Service
          │
          ▼
Azure App Service (Node.js 18)
    │
    ├─ startup.sh (installs Azure CLI)
    └─ node src/server.js
          │
          ▼
Azure Cosmos DB (Serverless)
```

---

## CI/CD Pipeline

### Workflow File

`.github/workflows/deploy.yml` handles both backend and frontend deployment.

### Trigger

The pipeline runs on:
- Push to `main` branch
- Manual trigger (workflow dispatch)

### Backend Build Steps

1. Checkout code
2. Set up Node.js 18
3. Install dependencies (`npm ci`)
4. Deploy to Azure App Service

---

## Azure App Service Configuration

### Application Settings

Set these in **Azure Portal → App Service → Configuration → Application Settings**:

| Setting | Value |
|---------|-------|
| `PORT` | `8080` (or your App Service port) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend-domain.com` |
| `COSMOS_ENDPOINT` | Your Cosmos DB URI |
| `COSMOS_KEY` | Your Cosmos DB key |
| `COSMOS_DATABASE` | `echopad` |
| `AZURE_TENANT_ID` | Your Entra ID tenant |
| `AZURE_CLIENT_ID` | Your app registration client ID |

> See [Environment Variables](./environment-variables.md) for the complete list.

### Startup Script

The backend uses a custom startup script (`scripts/startup.sh`) that:

1. Installs Azure CLI on the App Service instance
2. Installs the `azure-devops` CLI extension
3. Starts the Node.js application

This is required for the **AI Scribe desktop app downloads** (`.exe` / `.dmg`) from Azure Artifacts.

Configure in App Service:
```
Startup command: bash scripts/startup.sh
```

---

## Manual Deployment

### Option A: Azure CLI

```bash
cd backend
az login
az webapp up \
  --name your-app-service-name \
  --resource-group your-resource-group \
  --runtime "NODE:18-lts"
```

### Option B: Git Push

```bash
# Get the deployment URL from App Service → Deployment Center
git remote add azure https://your-app.scm.azurewebsites.net/your-app.git
git push azure main
```

### Option C: VS Code

1. Install the "Azure App Service" VS Code extension
2. Right-click on the `backend/` folder
3. Select "Deploy to Web App"
4. Follow the prompts

---

## Required GitHub Secrets

For the CI/CD pipeline to work, configure these secrets in **GitHub → Repo → Settings → Secrets**:

| Secret | Description |
|--------|-------------|
| `AZURE_CLIENT_ID` | Service Principal client ID |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Azure Subscription ID |
| `AZURE_WEBAPP_NAME` | App Service name |
| `AZURE_RESOURCE_GROUP` | Resource group name |

---

## Verifying Deployment

### 1. Check App Service Logs

Azure Portal → App Service → **Log stream**

Look for: `🚀 Server running on port...`

### 2. Health Check

```bash
curl https://your-app.azurewebsites.net/health
```

Expected: `{ "status": "healthy", ... }`

### 3. Cosmos DB Connectivity

```bash
curl https://your-app.azurewebsites.net/health/cosmos
```

### 4. API Endpoint

```bash
curl https://your-app.azurewebsites.net/api/users
```

---

## Troubleshooting

### App Service won't start

- Check **Log stream** for errors
- Verify all required env vars are set in Application Settings
- Ensure `PORT` matches what Azure expects (usually `8080`)

### "Azure CLI not found" for downloads

- Ensure `startup.sh` is configured as the startup command
- Check if the App Service plan supports running `apt-get` / `sudo`
- Alternative: Use a custom Docker image with Azure CLI pre-installed

### CORS errors in production

- Verify `FRONTEND_URL` in App Service settings matches your actual frontend URL
- Check that the frontend domain is in the `allowedOrigins` list in `server.js`

### Cold start delays

- The warmup service pings Cosmos DB every 5 minutes
- For faster cold starts, consider upgrading from Serverless to Provisioned throughput
- Use the `/health/warmup` endpoint from an external monitor

---

## Infrastructure

Infrastructure is managed in a separate repository (`echopad-infra`) using Terraform. Contact the DevOps team for infrastructure changes.

---

## Related Pages

- [Architecture](./architecture.md) — Server startup sequence
- [Environment Variables](./environment-variables.md) — Complete env var reference
- [Database](./database.md) — Cosmos DB setup
