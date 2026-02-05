import { getContainer } from "../config/cosmosClient.js";
import createLicenseAssignment from "../models/licenseAssignment.model.js";
import { ApiError } from "../utils/apiError.js";
import { updateDashboardMetric } from "./dashboard.service.js";
import { createUserIfNotExists } from "./userService.js";

export async function sendInvite(payload) {
  const container = getContainer("licenseAssignments");
  const item = createLicenseAssignment(payload);
  await container.items.create(item);

  // CLIENT ADMIN METRICS
  await updateDashboardMetric(
    payload.tenantId,
    "CLIENT_ADMIN",
    (data) => {
      data.invitesSent = (data.invitesSent || 0) + 1;
      data.availableLicenses = (data.availableLicenses || 0) - 1;
    }
  );

  // SUPER ADMIN METRICS
  await updateDashboardMetric(
    "system",
    "SUPER_ADMIN",
    (data) => {
      data.totalInvitesSent = (data.totalInvitesSent || 0) + 1;
    }
  );

  return item;
}

export async function activateLicense(id, tenantId, user) {
  if (!tenantId) {
    throw new ApiError(400, "tenantId is required");
  }

  if (!user?.userId || !user?.email) {
    throw new ApiError(400, "user context is required");
  }

  console.log("Activating license for:", id, tenantId, user);

  const container = getContainer("licenseAssignments");
  const { resource } = await container.item(id, tenantId).read();

  if (!resource) {
    throw new ApiError(404, "License assignment not found");
  }

  if (resource.status === "ACTIVE") {
    return resource; // idempotent safety
  }

  // Ensure user profile exists
  await createUserIfNotExists({
    tenantId,
    userId: user.userId,
    email: user.email,
    role: "USER"
  });

  // Activate assignment
  resource.userId = user.userId;
  resource.status = "ACTIVE";
  resource.activatedAt = new Date().toISOString();

  await container.items.upsert(resource);

  // CLIENT ADMIN METRICS
  await updateDashboardMetric(
    tenantId,
    "CLIENT_ADMIN",
    (data) => {
      data.licensesInUse = (data.licensesInUse || 0) + 1;
      data.invitesSent = Math.max(0, (data.invitesSent || 0) - 1);
    }
  );

  // SUPER ADMIN METRICS
  await updateDashboardMetric(
    "system",
    "SUPER_ADMIN",
    (data) => {
      data.totalActiveUsers = (data.totalActiveUsers || 0) + 1;
    }
  );

  // USER METRICS (user-scoped!)
  await updateDashboardMetric(
    `${tenantId}:${user.userId}`,   // 🔑 unique per user
    "USER",
    (data) => {
      const products = new Set(data.activeProducts || []);
      products.add(resource.productCode);
      data.activeProducts = [...products];
    }
  );

  return resource;
}


export async function revokeLicense(id, tenantId) {
  const container = getContainer("licenseAssignments");
  const { resource } = await container.item(id, tenantId).read();

  resource.status = "REVOKED";
  resource.revokedAt = new Date().toISOString();

  await container.items.upsert(resource);

  // CLIENT ADMIN METRICS
  await updateDashboardMetric(
    tenantId,
    "CLIENT_ADMIN",
    (data) => {
      data.licensesInUse = Math.max(0, (data.licensesInUse || 0) - 1);
      data.availableLicenses = (data.availableLicenses || 0) + 1;
    }
  );

  // SUPER ADMIN METRICS
  await updateDashboardMetric(
    "system",
    "SUPER_ADMIN",
    (data) => {
      data.totalActiveUsers = Math.max(0, (data.totalActiveUsers || 0) - 1);
    }
  );

  await updateDashboardMetric(
    tenantId,
    "USER",
    (data) => {
      data.activeProducts = (data.activeProducts || [])
        .filter(p => p !== resource.productCode);
    }
  );

  return resource;
}

export async function getAssignmentsByTenant(tenantId) {
  const container = getContainer("licenseAssignments");

  const query = {
    query: `SELECT * FROM c WHERE c.tenantId = @tenantId`,
    parameters: [{ name: "@tenantId", value: tenantId }]
  };

  const { resources } = await container.items.query(query).fetchAll();
  return resources;
}

/**
 * Get license assignments for a specific user within a tenant.
 * Primarily used to power user dashboards with product access information.
 *
 * @param {string} tenantId
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getAssignmentsByUser(tenantId, userId) {
  const container = getContainer("licenseAssignments");

  const query = {
    query: `SELECT * FROM c WHERE c.tenantId = @tenantId AND c.userId = @userId`,
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@userId", value: userId },
    ],
  };

  const { resources } = await container.items.query(query).fetchAll();
  return resources;
}
