# 🗄 Database (Cosmos DB)

The Echopad backend uses **Azure Cosmos DB** (NoSQL) as its primary database. This page covers the client configuration, container setup, data models, and multi-tenant partitioning strategy.

---

## Configuration

**Files:**
- `src/config/cosmosClient.js` — Client initialization, connection testing, container management
- `src/config/containers.js` — Container names and partition key definitions
- `src/config/index.js` — Loads environment variables (dotenv)

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `COSMOS_ENDPOINT` | Cosmos DB account URI | `https://your-account.documents.azure.com:443/` |
| `COSMOS_KEY` | Primary access key | `your-primary-key` |
| `COSMOS_DATABASE` | Database name | `echopad` |
| `COSMOS_CONTAINER` | Default container (legacy) | `users` |

---

## Containers

All containers are defined in `src/config/containers.js` and are **auto-created** on server startup if they don't exist.

| Container | Purpose | Partition Key |
|-----------|---------|---------------|
| `organizations` | Organization/tenant records | `/tenantId` |
| `users` | User records (legacy, backward compat) | `/tenantId` |
| `superAdmins` | SuperAdmin user records | `/tenantId` |
| `clientAdmins` | ClientAdmin user records | `/tenantId` |
| `userAdmins` | UserAdmin user records | `/tenantId` |
| `invites` | Invitation records | `/tenantId` |
| `products` | Product catalog | `/tenantId` |
| `licenses` | License records | `/tenantId` |
| `auditEvents` | Audit log events | `/tenantId` |
| `emailVerifications` | Email verification tokens | `/tenantId` |
| `clients` | Client organization records | `/tenantId` |
| `licenseAssignments` | License-to-org assignments | `/tenantId` |
| `orgProducts` | Products assigned to organizations | `/tenantId` |
| `userLicenses` | Licenses assigned to users | `/tenantId` |
| `analyticsEvents` | Analytics event data | `/tenantId` |
| `dashboardMetrics` | Precomputed dashboard metrics | `/tenantId` |
| `helpCenterDocs` | Help center documentation | `/tenantId` |
| `clientFeedback` | Client feedback submissions | `/tenantId` |
| `transcriptionHistory` | Transcription usage history | `/tenantId` |
| `transcriptionMetrics` | Aggregated transcription metrics | `/tenantId` |

---

## Partition Strategy

**All containers use `/tenantId` as the partition key.** This ensures:

- **Tenant isolation** — Each organization's data is in a separate logical partition
- **Efficient queries** — Queries scoped to a tenant only scan that partition
- **Scalability** — Cosmos DB distributes partitions across physical nodes

> **⚠️ Important:** Every document must include a `tenantId` field. Queries without a partition key filter will trigger a **cross-partition query**, which is significantly more expensive.

---

## Data Models

Models are defined in `src/models/` and describe the shape of documents stored in each container.

### Key Models

| Model | File | Key Fields |
|-------|------|------------|
| **User** | `user.js` | `id`, `tenantId`, `email`, `name`, `role`, `provider`, `oid`, `picture` |
| **Organization** | `organization.js` | `id`, `tenantId`, `name`, `status`, `createdBy`, `settings` |
| **Invite** | `invite.js` | `id`, `tenantId`, `email`, `role`, `status`, `invitedBy`, `expiresAt` |
| **License** | `license.js` | `id`, `tenantId`, `productId`, `type`, `seats`, `status`, `expiresAt` |
| **Product** | `product.model.js` | `id`, `tenantId`, `name`, `description`, `category`, `status` |
| **Client** | `client.model.js` | `id`, `tenantId`, `organizationName`, `status` |
| **Transcription Metrics** | `transcriptionMetrics.js` | `id`, `tenantId`, `userId`, `period`, `totalMinutes`, `totalSessions` |
| **Transcription History** | `transcriptionHistory.js` | `id`, `tenantId`, `userId`, `duration`, `timestamp` |
| **Analytics Event** | `analyticsEvent.js` | `id`, `tenantId`, `eventType`, `data`, `timestamp` |
| **Audit Event** | `auditEvent.js` | `id`, `tenantId`, `action`, `userId`, `targetId`, `details`, `timestamp` |
| **Email Verification** | `emailVerification.js` | `id`, `tenantId`, `email`, `token`, `verified`, `expiresAt` |
| **Help Doc** | `helpDoc.js` | `id`, `tenantId`, `title`, `content`, `category`, `status` |
| **Client Feedback** | `clientFeedback.js` | `id`, `tenantId`, `userId`, `type`, `message`, `status` |
| **Dashboard Metrics** | `dashboardMetrics.model.js` | `id`, `tenantId`, `period`, `metrics` |
| **License Assignment** | `licenseAssignment.model.js` | `id`, `tenantId`, `licenseId`, `organizationId` |
| **Org Product** | `orgProduct.js` | `id`, `tenantId`, `productId`, `organizationId`, `status` |
| **User License** | `userLicense.js` | `id`, `tenantId`, `userId`, `licenseId`, `assignedAt` |

---

## Accessing Containers

The `cosmosClient.js` module exports helpers for working with containers:

```javascript
import { getContainer, isConfigured, testConnection, ensureContainers } from './config/cosmosClient.js';

// Get a reference to a container
const usersContainer = getContainer('users');

// CRUD operations
const { resource } = await usersContainer.items.create(document);
const { resources } = await usersContainer.items
  .query({ query: 'SELECT * FROM c WHERE c.tenantId = @tid', parameters: [{ name: '@tid', value: tenantId }] })
  .fetchAll();
```

---

## Warmup Service

**File:** `src/services/cosmosWarmup.js`

Cosmos DB Serverless can have **cold start delays**. The warmup service pings the database every 5 minutes to keep connections alive:

- Started automatically on server boot (after container verification)
- Interval configurable via `startWarmup(intervalMinutes)`
- Uses the `/health/warmup` endpoint

---

## Adding a New Container

1. Add the container name to the `CONTAINERS` array in `src/config/containers.js`
2. Add its partition key mapping to `CONTAINER_PARTITION_KEYS` (use `/tenantId` unless you have a specific reason not to)
3. Create a model file in `src/models/` defining the document structure
4. Restart the server — the container will be auto-created
5. Update this documentation

---

## Related Pages

- [Architecture](./architecture.md) — How the DB layer fits into the stack
- [Services](./services.md) — Business logic that interacts with the DB
- [Environment Variables](./environment-variables.md) — Cosmos DB credentials
