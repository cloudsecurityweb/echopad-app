# 🔑 Backend Environment Variables

Complete reference for all environment variables used by the Echopad backend. Copy `.env.example` to `.env` and fill in your values.

---

## Server

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | ✅ | `3000` | HTTP port the server listens on |
| `NODE_ENV` | ✅ | `development` | Environment mode (`development` / `production`) |
| `FRONTEND_URL` | ✅ | `http://localhost:5173` | Frontend origin for CORS allowlist |

---

## Azure Cosmos DB

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `COSMOS_ENDPOINT` | ✅ | — | Cosmos DB account URI (e.g., `https://your-account.documents.azure.com:443/`) |
| `COSMOS_KEY` | ✅ | — | Cosmos DB primary access key |
| `COSMOS_DATABASE` | ✅ | `echopad` | Database name |
| `COSMOS_CONTAINER` | ❌ | `users` | Legacy default container (not used by new code) |

**Where to find:** Azure Portal → Your Cosmos DB Account → Keys

---

## Microsoft Entra ID (Azure AD)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AZURE_TENANT_ID` | ✅ | — | Entra ID tenant (directory) ID |
| `AZURE_CLIENT_ID` | ✅ | — | App registration client (application) ID |

**Where to find:** Azure Portal → Azure Active Directory → App registrations

> **⚠️ Important:** These must match the frontend's MSAL configuration (`VITE_MSAL_CLIENT_ID` and `VITE_MSAL_TENANT_ID`). Both backend and frontend must reference the **same** app registration.

---

## Google OAuth

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GOOGLE_CLIENT_ID` | ❌ | — | Google OAuth client ID for token verification |

**Where to find:** Google Cloud Console → Credentials → OAuth 2.0 Client IDs

---

## Magic Link (Passwordless Email)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MAGIC_LINK_JWT_SECRET` | ❌ | — | HMAC secret for signing magic link tokens (hex string) |
| `MAGIC_LINK_TTL_MINUTES` | ❌ | `1440` | Magic link token expiry in minutes (default: 24 hours) |

---

## Email/Password Auth

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `EMAIL_PASSWORD_JWT_SECRET` | ❌ | — | HMAC secret for signing email/password JWTs |
| `EMAIL_PASSWORD_TOKEN_TTL_MINUTES` | ❌ | `1440` | Access token TTL in minutes |

---

## Intercom (Identity Verification)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `INTERCOM_APP_ID` | ❌ | — | Intercom application ID |
| `INTERCOM_SECRET` | ❌ | — | Intercom identity verification secret |

**Where to find:** Intercom Dashboard → Settings → Security → Identity Verification

---

## Azure Communication Services (Email)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AZURE_COMMUNICATION_CONNECTION_STRING` | ❌ | — | Connection string for Azure Communication Services |
| `AZURE_COMMUNICATION_SENDER_EMAIL` | ❌ | — | Sender email address (e.g., `DoNotReply@your-resource.azurecomm.net`) |

**Where to find:** Azure Portal → Your Communication Service → Keys

---

## Azure DevOps (Desktop App Downloads)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AZURE_DEVOPS_PAT` | ❌ | — | Personal Access Token with **Packaging → Read** scope |

**Where to find:** Azure DevOps → User settings → Personal access tokens → New token (Packaging: Read)

---

## Production Notes

- **Never commit `.env` files** with real credentials
- In production (Azure App Service), set variables in **Configuration → Application Settings**
- Consider **Azure Key Vault** for sensitive secrets
- Variables marked ❌ (not required) are needed only if you use that specific feature

---

## Related Pages

- [Getting Started](../getting-started.md) — Quick setup guide
- [Authentication](./authentication.md) — How auth vars are used
- [Database](./database.md) — How Cosmos DB vars are used
- [Deployment](./deployment.md) — Production variable setup
