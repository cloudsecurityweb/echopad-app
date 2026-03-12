# 🚀 Getting Started

This guide walks you through setting up the Echopad project for local development. By the end, you'll have both the backend API and the frontend app running on your machine.

---

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | 18+ | `node --version` |
| **npm** | 9+ | `npm --version` |
| **Git** | Latest | `git --version` |

You will also need access to:
- **Azure Portal** — for Cosmos DB credentials and Entra ID app registration
- **Google Cloud Console** — for Google OAuth client ID (optional, for Google sign-in)

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-org/echopad-app.git
cd echopad-app
```

---

## 2. Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

At minimum, you need these variables to run locally:

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | ✅ | Server port (default: `3000`) |
| `NODE_ENV` | ✅ | Set to `development` |
| `FRONTEND_URL` | ✅ | Usually `http://localhost:5173` |
| `COSMOS_ENDPOINT` | ✅ | Your Azure Cosmos DB URI |
| `COSMOS_KEY` | ✅ | Your Azure Cosmos DB primary key |
| `COSMOS_DATABASE` | ✅ | Database name (default: `echopad`) |
| `AZURE_TENANT_ID` | ✅ | Your Entra ID tenant |
| `AZURE_CLIENT_ID` | ✅ | Your Entra ID app client ID |

> See [Backend Environment Variables](./backend/environment-variables.md) for the complete reference.

### Start the Server

```bash
npm run dev
```

The server starts at **http://localhost:3000**. Verify it's running:

```bash
curl http://localhost:3000/health
```

You should see a JSON response with `"status": "healthy"`.

---

## 3. Frontend Setup

Open a **new terminal** (keep the backend running).

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Required
VITE_API_BASE_URL=http://localhost:3000
VITE_MSAL_CLIENT_ID=your-msal-client-id
VITE_MSAL_TENANT_ID=your-tenant-id

# Optional (for Google sign-in)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

> See [Frontend Environment Variables](./frontend/environment-variables.md) for the complete reference.

### Start the Dev Server

```bash
npm run dev
```

The frontend starts at **http://localhost:5173**. Open it in your browser to see the Echopad landing page.

---

## 4. Verify Everything Works

| Check | URL | Expected |
|-------|-----|----------|
| Backend health | http://localhost:3000/health | JSON with `"status": "healthy"` |
| Backend API info | http://localhost:3000/ | JSON with endpoint listing |
| Frontend landing | http://localhost:5173 | Echopad home page |
| Sign in | http://localhost:5173/sign-in | Sign-in page loads |

---

## 5. Project Structure at a Glance

```
echopad-app/
├── backend/           # Node.js + Express API
│   ├── src/
│   │   ├── config/        # DB client, env config
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/        # Data models / schemas
│   │   ├── routes/        # Route definitions
│   │   ├── services/      # Business logic
│   │   ├── templates/     # Email templates (Nunjucks)
│   │   ├── utils/         # Helpers (API errors, async handler)
│   │   └── server.js      # Entry point
│   └── package.json
│
├── frontend/          # React + Vite SPA
│   ├── src/
│   │   ├── api/           # HTTP client & API modules
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # Auth configs (MSAL, Google)
│   │   ├── contexts/      # React Contexts (Auth, Role)
│   │   ├── data/          # Static data files
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page-level components
│   │   ├── utils/         # Utility functions
│   │   ├── App.jsx        # Root component & router
│   │   └── main.jsx       # App entry point
│   └── package.json
│
├── e2e/               # Playwright E2E tests
├── docs/              # This documentation
└── .github/workflows/ # CI/CD pipelines
```

---

## Common Issues

### "CORS error" in the browser console

Make sure your backend is running at port `3000` and your frontend `.env` has:
```
VITE_API_BASE_URL=http://localhost:3000
```

### "Missing required CosmosDB configuration"

You need valid Cosmos DB credentials in `backend/.env`. Contact a team member or check the Azure Portal.

### "Signature verification failed" on sign-in

1. Ensure `AZURE_TENANT_ID` and `AZURE_CLIENT_ID` in backend `.env` match the frontend's MSAL config
2. Both must reference the **same Azure app registration**
3. Run backend with `NODE_ENV=development` and check logs for token details

---

## Next Steps

- 📘 [Backend Documentation](./backend/README.md) — Learn about the API, auth, and services
- 📗 [Frontend Documentation](./frontend/README.md) — Learn about components, routing, and state
- 🔧 [Contributing to Docs](./contributing-to-docs.md) — Help improve this documentation
