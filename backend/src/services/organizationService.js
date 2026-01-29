/**
 * Organization Service
 * 
 * Handles organization data access with tenant isolation
 */

import { getContainer } from "../config/cosmosClient.js";
import { createOrganization, validateOrganization, ORG_TYPES, ORG_STATUS } from "../models/organization.js";
import { createAuditEvent, AUDIT_EVENT_TYPES } from "../models/auditEvent.js";
import { getContainer as getAuditContainer } from "../config/cosmosClient.js";
import { warmupNow } from "./cosmosWarmup.js";

const CONTAINER_NAME = "organizations";
const AUDIT_CONTAINER_NAME = "auditEvents";

/**
 * Retry a Cosmos DB operation with exponential backoff
 * @param {Function} operation - Async function to retry
 * @param {number} maxRetries - Maximum number of retries (default: 3)
 * @param {number} initialDelay - Initial delay in ms (default: 1000)
 * @returns {Promise} Result of the operation
 */
async function retryOperation(operation, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      // Don't retry on non-retryable errors
      if (error.code === 409 || error.code === 404 || (error.code && !error.code.includes('Timeout'))) {
        throw error;
      }
      
      if (attempt < maxRetries) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`  Retrying operation (attempt ${attempt + 1}/${maxRetries}) after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

/**
 * Create a new organization
 * @param {Object} orgData - Organization data
 * @param {string} actorUserId - User ID creating the organization
 * @returns {Promise<Object>} Created organization
 */
export async function createOrg(orgData, actorUserId) {
  const validation = validateOrganization(orgData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  
  const org = createOrganization(orgData);
  const container = getContainer(CONTAINER_NAME);
  
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  // Warmup Cosmos DB connection before operation to reduce cold start delays
  await warmupNow().catch(() => {
    // Ignore warmup errors - it's best effort
  });
  
  // Retry create operation with exponential backoff to handle timeouts and cold starts
  // Cosmos DB serverless can take 30-60 seconds to wake up from idle state
  const startTime = Date.now();
  let createResult;
  try {
    createResult = await retryOperation(
      async () => {
        console.log(`🔄 Creating organization: ${org.name} (tenant: ${org.tenantId})`);
        const result = await container.items.create(org);
        const duration = Date.now() - startTime;
        if (duration > 5000) {
          console.warn(`  Slow Cosmos DB operation: ${duration}ms (likely cold start)`);
        }
        return result;
      },
      3, // max retries
      3000 // initial delay 3 seconds (longer for cold starts)
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(` Failed to create organization after ${duration}ms:`, error.message);
    if (error.code === 'TimeoutError') {
      throw new Error(`Cosmos DB timeout after ${duration}ms. This may be due to serverless cold start. Please try again.`);
    }
    throw error;
  }
  
  const { resource } = createResult;
  
  // Log audit event
  try {
    const auditContainer = getAuditContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId: org.tenantId,
        type: AUDIT_EVENT_TYPES.ORGANIZATION_CREATED,
        actorUserId,
        details: { organizationId: org.id, organizationName: org.name },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}

/**
 * Get organization by ID (tenant-scoped)
 * @param {string} orgId - Organization ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object|null>} Organization or null if not found
 */
export async function getOrgById(orgId, tenantId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  try {
    const { resource } = await container.item(orgId, tenantId).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get all organizations for a tenant
 * @param {string} tenantId - Tenant ID
 * @param {string} [type] - Optional filter by organization type
 * @returns {Promise<Array>} Array of organizations
 */
export async function getOrgsByTenant(tenantId, type = null) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];
  
  if (type) {
    query += " AND c.type = @type";
    parameters.push({ name: "@type", value: type });
  }
  
  const { resources } = await container.items.query({
    query,
    parameters,
  }).fetchAll();
  
  return resources;
}

/**
 * Update organization
 * @param {string} orgId - Organization ID
 * @param {string} tenantId - Tenant ID
 * @param {Object} updates - Fields to update
 * @param {string} actorUserId - User ID performing the update
 * @returns {Promise<Object>} Updated organization
 */
export async function updateOrg(orgId, tenantId, updates, actorUserId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource: org } = await container.item(orgId, tenantId).read();
  if (!org) {
    throw new Error("Organization not found");
  }
  
  const updated = {
    ...org,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const { resource } = await container.item(orgId, tenantId).replace(updated);
  
  // Log audit event
  try {
    const auditContainer = getAuditContainer(AUDIT_CONTAINER_NAME);
    if (auditContainer) {
      const auditEvent = createAuditEvent({
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        tenantId,
        type: AUDIT_EVENT_TYPES.ORGANIZATION_UPDATED,
        actorUserId,
        details: { organizationId: orgId, updates },
      });
      await auditContainer.items.create(auditEvent);
    }
  } catch (auditError) {
    console.warn("Failed to create audit event:", auditError);
  }
  
  return resource;
}
