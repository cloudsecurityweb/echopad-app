# 📡 API Reference

Complete REST API reference for the Echopad backend. All endpoints are prefixed with the base URL (default: `http://localhost:3000`).

---

## Health & System

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | ❌ | Server & Cosmos DB health check |
| `GET` | `/health/cosmos` | ❌ | Test Cosmos DB read/write operations |
| `GET` | `/health/warmup` | ❌ | Keep Cosmos DB connection warm |
| `POST` | `/health/containers` | ❌ | Trigger container creation/verification |
| `POST` | `/seed-demo` | ❌ | Seed demo data (dev only) |

---

## Authentication (`/api/auth`)

### OAuth (Microsoft / Google)

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/sign-in` | ❌ | `{ provider, token }` | Sign in with OAuth token |
| `POST` | `/api/auth/sign-up` | ❌ | `{ provider, token, organizationName, organizerName, email }` | Register new org + user |
| `GET` | `/api/auth/me` | ✅ Bearer | — | Get current user profile |

### Email/Password

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/sign-up-email` | ❌ | `{ organizationName, organizerName, email, password }` | Register with email/password |
| `POST` | `/api/auth/sign-in-email` | ❌ | `{ email, password }` | Sign in with email/password |
| `POST` | `/api/auth/refresh` | ❌ | `{ refreshToken }` | Refresh session token |
| `POST` | `/api/auth/change-password` | ✅ Bearer | `{ oldPassword, newPassword }` | Change password |
| `POST` | `/api/auth/forgot-password` | ❌ | `{ email }` | Request password reset email |
| `POST` | `/api/auth/reset-password` | ❌ | `{ token, newPassword }` | Reset password with token |

### Email Verification

| Method | Endpoint | Auth | Params | Description |
|--------|----------|------|--------|-------------|
| `GET` | `/api/auth/verify-email` | ❌ | `?email=&token=` | Verify email address |
| `POST` | `/api/auth/resend-verification` | ❌ | `{ email }` | Resend verification email |

---

## Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users` | ✅ | List all users |
| `GET` | `/api/users/:id` | ✅ | Get user by ID |
| `POST` | `/api/users` | ✅ | Create a new user |
| `PUT` | `/api/users/:id` | ✅ | Update a user |
| `DELETE` | `/api/users/:id` | ✅ | Delete a user |
| `GET` | `/api/users/profile/:tenantId/:userId` | ✅ | Get user profile by tenant + user ID |

---

## Organizations (`/api/organizations`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/organizations` | ✅ | List organizations |
| `GET` | `/api/organizations/:id` | ✅ | Get organization by ID |
| `POST` | `/api/organizations` | ✅ | Create organization |
| `PUT` | `/api/organizations/:id` | ✅ | Update organization |
| `DELETE` | `/api/organizations/:id` | ✅ | Delete organization |

---

## Invitations (`/api/invites`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/invites` | ✅ | List invitations |
| `POST` | `/api/invites` | ✅ | Send an invitation |
| `GET` | `/api/invites/:id` | ✅ | Get invitation details |
| `PUT` | `/api/invites/:id` | ✅ | Update invitation |
| `DELETE` | `/api/invites/:id` | ✅ | Delete invitation |

---

## Dashboard (`/api/dashboard`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/dashboard/metrics` | ✅ | Get dashboard metrics |

---

## Analytics (`/api/analytics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/analytics/super-admin` | ✅ | Super admin analytics overview |
| `GET` | `/api/analytics/platform-metrics` | ✅ | Platform-wide metrics |

---

## Clients (`/api/clients`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/clients` | ✅ | List clients |
| `POST` | `/api/clients` | ✅ | Create a client |

---

## Products (`/api/products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/products` | ✅ | List all products |
| `GET` | `/api/products/:id` | ✅ | Get product by ID |
| `POST` | `/api/products` | ✅ | Create product |

---

## Org Products (`/api/org-products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/org-products` | ✅ | List products for organization |
| `POST` | `/api/org-products` | ✅ | Assign product to organization |
| `DELETE` | `/api/org-products/:id` | ✅ | Remove product from organization |

---

## Licenses (`/api/licenses`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/licenses` | ✅ | List licenses |
| `POST` | `/api/licenses` | ✅ | Create license |
| `GET` | `/api/licenses/:id` | ✅ | Get license by ID |
| `PUT` | `/api/licenses/:id` | ✅ | Update license |
| `DELETE` | `/api/licenses/:id` | ✅ | Delete license |

---

## License Assignments (`/api/license-assignments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/license-assignments` | ✅ | List license assignments |
| `POST` | `/api/license-assignments` | ✅ | Assign license |

---

## User Licenses (`/api/user-licenses`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user-licenses` | ✅ | List user license assignments |
| `POST` | `/api/user-licenses` | ✅ | Assign license to user |
| `DELETE` | `/api/user-licenses/:id` | ✅ | Remove license from user |

---

## User Products (`/api/user-products`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/user-products` | ✅ | List user's product access |

---

## Transcription History (`/api/transcription-history`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/transcription-history` | ✅ | List transcription history |
| `POST` | `/api/transcription-history` | ✅ | Record a transcription event |

---

## Transcription Metrics (`/api`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/internal/metrics` | ✅ | Submit transcription metrics (from desktop app) |
| `GET` | `/api/metrics/user` | ✅ | Get user-level metrics |
| `GET` | `/api/metrics/client` | ✅ | Get client-level metrics |
| `GET` | `/api/metrics/platform` | ✅ | Get platform-wide metrics (SuperAdmin) |

---

## Help Center (`/api/help-center`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/help-center` | ✅ | List help documents |
| `GET` | `/api/help-center/:id` | ✅ | Get help document by ID |
| `POST` | `/api/help-center` | ✅ | Create help document |
| `PATCH` | `/api/help-center/:id` | ✅ | Update help document |

---

## Client Feedback (`/api/client-feedback`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/client-feedback` | ✅ | List feedback entries |
| `POST` | `/api/client-feedback` | ✅ | Submit feedback |

---

## Intercom (`/api/intercom`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/intercom/identity` | ✅ | Get Intercom identity verification hash |

---

## Downloads (`/api/download`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/download/ai-scribe/desktop` | ❌ | Download AI Scribe Windows installer (.exe) |
| `GET` | `/api/download/ai-scribe/mac` | ❌ | Download AI Scribe macOS installer (.dmg) |

---

## Response Format

### Success

```json
{
  "success": true,
  "data": { ... }
}
```

### Error

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed description"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad request / validation error |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Resource not found |
| `409` | Conflict (duplicate resource) |
| `500` | Internal server error |
| `503` | Service unavailable (DB connection issue) |
