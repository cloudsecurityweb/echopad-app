# 🔧 Backend Documentation

The Echopad backend is a **Node.js + Express** REST API backed by **Azure Cosmos DB**. It handles authentication, user management, organization management, licensing, analytics, and all business logic for the platform.

---

## Table of Contents

| Page | Description |
|------|-------------|
| [Architecture](./architecture.md) | Folder structure, request lifecycle, design patterns |
| [API Reference](./api-reference.md) | Complete REST API endpoint reference |
| [Authentication](./authentication.md) | Auth strategies, JWT verification, role mapping |
| [Database](./database.md) | Cosmos DB setup, containers, models |
| [Services](./services.md) | Business logic layer reference |
| [Environment Variables](./environment-variables.md) | Complete env var reference |
| [Deployment](./deployment.md) | Azure App Service deployment & CI/CD |

---

## Quick Facts

| Property | Value |
|----------|-------|
| **Runtime** | Node.js 18+ |
| **Framework** | Express 4 |
| **Module System** | ES Modules (`"type": "module"`) |
| **Database** | Azure Cosmos DB (NoSQL) |
| **Auth** | Microsoft Entra ID, Google OAuth, Magic Link, Email/Password |
| **Email** | Azure Communication Services + Nunjucks templates |
| **Entry Point** | `src/server.js` |
| **Default Port** | `3000` |

---

## Running Locally

```bash
cd backend
npm install
cp .env.example .env   # Edit with your credentials
npm run dev             # Starts with --watch for auto-reload
```

Health check: http://localhost:3000/health
