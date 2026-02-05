# Role-Based Access Flows and Data Access Patterns

## Overview

This document describes the role-based access flows and data access patterns for the multi-tenant system.

## Roles

1. **Super Admin** (`superAdmin`)
   - Belongs to organization with `type: "super"`
   - Can access all organizations and manage clients
   - Can create products globally
   - Full system access

2. **Client Admin** (`clientAdmin`)
   - Belongs to organization with `type: "client"`
   - Can purchase products/licenses for their organization
   - Can create invites for users
   - Can manage user seat assignments
   - Limited to their organization's tenant

3. **User** (`user`)
   - Belongs to a client organization
   - Can view and download products they have licenses for
   - Cannot purchase or manage licenses
   - Limited to their assigned products

## Authentication Flow (Future - Entra ID)

### Super Admin Login
- User with email domain `@cloudsecurityweb` logs in
- System identifies them as super admin
- Redirects to super admin dashboard
- Tenant ID: Organization's tenant ID (super org)

### Client Admin Login
- User from an organization logs in
- System identifies them as client admin
- Redirects to client admin dashboard
- Tenant ID: Organization's tenant ID

### User Admin Login (via Invite)
- User clicks invitation link
- System validates invitation token
- User logs in with Entra ID
- System creates user account and marks invite as accepted
- Redirects to user dashboard
- Tenant ID: Organization's tenant ID

## Data Access Patterns

### Tenant Isolation

All queries are scoped by `tenantId` (partition key) to ensure multi-tenant isolation:

```javascript
// Example: Get users for a tenant
const query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
const parameters = [{ name: "@tenantId", value: tenantId }];
```

### Super Admin Access Patterns

1. **View All Organizations**
   - Query: `getOrgsByTenant(tenantId)` - Can query across all tenants (requires special handling)
   - Access: All organizations

2. **Create Products**
   - Service: `createProductRecord(productData)`
   - Tenant: Global tenant or specific tenant

3. **Manage Clients**
   - Can create, update, and view client organizations
   - Service: `createOrg()`, `updateOrg()`, `getOrgsByTenant()`

### Client Admin Access Patterns

1. **Purchase Licenses**
   - Service: `createLicenseRecord(licenseData, actorUserId)`
   - Tenant: Organization's tenant ID
   - Creates license with `ownerOrgId` set to their organization

2. **Create Invites**
   - Service: `createInvitation(inviteData, actorUserId)`
   - Tenant: Organization's tenant ID
   - Role: `"user"` (regular users) or `"clientAdmin"` (additional admins)
   - Generates unique token for invite link

3. **Assign Licenses to Users**
   - Service: `assignLicenseToUser(licenseId, tenantId, userId, actorUserId)`
   - Validates: License has available seats, user exists, license is active
   - Updates: `assignedUserIds` array on license

4. **View Organization Users**
   - Service: `getUsersByTenant(tenantId, null, organizationId)`
   - Filters by organization ID

5. **View Organization Licenses**
   - Service: `getLicensesByTenant(tenantId, ownerOrgId)`
   - Shows all licenses owned by their organization

### User Access Patterns

1. **Accept Invitation**
   - Service: `acceptInvitation(token, tenantId, userData)`
   - Flow:
     a. Validates invitation token
     b. Checks if invite is expired
     c. Creates user account with role from invite
     d. Marks invite as accepted
     e. Logs audit event

2. **View Assigned Licenses**
   - Service: `getLicensesByUser(userId, tenantId)`
   - Returns all licenses where user is in `assignedUserIds` array

3. **View Products for Licenses**
   - Service: `getProductById(productId, tenantId)` for each license
   - Shows products user has access to

## Invitation Flow

### Creating an Invitation

1. Client admin calls `createInvitation(inviteData, actorUserId)`
2. System generates unique token
3. Invite document created with:
   - `status: "pending"`
   - `token: "inv_<timestamp>_<uuid>"`
   - `expiresAt: 7 days from now` (default)
4. Email sent to user with invite link containing token

### Accepting an Invitation

1. User clicks invite link (contains token)
2. System validates token via `getInviteByToken(token, tenantId)`
3. Checks:
   - Invite exists
   - Status is "pending"
   - Not expired
   - User doesn't already exist
4. Creates user account with:
   - Role from invite
   - Status: "active"
   - Organization ID from invite
5. Marks invite as accepted
6. Redirects to user dashboard

## License Management Flow

### Purchasing a License

1. Client admin selects product
2. Specifies number of seats
3. Calls `createLicenseRecord(licenseData, actorUserId)`
4. License created with:
   - `seats: <number>`
   - `assignedUserIds: []`
   - `ownerOrgId: <organizationId>`
   - `status: "active"`

### Assigning License to User

1. Client admin selects license and user
2. Calls `assignLicenseToUser(licenseId, tenantId, userId, actorUserId)`
3. System validates:
   - License exists and is active
   - License not expired
   - Has available seats
   - User not already assigned
4. Updates license: adds userId to `assignedUserIds`
5. Logs audit event

### Revoking License from User

1. Client admin selects license and user
2. Calls `revokeLicenseFromUser(licenseId, tenantId, userId, actorUserId)`
3. System validates user is assigned
4. Updates license: removes userId from `assignedUserIds`
5. Logs audit event

## Query Examples

### Get all users in an organization
```javascript
const users = await getUsersByTenant(tenantId, null, organizationId);
```

### Get all pending invites for an organization
```javascript
const invites = await getInvitesByTenant(tenantId, "pending");
```

### Get all active licenses for an organization
```javascript
const licenses = await getLicensesByTenant(tenantId, ownerOrgId);
```

### Get all products a user has access to
```javascript
const licenses = await getLicensesByUser(userId, tenantId);
const productIds = licenses.map(l => l.productId);
const products = await Promise.all(
  productIds.map(id => getProductById(id, tenantId))
);
```

## Audit Trail

All significant actions are logged to `auditEvents` container:
- Organization creation/updates
- User creation/updates
- Invite creation/acceptance
- License purchase/assignment/revocation

Each audit event includes:
- `tenantId`: For tenant isolation
- `type`: Event type (from `AUDIT_EVENT_TYPES`)
- `actorUserId`: User who performed the action
- `details`: Additional context
- `createdAt`: Timestamp

## Security Considerations

1. **Tenant Isolation**: All queries must include `tenantId` filter
2. **Role Validation**: Services should validate user roles before allowing actions
3. **Invite Expiration**: Invites expire after 7 days (configurable)
4. **License Seats**: Cannot assign more users than available seats
5. **Token Security**: Invite tokens are unique and time-based

## Future Enhancements

- Entra ID role-based authentication integration
- Role-based middleware for route protection
- Advanced querying for super admin (cross-tenant)
- License expiration handling
- Bulk operations for license assignment
