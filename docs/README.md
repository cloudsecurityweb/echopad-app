# 📚 Echopad Documentation

Welcome to the **Echopad** developer documentation — the go-to resource for understanding, running, and contributing to the Echopad healthcare AI platform.

---

## Quick Links

| Resource | Description |
|----------|-------------|
| [Getting Started](./getting-started.md) | Set up your dev environment and run the app locally |
| [Backend Docs](./backend/README.md) | API, architecture, auth, database, services |
| [Frontend Docs](./frontend/README.md) | React app architecture, components, routing, state |
| [Contributing to Docs](./contributing-to-docs.md) | How to add or update documentation pages |
| [Bugs & Resolutions](./bugs-and-resolutions.md) | Past bugs, root causes, and how they were fixed |

---

## Project Overview

**Echopad** is a full-stack healthcare AI platform that helps clinics and healthcare organizations streamline operations through intelligent AI agents. The platform includes:

- **AI Scribe** — Automated medical transcription
- **AI DocMan** — Intelligent document management
- **AI Medical Assistant** — Clinical decision support
- **AI Receptionist** — Automated patient communication
- **AI Admin Assistant** — Administrative task automation
- **AI Reminders** — Smart patient reminders
- **EchoPad Insights** — Analytics and reporting
- **Aperio** — Secure data transfer

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS 4, React Router 7 |
| **Backend** | Node.js 18+, Express 4, ES Modules |
| **Database** | Azure Cosmos DB (NoSQL) |
| **Auth** | Microsoft Entra ID (MSAL), Google OAuth, Magic Link, Email/Password |
| **Hosting** | Azure App Service (backend), Azure Static Web Apps (frontend) |
| **CI/CD** | GitHub Actions |
| **E2E Testing** | Playwright |
| **Analytics** | Google Analytics, Intercom |

---

## Documentation Map

```
docs/
├── README.md                    ← You are here
├── getting-started.md           ← Onboarding guide
├── contributing-to-docs.md      ← How to write docs
│
├── backend/
│   ├── README.md                ← Backend overview & TOC
│   ├── architecture.md          ← Folder structure, request lifecycle
│   ├── api-reference.md         ← Complete REST API reference
│   ├── authentication.md        ← Auth strategies deep dive
│   ├── database.md              ← CosmosDB models & config
│   ├── services.md              ← Business logic layer
│   ├── environment-variables.md ← Env var reference
│   └── deployment.md            ← Azure deployment guide
│
└── frontend/
    ├── README.md                ← Frontend overview & TOC
    ├── architecture.md          ← Component tree, providers
    ├── routing.md               ← Route map & guards
    ├── authentication.md        ← AuthContext, MSAL, Google
    ├── state-management.md      ← Contexts, hooks, data flow
    ├── api-layer.md             ← HTTP client & API modules
    ├── components.md            ← Component groups reference
    ├── environment-variables.md ← VITE_* env vars
    └── deployment.md            ← Static Web Apps deploy
```

---

## How to Use These Docs

1. **New to the project?** → Start with [Getting Started](./getting-started.md)
2. **Working on the API?** → Go to [Backend Docs](./backend/README.md)
3. **Building UI features?** → Go to [Frontend Docs](./frontend/README.md)
4. **Want to add docs?** → Read [Contributing to Docs](./contributing-to-docs.md)

---

> **💡 Tip:** These docs live in the repo under `docs/` and are version-controlled alongside the code. Always keep them up to date when making significant changes.
