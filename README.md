# Echopad Application

Full-stack application with React frontend and Node.js backend.

## 📁 Project Structure

```
echopad/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── .github/
    └── workflows/     # GitHub Actions CI/CD
```

##  Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Azure account (for deployment)

### Local Development

#### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on: `http://localhost:3000`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

##  Environment Variables

### Backend

Create `backend/.env`:

```bash
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
COSMOS_ENDPOINT=your-cosmos-endpoint
COSMOS_KEY=your-cosmos-key
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
# ... see ENV_VARIABLES.md for complete list
```

### Frontend

Create `frontend/.env.local`:

```bash
VITE_MSAL_CLIENT_ID=your-msal-client-id
VITE_MSAL_TENANT_ID=your-tenant-id
VITE_API_BASE_URL=http://localhost:3000
# ... see ENV_VARIABLES.md for complete list
```

##  Deployment

### Automatic (GitHub Actions)

Push to `main` branch triggers automatic deployment:

- **Backend**: Deploys to Azure App Service
- **Frontend**: Deploys to Azure Static Web Apps

### Manual Deployment

See `DEPLOYMENT.md` for manual deployment instructions.

##  CI/CD Pipeline

GitHub Actions workflows:

- `.github/workflows/backend-deploy.yml` - Backend deployment
- `.github/workflows/frontend-deploy.yml` - Frontend deployment
- `.github/workflows/full-deploy.yml` - Full stack deployment

### Required GitHub Secrets

**For Backend:**
- `AZURE_CLIENT_ID` - Service Principal Client ID
- `AZURE_TENANT_ID` - Azure AD Tenant ID
- `AZURE_SUBSCRIPTION_ID` - Azure Subscription ID
- `AZURE_WEBAPP_NAME` - App Service name
- `AZURE_RESOURCE_GROUP` - Resource group name

**For Frontend:**
- `AZURE_STATIC_WEB_APP_NAME` - Static Web App name
- `AZURE_STATIC_WEB_APP_DEPLOYMENT_TOKEN` - Deployment token
- `VITE_MSAL_CLIENT_ID` - MSAL Client ID
- `VITE_MSAL_TENANT_ID` - Tenant ID
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth Client ID
- `VITE_API_BASE_URL` - Backend API URL
- `VITE_API_ENDPOINT` - Whisper API endpoint (optional)
- `VITE_API_ROUTE` - Whisper API route (optional)

## 🏗 Infrastructure

Infrastructure is managed separately in the `echopad-infra` repository using Terraform.

See: https://github.com/your-org/echopad-infra

## 📚 Documentation

- `DEPLOYMENT.md` - Deployment guide
- `ENV_VARIABLES.md` - Environment variables reference
- `backend/README.md` - Backend API documentation
- `frontend/README.md` - Frontend documentation

##  Related Repositories

- **Infrastructure**: [echopad-infra](https://github.com/your-org/echopad-infra) - Terraform infrastructure code

##  License

[Your License Here]
