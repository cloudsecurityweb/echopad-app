# 🏗 Backend Architecture

This page describes the high-level architecture of the Echopad backend, including folder organization, the request lifecycle, and key design patterns.

---

## Folder Structure

```
backend/src/
├── server.js              # Express app, middleware pipeline, startup
├── config/
│   ├── index.js           # Loads dotenv (imported first)
│   ├── cosmosClient.js    # Cosmos DB client, connection, container access
│   └── containers.js      # Container names & partition key config
├── controllers/           # Request handlers (thin — delegate to services)
├── services/              # Business logic layer
├── models/                # Data schemas / document structures
├── routes/                # Express route definitions
│   └── index.js           # Master router mounting all sub-routers
├── middleware/            # Auth strategies, error handlers
│   ├── auth.js            # Unified auth dispatcher
│   ├── entraAuth.js       # Microsoft Entra ID verification
│   ├── googleAuth.js      # Google OAuth verification
│   ├── magicAuth.js       # Magic Link token verification
│   ├── emailPasswordAuth.js # Email/Password token verification
│   ├── productAccess.js   # Product-level access control
│   ├── errorHandler.js    # Global error handler
│   ├── notFound.js        # 404 handler
│   └── devOnly.js         # Dev-only route guard
├── templates/             # Nunjucks email templates
│   ├── layout.njk         # Shared email layout
│   ├── license-request.njk
│   └── auth/              # Auth-related email templates
├── utils/
│   ├── apiError.js        # Custom ApiError class
│   ├── apiResponse.js     # Standardized response helper
│   ├── asyncHandler.js    # Async/await error wrapper
│   └── oidUtils.js        # OID (Object ID) utilities
├── docs/                  # Internal architecture docs
└── public/                # Static assets served at /public
```

---

## Request Lifecycle

Every incoming HTTP request flows through this pipeline:

```
Client Request
    │
    ▼
┌────────────────────────┐
│  Helmet (security)     │  Sets CSP, HSTS, etc.
├────────────────────────┤
│  CORS                  │  Origin validation
├────────────────────────┤
│  express.json()        │  Parse JSON body
├────────────────────────┤
│  Route Matching        │  routes/index.js dispatches
├────────────────────────┤
│  Auth Middleware        │  Token verification (if protected)
│  ├─ detectAuthProvider  │  Inspects JWT issuer
│  ├─ verifyEntraToken    │  Microsoft Entra ID
│  ├─ verifyGoogleToken   │  Google OAuth
│  ├─ verifyMagicToken    │  Magic Link
│  └─ verifyEmailPwdToken │  Email/Password
├────────────────────────┤
│  Controller            │  Validates input, calls service
├────────────────────────┤
│  Service               │  Business logic, DB operations
├────────────────────────┤
│  Model                 │  Document structure / validation
├────────────────────────┤
│  Response              │  Standardized JSON response
└────────────────────────┘
    │
    ▼  (on error)
┌────────────────────────┐
│  errorHandler          │  Catches & formats errors
└────────────────────────┘
```

---

## Design Patterns

### Controller → Service → Model

The backend follows a **layered architecture**:

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Controller** | Parse request, validate input, call service, return response | `authController.js` |
| **Service** | Business logic, orchestrate DB calls, enforce rules | `userService.js` |
| **Model** | Define document structure, default values, validation | `user.js` |

Controllers are kept thin — they should not contain business logic.

### Unified Auth Middleware

Instead of separate middleware per route, the `detectAuthProvider` function inspects the JWT `iss` (issuer) claim and routes to the correct verification strategy:

| Issuer | Strategy |
|--------|----------|
| `echopad-magic` | Magic Link |
| `echopad-email-password` | Email/Password |
| `accounts.google.com` | Google OAuth |
| `login.microsoftonline.com` / `sts.windows.net` | Microsoft Entra ID |

### Async Error Handling

All async route handlers are wrapped with `asyncHandler()` to avoid try/catch boilerplate:

```javascript
import { asyncHandler } from '../utils/asyncHandler.js';

router.get('/users', asyncHandler(async (req, res) => {
  const users = await userService.getAll();
  res.json({ success: true, data: users });
}));
```

### Standardized Error Responses

All errors return a consistent shape:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable description"
}
```

The `ApiError` class (`utils/apiError.js`) is thrown from services and caught by the global `errorHandler` middleware.

---

## Middleware Pipeline

The middleware is applied in this order in `server.js`:

1. **Helmet** — Sets security headers (CSP, XSS protection, etc.)
2. **Permissions-Policy** — Restricts browser features (geolocation, microphone, etc.)
3. **CORS** — Validates request origins against allowlist
4. **express.json()** — Parses JSON request bodies
5. **Routes** — All route handlers
6. **errorHandler** — Catches thrown errors and sends JSON response
7. **notFound** — Returns 404 for unmatched routes

---

## Startup Sequence

When the server starts (`server.js`):

1. Load environment variables via `config/index.js`
2. Configure Express app with middleware
3. Mount all routes
4. Start listening on `PORT` (default `3000`)
5. If Cosmos DB is configured:
   - Test connection to Cosmos DB
   - Ensure all containers exist (auto-create missing ones)
   - Start warmup service (pings DB every 5 minutes to avoid cold starts)

---

## Multi-Tenancy

The application uses **tenant-based isolation** within Cosmos DB:

- All containers use `/tenantId` as the partition key
- Each organization gets a unique `tenantId`
- All queries are scoped to the user's tenant
- SuperAdmin users can access cross-tenant data

---

## Related Pages

- [API Reference](./api-reference.md) — Full endpoint listing
- [Authentication](./authentication.md) — Auth strategy details
- [Database](./database.md) — Cosmos DB setup and models
- [Services](./services.md) — Business logic layer
