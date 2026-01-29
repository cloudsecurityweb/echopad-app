# GitHub Actions Workflows

This directory contains CI/CD workflows for the Echopad application.

## Workflows

### `backend-deploy.yml`

Deploys backend to Azure App Service.

**Triggers:**
- Push to `main`/`master` with changes in `backend/`
- Manual trigger (`workflow_dispatch`)

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Create deployment package
5. Deploy to Azure App Service
6. Restart App Service

### `frontend-deploy.yml`

Deploys frontend to Azure Static Web Apps.

**Triggers:**
- Push to `main`/`master` with changes in `frontend/`
- Manual trigger (`workflow_dispatch`)

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Build frontend with environment variables
5. Deploy to Azure Static Web Apps
6. Configure app settings

### `full-deploy.yml`

Deploys both backend and frontend.

**Triggers:**
- Push to `main`/`master`
- Manual trigger (`workflow_dispatch`)

## Required GitHub Secrets

See `SETUP.md` for complete list of required secrets.

## Monitoring

View workflow runs in: `https://github.com/your-org/echopad/actions`
