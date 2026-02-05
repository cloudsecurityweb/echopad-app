/**
 * User Service
 * 
 * Handles user data access with tenant isolation and role-based access
 */

import { getContainer } from "../config/cosmosClient.js";
import { createUser, validateUser, USER_ROLES, USER_STATUS, getContainerNameByRole } from "../models/user.js";
import { createAuditEvent, AUDIT_EVENT_TYPES } from "../models/auditEvent.js";
import { updateOrg } from "./organizationService.js";

const AUDIT_CONTAINER_NAME = "auditEvents";

function normalizeRole(role) {
  if (!role) return null;
  if (Object.values(USER_ROLES).includes(role)) return role;

  const upper = String(role).toUpperCase();
  if (upper === "SUPER_ADMIN") return USER_ROLES.SUPER_ADMIN;
  if (upper === "CLIENT_ADMIN") return USER_ROLES.CLIENT_ADMIN;
  if (upper === "USER") return USER_ROLES.USER;

  if (role === "super_admin") return USER_ROLES.SUPER_ADMIN;
  if (role === "client_admin") return USER_ROLES.CLIENT_ADMIN;
  if (role === "user") return USER_ROLES.USER;

  return null;
}

function normalizeStatus(status) {
  if (!status) return null;
  if (Object.values(USER_STATUS).includes(status)) return status;

  const upper = String(status).toUpperCase();
  if (upper === "ACTIVE") return USER_STATUS.ACTIVE;
  if (upper === "INACTIVE") return USER_STATUS.INACTIVE;
  if (upper === "PENDING") return USER_STATUS.PENDING;
  if (upper === "SUSPENDED") return USER_STATUS.SUSPENDED;

  return null;
}

/**
 * Get container for a specific role
 * @param {string} role - User role (superAdmin|clientAdmin|user)
 * @returns {Container} Cosmos DB container
 */
function getContainerByRole(role) {
  const containerName = getContainerNameByRole(role);
  const container = getContainer(containerName);
  if (!container) {
    throw new Error(`Cosmos DB container '${containerName}' not available`);
  }
  return container;
}

/**
 * Create a new user
 * @param {Object} userData - User data (must include role)
 * @param {string} actorUserId - User ID creating the user
 * @returns {Promise<Object>} Created user
 */
export async function createUserRecord(userData, actorUserId) {
  const validation = validateUser(userData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  
  if (!userData.role) {
    throw new Error("Role is required to determine container");
  }
  
  const user = createUser(userData);
  const container = getContainerByRole(userData.role);
  
  const { resource } = await container.items.create(user);
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: user.tenantId,
        type: AUDIT_EVENT_TYPES.USER_CREATED,
        actorUserId,
        details: { userId: user.id, email: user.email, role: user.role },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}

/**
 * Create a user if it doesn't exist (tenant-scoped, role-aware)
 * @param {Object} payload - User data
 * @returns {Promise<Object>} Existing or created user
 */
export async function createUserIfNotExists(payload) {
  const userId = payload.userId || payload.id;
  if (!userId) {
    throw new Error("userId is required");
  }

  if (!payload.tenantId) {
    throw new Error("tenantId is required");
  }

  const role = normalizeRole(payload.role) || USER_ROLES.USER;
  const container = getContainerByRole(role);

  try {
    const { resource } = await container.item(userId, payload.tenantId).read();
    return resource;
  } catch {
    const userData = {
      id: userId,
      tenantId: payload.tenantId,
      email: payload.email,
      displayName: payload.displayName,
      role,
      status: normalizeStatus(payload.status) || USER_STATUS.ACTIVE,
      organizationId: payload.organizationId || null,
    };

    const validation = validateUser(userData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
    }

    const user = createUser(userData);
    await container.items.create(user);
    return user;
  }
}

/**
 * Get user by ID (tenant-scoped, role-aware)
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @param {string} [role] - User role (superAdmin|clientAdmin|user)
 * @returns {Promise<Object|null>} User or null if not found
 */
export async function getUserById(userId, tenantId, role = null) {
  if (!role) {
    const rolesToCheck = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
    for (const roleToCheck of rolesToCheck) {
      try {
        const container = getContainerByRole(roleToCheck);
        const { resource } = await container.item(userId, tenantId).read();
        if (resource) {
          return resource;
        }
      } catch (error) {
        if (error.code !== 404) {
          console.warn(`Error searching ${roleToCheck} container:`, error.message);
        }
      }
    }
    return null;
  }

  const container = getContainerByRole(role);
  try {
    const { resource } = await container.item(userId, tenantId).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get user by email (tenant-scoped and role-specific)
 * @param {string} email - User email
 * @param {string} tenantId - Tenant ID
 * @param {string} role - User role (superAdmin|clientAdmin|user)
 * @returns {Promise<Object|null>} User or null if not found
 */
export async function getUserByEmail(email, tenantId, role) {
  if (!role) {
    throw new Error("Role is required to determine container");
  }
  
  const container = getContainerByRole(role);
  
  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.email = @email",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@email", value: email.toLowerCase().trim() },
    ],
  }).fetchAll();
  
  return resources.length > 0 ? resources[0] : null;
}

/**
 * Get user by OID across all role containers (OID-first lookup)
 * This is the primary method for user lookup - OID is the unique identifier
 * @param {string} oid - User's Object ID (from Entra ID token)
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object|null>} User record with role or null if not found
 */
export async function getUserByOIDAnyRole(oid, tenantId) {
  if (!oid || !tenantId) {
    return null;
  }
  
  const rolesToCheck = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
  
  // Search across all role containers using OID (direct item read - most efficient)
  for (const role of rolesToCheck) {
    try {
      const container = getContainerByRole(role);
      // Cosmos DB uses OID as the id field, tenantId as partition key
      const { resource } = await container.item(oid, tenantId).read();
      if (resource) {
        console.log(`✅ [OID-LOOKUP] Found user with OID ${oid.substring(0, 8)}... in ${role} container`);
        return resource; // Found user with role
      }
    } catch (error) {
      if (error.code !== 404) {
        // Only log non-404 errors (404 is expected when user not in that container)
        console.warn(`⚠️ [OID-LOOKUP] Error searching ${role} container for OID ${oid.substring(0, 8)}...:`, error.message);
      }
      // Continue to next container
    }
  }
  
  console.log(`⚠️ [OID-LOOKUP] User with OID ${oid.substring(0, 8)}... not found in any container`);
  return null; // User not found in any container
}

/**
 * Get user by email across all role containers (fallback when role is unknown)
 * @param {string} email - User email
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object|null>} User or null if not found
 */
export async function getUserByEmailAnyRole(email, tenantId) {
  const normalizedEmail = email.toLowerCase().trim();
  const roles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
  
  // Search across all role containers
  for (const role of roles) {
    try {
      const container = getContainerByRole(role);
      const { resources } = await container.items.query({
        query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.email = @email",
        parameters: [
          { name: "@tenantId", value: tenantId },
          { name: "@email", value: normalizedEmail },
        ],
      }).fetchAll();
      
      if (resources.length > 0) {
        return resources[0];
      }
    } catch (error) {
      // Continue searching other containers
      console.warn(`Error searching ${role} container:`, error.message);
    }
  }
  
  return null;
}

/**
 * Get all users for a tenant
 * @param {string} tenantId - Tenant ID
 * @param {string} [role] - Optional filter by role. If null, queries all role containers
 * @param {string} [organizationId] - Optional filter by organization ID
 * @returns {Promise<Array>} Array of users
 */
export async function getUsersByTenant(tenantId, role = null, organizationId = null) {
  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];
  
  if (organizationId) {
    query += " AND c.organizationId = @organizationId";
    parameters.push({ name: "@organizationId", value: organizationId });
  }
  
  // If role is specified, query only that container
  if (role) {
    const container = getContainerByRole(role);
    const { resources } = await container.items.query({
      query,
      parameters,
    }).fetchAll();
    return resources;
  }
  
  // If role is not specified, query all role containers and combine results
  const allUsers = [];
  const roles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];
  
  for (const roleToQuery of roles) {
    try {
      const container = getContainerByRole(roleToQuery);
      const { resources } = await container.items.query({
        query,
        parameters,
      }).fetchAll();
      allUsers.push(...resources);
    } catch (error) {
      console.warn(`Error querying ${roleToQuery} container:`, error.message);
    }
  }
  
  return allUsers;
}

/**
 * Update user
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @param {Object} updates - Fields to update
 * @param {string} actorUserId - User ID performing the update
 * @param {string} role - User role (superAdmin|clientAdmin|user)
 * @returns {Promise<Object>} Updated user
 */
export async function updateUser(userId, tenantId, updates, actorUserId, role) {
  if (!role) {
    throw new Error("Role is required to determine container");
  }
  
  const container = getContainerByRole(role);
  
  const { resource: user } = await container.item(userId, tenantId).read();
  if (!user) {
    throw new Error("User not found");
  }
  
  const updated = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const { resource } = await container.item(userId, tenantId).replace(updated);
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        type: AUDIT_EVENT_TYPES.USER_UPDATED,
        actorUserId,
        details: { userId, updates },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}

/**
 * Update user status (tenant-scoped)
 * @param {string} tenantId
 * @param {string} userId
 * @param {string} status
 * @returns {Promise<Object>} Updated user
 */
export async function updateUserStatus(tenantId, userId, status, role = null) {
  const normalizedStatus = normalizeStatus(status);
  if (!normalizedStatus) {
    throw new Error("Invalid status");
  }

  const rolesToCheck = role
    ? [role]
    : [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLIENT_ADMIN, USER_ROLES.USER];

  for (const roleToCheck of rolesToCheck) {
    try {
      const container = getContainerByRole(roleToCheck);
      const { resource } = await container.item(userId, tenantId).read();
      if (!resource) {
        continue;
      }

      resource.status = normalizedStatus;
      resource.updatedAt = new Date().toISOString();

      await container.items.upsert(resource);
      return resource;
    } catch (error) {
      if (error.code !== 404) {
        throw error;
      }
    }
  }

  throw new Error("User not found");
}

/**
 * Update user role - moves user between containers if role changes
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @param {string} oldRole - Current role
 * @param {string} newRole - New role
 * @param {string} actorUserId - User ID performing the update
 * @returns {Promise<Object>} Updated user
 */
export async function updateUserRole(userId, tenantId, oldRole, newRole, actorUserId) {
  if (oldRole === newRole) {
    // No role change, just update normally
    return updateUser(userId, tenantId, { role: newRole }, actorUserId, oldRole);
  }

  // Role changed - need to move user between containers
  const oldContainer = getContainerByRole(oldRole);
  const newContainer = getContainerByRole(newRole);

  // Read user from old container
  const { resource: user } = await oldContainer.item(userId, tenantId).read();
  if (!user) {
    throw new Error("User not found in old container");
  }

  // Update user with new role
  const updatedUser = {
    ...user,
    role: newRole,
    updatedAt: new Date().toISOString(),
  };

  // Create user in new container
  const { resource: newUser } = await newContainer.items.create(updatedUser);

  // Delete user from old container
  try {
    await oldContainer.item(userId, tenantId).delete();
  } catch (deleteError) {
    console.warn("Failed to delete user from old container:", deleteError.message);
    // Continue even if delete fails - user is now in new container
  }

  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        type: AUDIT_EVENT_TYPES.USER_UPDATED,
        actorUserId,
        details: { userId, oldRole, newRole, action: 'role_change' },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }

  return newUser;
}

export async function updateUserProfile(userId, tenantId, actorUserId, profileData) {
  const { displayName, organizationName, companyUrl } = profileData;

  const user = await getUserById(userId, tenantId);
  if (!user) {
    throw new Error("User not found");
  }

  if (displayName) {
    await updateUser(userId, tenantId, { displayName }, actorUserId, user.role);
  }

  if (organizationName || companyUrl) {
    if (!user.organizationId) {
      throw new Error("User is not associated with an organization");
    }
    const orgUpdates = {};
    if (organizationName) {
      orgUpdates.name = organizationName;
    }
    if (companyUrl) {
      orgUpdates.company_url = companyUrl;
    }
    await updateOrg(user.organizationId, tenantId, orgUpdates, actorUserId);
  }

  return getUserById(userId, tenantId);
}
