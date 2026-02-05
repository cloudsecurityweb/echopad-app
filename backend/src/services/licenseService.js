/**
 * License Service
 * 
 * Handles license data access, assignment, and management with tenant isolation
 */

import { getContainer } from "../config/cosmosClient.js";
import { createLicense, validateLicense, hasAvailableSeats, isLicenseExpired, LICENSE_STATUS } from "../models/license.js";
import { createAuditEvent, AUDIT_EVENT_TYPES } from "../models/auditEvent.js";
import { getProductById as getProductByIdService } from "./products.service.js";

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
    const querySpec = {
      query: `
    SELECT * FROM c
    WHERE c.id = @id AND c.tenantId = @tenantId
  `,
      parameters: [
        { name: "@id", value: licenseId },
        { name: "@tenantId", value: tenantId }
      ]
    };

    const { resources } = await container.items
      .query(querySpec)
      .fetchAll();

    return resources;
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
export async function getLicensesByTenant(tenantId, ownerOrgId = null, productId = null, status = null) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  let query = "SELECT * FROM c WHERE 1=1";
  const parameters = [];

  if (tenantId) {
    query += " AND c.tenantId = @tenantId";
    parameters.push({ name: "@tenantId", value: tenantId });
  }

  if (ownerOrgId) {
    query += " AND c.ownerOrgId = @ownerOrgId";
    parameters.push({ name: "@ownerOrgId", value: ownerOrgId });
  }

  if (productId) {
    query += " AND c.productId = @productId";
    parameters.push({ name: "@productId", value: productId });
  }

  if (status) {
    query += " AND c.status = @status";
    parameters.push({ name: "@status", value: status });
  }

  const { resources: licenses } = await container.items.query({
    query,
    parameters,
  }).fetchAll();

  // Enrich with product names and organization details
  try {
    const { getProducts } = await import("./products.service.js"); // Dynamic import to avoid circular dependency
    const { getOrgById } = await import("./organizationService.js"); // Dynamic import

    const products = await getProducts();
    const productMap = new Map(products.map(p => [p.productCode, p.name]));

    // Cache organization details to avoid repeated fetches
    const orgCache = new Map();

    const enrichedLicenses = await Promise.all(licenses.map(async (license) => {
      const productName = productMap.get(license.productId) || license.productId;

      let orgDetails = {};
      if (license.ownerOrgId && license.tenantId) {
        const cacheKey = `${license.ownerOrgId}_${license.tenantId}`;

        if (orgCache.has(cacheKey)) {
          orgDetails = orgCache.get(cacheKey);
        } else {
          try {
            const org = await getOrgById(license.ownerOrgId, license.tenantId);
            if (org) {
              orgDetails = {
                organizationName: org.name,
                organizerName: org.organizer,
                organizerEmail: org.email
              };
            }
            orgCache.set(cacheKey, orgDetails);
          } catch (err) {
            console.warn(`Failed to fetch org details for ${license.ownerOrgId}:`, err);
            // Default to empty if failed
            orgCache.set(cacheKey, {});
          }
        }
      }

      return {
        ...license,
        productName,
        ...orgDetails
      };
    }));

    return enrichedLicenses;
  } catch (error) {
    console.warn("Failed to enrich licenses:", error);
    return licenses;
  }
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
 * Get product descriptors for all licenses assigned to a user.
 * This is used to drive the user-facing dashboard of products they can access.
 *
 * @param {string} userId
 * @param {string} tenantId
 * @returns {Promise<Array<{ id: string, name: string, status: string, subscriptionDate: string }>>}
 */
export async function getProductsForUser(userId, tenantId) {
  const licenses = await getLicensesByUser(userId, tenantId);
  if (!licenses || licenses.length === 0) {
    return [];
  }

  // Group licenses by productId so we can derive a single descriptor per product
  const licensesByProduct = new Map();
  for (const license of licenses) {
    if (!license.productId) continue;
    const existing = licensesByProduct.get(license.productId);
    if (!existing) {
      licensesByProduct.set(license.productId, [license]);
    } else {
      existing.push(license);
    }
  }

  const productIds = Array.from(licensesByProduct.keys());
  if (productIds.length === 0) {
    return [];
  }

  const products = await Promise.all(
    productIds.map((id) => getProductByIdService(id, tenantId).catch(() => null))
  );

  const result = [];
  for (let i = 0; i < productIds.length; i++) {
    const product = products[i];
    if (!product) continue;

    const relatedLicenses = licensesByProduct.get(product.id) || [];
    // Use the earliest license creation time as the subscription date when available
    const subscriptionDate = relatedLicenses
      .map((l) => l.createdAt)
      .filter(Boolean)
      .sort()[0] || new Date().toISOString();

    // If any license for this product is ACTIVE, treat the product as Active
    const isActive = relatedLicenses.some((l) => l.status === LICENSE_STATUS.ACTIVE);

    result.push({
      id: product.id,
      name: product.name,
      status: isActive ? "Active" : "Inactive",
      subscriptionDate,
    });
  }

  return result;
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

  console.log("243 in assign license to user", licenseId, tenantId, userId, actorUserId);

  const { resource: license } = await container.item(licenseId, tenantId).read();
  console.log("246 in assign license to user", license);
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

/**
 * Update license fields (tenant-scoped)
 * @param {string} licenseId
 * @param {string} tenantId
 * @param {Object} updates
 * @returns {Promise<Object>} Updated license
 */
export async function updateLicenseRecord(licenseId, tenantId, updates) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const querySpec = {
    query: `
    SELECT * FROM c
    WHERE c.id = @id AND c.tenantId = @tenantId
  `,
    parameters: [
      { name: "@id", value: licenseId },
      { name: "@tenantId", value: tenantId }
    ]
  };

  const { resources } = await container.items
    .query(querySpec)
    .fetchAll();

  const resource = resources[0] ?? null;

  if (!resource) {
    throw new Error("License not found");
  }

  // Remove system properties
  const { _rid, _self, _etag, _attachments, _ts, ...cleanResource } = resource;

  const updated = {
    ...cleanResource,
    ...updates,
    updatedAt: new Date().toISOString(),
  };


  const { resource: saved } = await container.items.upsert(updated);
  return saved;
}
