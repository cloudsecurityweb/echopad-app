/**
 * License Service
 * 
 * Handles license data access, assignment, and management with tenant isolation
 */

import { getContainer } from "../config/cosmosClient.js";
import { createLicense, validateLicense, hasAvailableSeats, isLicenseExpired, LICENSE_STATUS } from "../models/license.js";
import { createAuditEvent, AUDIT_EVENT_TYPES } from "../models/auditEvent.js";

const CONTAINER_NAME = "licenses";
const AUDIT_CONTAINER_NAME = "auditEvents";

/**
 * Create a new license (purchase)
 * @param {Object} licenseData - License data
 * @param {string} actorUserId - User ID purchasing the license
 * @returns {Promise<Object>} Created license
 */
export async function createLicenseRecord(licenseData, actorUserId) {
  const validation = validateLicense(licenseData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  
  const license = createLicense(licenseData);
  const container = getContainer(CONTAINER_NAME);
  
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource } = await container.items.create(license);
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: license.tenantId,
        type: AUDIT_EVENT_TYPES.LICENSE_PURCHASED,
        actorUserId,
        details: { 
          licenseId: license.id, 
          productId: license.productId, 
          ownerOrgId: license.ownerOrgId,
          seats: license.seats,
        },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}

/**
 * Get license by ID (tenant-scoped)
 * @param {string} licenseId - License ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object|null>} License or null if not found
 */
export async function getLicenseById(licenseId, tenantId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  try {
    const { resource } = await container.item(licenseId, tenantId).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get all licenses for a tenant
 * @param {string} tenantId - Tenant ID
 * @param {string} [ownerOrgId] - Optional filter by owner organization ID
 * @param {string} [productId] - Optional filter by product ID
 * @returns {Promise<Array>} Array of licenses
 */
export async function getLicensesByTenant(tenantId, ownerOrgId = null, productId = null) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];
  
  if (ownerOrgId) {
    query += " AND c.ownerOrgId = @ownerOrgId";
    parameters.push({ name: "@ownerOrgId", value: ownerOrgId });
  }
  
  if (productId) {
    query += " AND c.productId = @productId";
    parameters.push({ name: "@productId", value: productId });
  }
  
  const { resources } = await container.items.query({
    query,
    parameters,
  }).fetchAll();
  
  return resources;
}

/**
 * Get licenses assigned to a user
 * @param {string} userId - User ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Array>} Array of licenses
 */
export async function getLicensesByUser(userId, tenantId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND ARRAY_CONTAINS(c.assignedUserIds, @userId)",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@userId", value: userId },
    ],
  }).fetchAll();
  
  return resources;
}

/**
 * Assign a license to a user
 * @param {string} licenseId - License ID
 * @param {string} tenantId - Tenant ID
 * @param {string} userId - User ID to assign
 * @param {string} actorUserId - User ID performing the assignment
 * @returns {Promise<Object>} Updated license
 */
export async function assignLicenseToUser(licenseId, tenantId, userId, actorUserId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource: license } = await container.item(licenseId, tenantId).read();
  if (!license) {
    throw new Error("License not found");
  }
  
  if (license.status !== LICENSE_STATUS.ACTIVE) {
    throw new Error(`License is ${license.status}`);
  }
  
  if (isLicenseExpired(license)) {
    throw new Error("License has expired");
  }
  
  if (!hasAvailableSeats(license)) {
    throw new Error("No available seats on this license");
  }
  
  if (license.assignedUserIds.includes(userId)) {
    throw new Error("User is already assigned to this license");
  }
  
  const updated = {
    ...license,
    assignedUserIds: [...license.assignedUserIds, userId],
    updatedAt: new Date().toISOString(),
  };
  
  const { resource } = await container.item(licenseId, tenantId).replace(updated);
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        type: AUDIT_EVENT_TYPES.LICENSE_ASSIGNED,
        actorUserId,
        details: { licenseId, userId, productId: license.productId },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}

/**
 * Revoke a license from a user
 * @param {string} licenseId - License ID
 * @param {string} tenantId - Tenant ID
 * @param {string} userId - User ID to revoke from
 * @param {string} actorUserId - User ID performing the revocation
 * @returns {Promise<Object>} Updated license
 */
export async function revokeLicenseFromUser(licenseId, tenantId, userId, actorUserId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource: license } = await container.item(licenseId, tenantId).read();
  if (!license) {
    throw new Error("License not found");
  }
  
  if (!license.assignedUserIds.includes(userId)) {
    throw new Error("User is not assigned to this license");
  }
  
  const updated = {
    ...license,
    assignedUserIds: license.assignedUserIds.filter(id => id !== userId),
    updatedAt: new Date().toISOString(),
  };
  
  const { resource } = await container.item(licenseId, tenantId).replace(updated);
  
  // Log audit event
  try {
    const auditContainer = getContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        type: AUDIT_EVENT_TYPES.LICENSE_REVOKED,
        actorUserId,
        details: { licenseId, userId, productId: license.productId },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}
