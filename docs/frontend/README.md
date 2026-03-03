# 🎨 Frontend Documentation

The Echopad frontend is a **React 19 SPA** built with **Vite** and **Tailwind CSS 4**. It serves the public marketing site and the authenticated dashboard with role-based views.

---

## Table of Contents

| Page | Description |
|------|-------------|
| [Architecture](./architecture.md) | Folder structure, provider tree, styling |
| [Routing](./routing.md) | Complete route map & route guards |
| [Authentication](./authentication.md) | AuthContext, MSAL, Google OAuth flows |
| [State Management](./state-management.md) | Contexts, hooks, data flow patterns |
| [API Layer](./api-layer.md) | HTTP client, API modules, interceptors |
| [Components](./components.md) | Component groups reference |
| [Environment Variables](./environment-variables.md) | `VITE_*` env var reference |
| [Deployment](./deployment.md) | Azure Static Web Apps & CI/CD |

---

## Quick Facts

| Property | Value |
|----------|-------|
| **Framework** | React 19 |
| **Build Tool** | Vite 7 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router 7 |
| **Auth** | MSAL React (Microsoft) + Google OAuth |
| **HTTP Client** | Axios |
| **Charts** | Recharts |
| **Toasts** | React Toastify |
| **Entry Point** | `src/main.jsx` → `src/App.jsx` |
| **Default Port** | `5173` |

---

## Running Locally

```bash
cd frontend
npm install
npm run dev        # Starts Vite dev server with HMR
```

App runs at: http://localhost:5173

### Other Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Start with hot module replacement |
| Build | `npm run build` | Production build to `dist/` |
| Preview | `npm run preview` | Preview production build locally |
| Lint | `npm run lint` | Run ESLint |
