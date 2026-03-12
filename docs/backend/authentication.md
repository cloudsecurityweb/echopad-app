# 🔐 Backend Authentication

The Echopad backend supports **four authentication strategies**, automatically detected from the JWT token's `iss` (issuer) claim. This page explains each strategy, the middleware chain, and role mapping.

---

## Authentication Strategies

| Strategy | Issuer Claim | Token Type | Use Case |
|----------|-------------|------------|----------|
| **Microsoft Entra ID** | `login.microsoftonline.com` / `sts.windows.net` | JWT (JWKS-verified) | Primary enterprise auth |
| **Google OAuth** | `accounts.google.com` | OAuth ID token | Google sign-in |
| **Magic Link** | `echopad-magic` | JWT (HMAC secret) | Passwordless email login |
| **Email/Password** | `echopad-email-password` | JWT (HMAC secret) | Traditional email/password |

---

## How Auth Detection Works

The `detectAuthProvider` middleware (in `src/routes/auth.js`) inspects the incoming token:

```
Incoming Bearer Token
    │
    ▼
Parse JWT payload (base64 decode)
    │
    ▼
Check `iss` (issuer) claim
    │
    ├─ "echopad-magic"              → Magic Link verification
    ├─ "echopad-email-password"     → Email/Password verification
    ├─ "accounts.google.com"        → Google OAuth verification
    ├─ "login.microsoftonline.com"  → Microsoft Entra verification
    └─ Unknown / fallback           → Try Microsoft → then Google
```

The unified `verifyAnyAuth` middleware (in `src/middleware/auth.js`) tries all strategies sequentially until one succeeds.

---

## Microsoft Entra ID

**Files:** `src/middleware/entraAuth.js`

This is the primary auth strategy for enterprise users.

### Verification Steps

1. Extract `Bearer` token from `Authorization` header
2. Decode JWT to extract `tid` (tenant ID)
3. Fetch JWKS keys from `https://login.microsoftonline.com/{tid}/discovery/v2.0/keys`
4. Verify JWT signature using the matching public key
5. Validate audience (`aud`) matches `AZURE_CLIENT_ID`
6. Validate issuer matches tenant
7. Attach user info to `req.auth`

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `AZURE_TENANT_ID` | Your Entra ID tenant ID |
| `AZURE_CLIENT_ID` | App registration client ID |

---

## Google OAuth

**Files:** `src/middleware/googleAuth.js`

### Verification Steps

1. Extract `Bearer` token from `Authorization` header
2. Verify the Google ID token using Google's token info endpoint
3. Validate audience matches `GOOGLE_CLIENT_ID`
4. Extract user info (email, name, picture, sub)
5. Attach user info to `req.auth`

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |

---

## Magic Link

**Files:** `src/middleware/magicAuth.js`, `src/services/emailService.js`

Magic Link provides passwordless authentication via email:

1. User requests a magic link (enters email)
2. Backend generates a JWT with `iss: 'echopad-magic'` and sends an email
3. User clicks the link containing the token
4. Backend verifies the token with the shared JWT secret

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `MAGIC_LINK_JWT_SECRET` | HMAC secret for signing magic tokens |
| `MAGIC_LINK_TTL_MINUTES` | Token expiry (default: `1440` = 24 hours) |

---

## Email/Password

**Files:** `src/middleware/emailPasswordAuth.js`, `src/controllers/passwordAuthController.js`

Traditional email/password auth with bcrypt hashing:

### Registration Flow

1. User submits `{ email, password, organizationName, organizerName }`
2. Backend validates input, hashes password with `bcrypt`
3. Creates organization + user in Cosmos DB
4. Sends verification email
5. Returns JWT tokens (access + refresh)

### Sign-in Flow

1. User submits `{ email, password }`
2. Backend finds user by email, verifies email is confirmed
3. Compares password hash with `bcrypt.compare()`
4. Returns JWT tokens (access + refresh)

### Token Management

| Token | TTL | Purpose |
|-------|-----|---------|
| Access token | Configurable via `EMAIL_PASSWORD_TOKEN_TTL_MINUTES` | API authentication |
| Refresh token | 30 days | Session renewal |

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `EMAIL_PASSWORD_JWT_SECRET` | HMAC secret for JWT signing |
| `EMAIL_PASSWORD_TOKEN_TTL_MINUTES` | Access token TTL (default: `1440`) |

---

## Role Mapping

After authentication, the user is assigned a role. Roles are mapped from the auth provider to internal roles:

| Source | Value | Internal Role |
|--------|-------|---------------|
| Entra ID app role | `SuperAdmin` | `superAdmin` |
| Entra ID app role | `ClientAdmin` | `clientAdmin` |
| Entra ID app role | `UserAdmin` | `user` |
| Email domain | `@cloudsecurityweb.com` | `superAdmin` (auto-upgrade) |
| Default (new users) | — | `clientAdmin` |

### Role Hierarchy

```
superAdmin     → Full platform access, manage all tenants
  └── clientAdmin  → Manage their organization, users, licenses
        └── user       → Use products, view own data
```

---

## Request Object After Auth

After successful authentication, middleware attaches:

```javascript
req.auth = {
  provider: 'microsoft' | 'google' | 'magic' | 'email-password',
  tenantId: '...',
  userId: '...',
  email: '...',
  name: '...',
  roles: ['SuperAdmin'],   // Entra ID roles (if applicable)
  oid: '...',              // Object ID
};

req.currentUser = {
  // Full user document from Cosmos DB
  id: '...',
  email: '...',
  role: 'superAdmin',
  tenantId: '...',
  // ...
};
```

---

## Adding a New Auth Strategy

To add a new authentication provider:

1. Create a new middleware file in `src/middleware/` (e.g., `samlAuth.js`)
2. Export a `verify*Token(req, res, next)` function
3. Add issuer detection logic in `detectAuthProvider` (`src/routes/auth.js`)
4. Add the strategy to `verifyAnyAuth` chain (`src/middleware/auth.js`)
5. Update this documentation

---

## Related Pages

- [Architecture](./architecture.md) — Middleware pipeline overview
- [API Reference](./api-reference.md) — Auth endpoint details
- [Environment Variables](./environment-variables.md) — Auth-related env vars
