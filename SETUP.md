# Echopad Application Setup Guide

Complete guide to set up and deploy the Echopad application.

## 📋 Prerequisites

1. **Infrastructure Deployed**: Ensure infrastructure is deployed via `echopad-infra` repository
2. **GitHub Repository**: Application code repository created
3. **Node.js 18+**: Installed locally
4. **Git**: Installed

## 🚀 Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/your-org/echopad.git
cd echopad
```

### 2. Local Development Setup

#### Backend

```bash
cd backend
npm install

# Create .env file (see ENV_VARIABLES.md)
cp .env.example .env
# Edit .env with your local values

npm run dev
```

Backend runs on: `http://localhost:3000`

#### Frontend

```bash
cd frontend
npm install

# Create .env.local file
cp .env.example .env.local
# Edit .env.local with your local values

npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔧 Environment Variables

### Backend (.env)

Required variables (see `ENV_VARIABLES.md` for complete list):

```bash
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
COSMOS_ENDPOINT=your-cosmos-endpoint
COSMOS_KEY=your-cosmos-key
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-api-client-id
```

### Frontend (.env.local)

Required variables:

```bash
VITE_MSAL_CLIENT_ID=your-msal-client-id
VITE_MSAL_TENANT_ID=your-tenant-id
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🚀 Deployment

### Automatic Deployment (GitHub Actions)

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **GitHub Actions will automatically**:
   - Build backend
   - Deploy to Azure App Service
   - Build frontend
   - Deploy to Azure Static Web Apps

### Manual Deployment

See `DEPLOYMENT.md` for manual deployment instructions.

## 🔐 GitHub Secrets Configuration

Before first deployment, configure GitHub Secrets:

**Repository**: `https://github.com/your-org/echopad/settings/secrets/actions`

**Required Secrets**:

**Azure Authentication:**
- `AZURE_CLIENT_ID` - Service Principal Client ID
- `AZURE_TENANT_ID` - Azure AD Tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure Subscription ID

**Backend Deployment:**
- `AZURE_WEBAPP_NAME` - App Service name (from Terraform output)
- `AZURE_RESOURCE_GROUP` - Resource group name (from Terraform output)

**Frontend Deployment:**
- `AZURE_STATIC_WEB_APP_NAME` - Static Web App name (from Terraform output)
- `AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN` - Deployment token (from Terraform output)

**Frontend Environment Variables:**
- `VITE_MSAL_CLIENT_ID` - MSAL Client ID
- `VITE_MSAL_TENANT_ID` - Tenant ID
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_API_BASE_URL` - Backend API URL (from Terraform output)
- `VITE_API_ENDPOINT` - Whisper API endpoint (optional)
- `VITE_API_ROUTE` - Whisper API route (optional)

## 📦 Project Structure

```
echopad/
├── frontend/              # React + Vite frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Dependencies
├── backend/              # Node.js + Express backend
│   ├── src/              # Source code
│   └── package.json      # Dependencies
└── .github/
    └── workflows/        # CI/CD pipelines
```

## 🔄 CI/CD Pipeline

### Workflows

1. **Backend Deployment** (`.github/workflows/backend-deploy.yml`)
   - Triggers on: Push to `main` with changes in `backend/`
   - Builds backend
   - Deploys to Azure App Service

2. **Frontend Deployment** (`.github/workflows/frontend-deploy.yml`)
   - Triggers on: Push to `main` with changes in `frontend/`
   - Builds frontend
   - Deploys to Azure Static Web Apps

3. **Full Stack Deployment** (`.github/workflows/full-deploy.yml`)
   - Triggers on: Push to `main`
   - Deploys both backend and frontend

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📚 Documentation

- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `ENV_VARIABLES.md` - Environment variables reference
- `backend/README.md` - Backend API documentation
- `frontend/README.md` - Frontend documentation

## 🔗 Related Repositories

- **Infrastructure**: [echopad-infra](https://github.com/your-org/echopad-infra)

## 🆘 Troubleshooting

### Build Failures

- Check Node.js version: `node --version` (should be 18+)
- Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript/ESLint errors

### Deployment Failures

- Verify GitHub Secrets are set correctly
- Check Azure authentication in GitHub Actions logs
- Verify resource names match Terraform outputs

### Local Development Issues

- Ensure `.env` files are created
- Check Cosmos DB connection strings
- Verify Azure AD app registrations are configured
