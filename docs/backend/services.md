# ⚙️ Services (Business Logic)

The service layer contains all business logic in the Echopad backend. Services are called by controllers and interact with Cosmos DB models. This page provides a reference of every service and its responsibilities.

**Location:** `src/services/`

---

## Service Reference

### `userService.js`

Manages user lifecycle — creation, retrieval, updates, deletion, and profile management.

| Key Method | Description |
|------------|-------------|
| `createUser()` | Creates a user in the appropriate role container |
| `getUserById()` | Retrieves user by ID across role containers |
| `getUserByEmail()` | Finds user by email (cross-containers) |
| `getUserByOID()` | Finds user by Azure AD Object ID |
| `updateUser()` | Updates user properties |
| `deleteUser()` | Removes user from their role container |
| `getUserProfile()` | Gets user profile by tenantId + userId |

---

### `organizationService.js`

Handles organization (tenant) management — CRUD, member management, and settings.

| Key Method | Description |
|------------|-------------|
| `createOrganization()` | Creates a new organization with tenantId |
| `getOrganization()` | Retrieves organization by ID |
| `updateOrganization()` | Updates organization properties |
| `getOrganizationMembers()` | Lists all users in an org |

---

### `inviteService.js`

Invitation workflow — sending, accepting, revoking, and tracking invites.

| Key Method | Description |
|------------|-------------|
| `createInvite()` | Creates an invitation and sends email |
| `acceptInvite()` | Processes invitation acceptance |
| `getInvitesByOrg()` | Lists invites for an organization |
| `revokeInvite()` | Cancels a pending invitation |

---

### `licenseService.js`

License lifecycle management — creation, allocation, validation.

| Key Method | Description |
|------------|-------------|
| `createLicense()` | Creates a new license record |
| `getLicensesByOrg()` | Lists licenses for an organization |
| `updateLicense()` | Updates license properties (seats, status) |
| `validateLicense()` | Checks if a license is valid and active |

---

### `userLicenseService.js`

Manages license-to-user assignments — assign, revoke, check eligibility.

| Key Method | Description |
|------------|-------------|
| `assignLicense()` | Assigns a license to a user |
| `revokeLicense()` | Removes a license from a user |
| `getUserLicenses()` | Lists all licenses assigned to a user |

---

### `licenseAssignments.service.js`

Handles license-to-organization assignments.

| Key Method | Description |
|------------|-------------|
| `getAssignments()` | Lists license assignments |
| `createAssignment()` | Assigns a license to an organization |

---

### `emailService.js`

Email sending via Azure Communication Services. Uses Nunjucks templates.

| Key Method | Description |
|------------|-------------|
| `sendInvitationEmail()` | Sends organization invitation |
| `sendVerificationEmail()` | Sends email verification link |
| `sendMagicLinkEmail()` | Sends passwordless magic link |
| `sendPasswordResetEmail()` | Sends password reset link |
| `sendLicenseRequestEmail()` | Sends license request notification |

---

### `passwordAuth.js`

Password hashing and verification using `bcrypt`.

| Key Method | Description |
|------------|-------------|
| `hashPassword()` | Hashes a plaintext password |
| `comparePassword()` | Compares plaintext with stored hash |

---

### `analytics.service.js`

Analytics and reporting for super admin dashboard.

| Key Method | Description |
|------------|-------------|
| `getSuperAdminAnalytics()` | Aggregated platform-wide analytics |
| `getPlatformMetrics()` | Platform metrics for all tenants |

---

### `transcriptionMetrics.service.js`

Transcription usage tracking and metric aggregation.

| Key Method | Description |
|------------|-------------|
| `recordMetrics()` | Stores transcription metrics from desktop app |
| `getUserMetrics()` | Gets metrics for a specific user |
| `getClientMetrics()` | Gets metrics for an organization |
| `getPlatformMetrics()` | Gets platform-wide transcription metrics |

---

### `transcriptionHistory.service.js`

Records and retrieves transcription history events.

| Key Method | Description |
|------------|-------------|
| `recordTranscription()` | Saves a transcription event |
| `getHistory()` | Retrieves transcription history for a user |

---

### `dashboard.service.js`

Dashboard-specific metrics and aggregations.

| Key Method | Description |
|------------|-------------|
| `getDashboardMetrics()` | Gets summary metrics for the dashboard |

---

### `clients.service.js`

Client management for the SaaS admin panel.

| Key Method | Description |
|------------|-------------|
| `getClients()` | Lists all client organizations |

---

### `products.service.js`

Product catalog management.

| Key Method | Description |
|------------|-------------|
| `getProducts()` | Lists all products |
| `getProductById()` | Gets a product by ID |
| `createProduct()` | Creates a new product |

---

### `orgProductService.js`

Manages product-to-organization assignments.

| Key Method | Description |
|------------|-------------|
| `getOrgProducts()` | Lists products assigned to an org |
| `assignProduct()` | Assigns a product to an org |
| `removeProduct()` | Removes a product from an org |

---

### `userProduct.service.js`

User-level product access.

| Key Method | Description |
|------------|-------------|
| `getUserProducts()` | Lists products a user has access to |

---

### `helpCenter.service.js`

Help center content management.

| Key Method | Description |
|------------|-------------|
| `getDocs()` | Lists help documents |
| `getDocById()` | Gets a help document by ID |
| `createDoc()` | Creates a help document |
| `updateDoc()` | Updates a help document |

---

### `clientFeedback.service.js`

Client feedback collection and retrieval.

| Key Method | Description |
|------------|-------------|
| `getFeedback()` | Lists feedback entries |
| `submitFeedback()` | Saves new feedback |

---

### `cosmosWarmup.js`

Keeps the Cosmos DB Serverless instance warm to avoid cold starts.

| Key Method | Description |
|------------|-------------|
| `startWarmup(intervalMinutes)` | Starts periodic ping (default: 5 min) |

---

### `seed-saas-data.js`

Seeds demo/test data for development and staging environments.

| Key Method | Description |
|------------|-------------|
| `seedSaasDemoData()` | Creates sample organizations, users, products, licenses |

---

## Adding a New Service

1. Create a new file in `src/services/` (e.g., `newFeature.service.js`)
2. Import the Cosmos DB container: `import { getContainer } from '../config/cosmosClient.js';`
3. Export functions for your business logic
4. Call the service from a controller in `src/controllers/`
5. Update this documentation

### Service Conventions

- Services should **not** access `req` or `res` — they receive plain data and return results
- Throw `ApiError` for business rule violations
- Use explicit `tenantId` parameters for multi-tenant isolation
- Name files as `featureName.service.js`

---

## Related Pages

- [Architecture](./architecture.md) — How services fit into the request lifecycle
- [Database](./database.md) — Container and model reference
- [API Reference](./api-reference.md) — Endpoints that call these services
