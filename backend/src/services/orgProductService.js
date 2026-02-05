/**
 * Organization Product Service
 *
 * Handles product enablement per organization (tenant-scoped).
 */

import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import { createOrgProduct, validateOrgProduct, ORG_PRODUCT_STATUS } from "../models/orgProduct.js";

const CONTAINER_NAME = "orgProducts";

export async function createOrgProductRecord(payload) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const data = {
    ...payload,
    id: payload.id || `orgprod_${randomUUID()}`,
  };

  const validation = validateOrgProduct(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const orgProduct = createOrgProduct(data);
  const { resource } = await container.items.create(orgProduct);
  return resource;
}

export async function getOrgProductsByOrganization(tenantId, organizationId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.organizationId = @organizationId",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@organizationId", value: organizationId },
    ],
  }).fetchAll();

  return resources;
}

export async function getOrgProductById(tenantId, orgProductId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  try {
    const { resource } = await container.item(orgProductId, tenantId).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function updateOrgProductStatus(tenantId, orgProductId, status) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  if (!Object.values(ORG_PRODUCT_STATUS).includes(status)) {
    throw new Error("Invalid status");
  }

  const { resource } = await container.item(orgProductId, tenantId).read();
  if (!resource) {
    throw new Error("Organization product mapping not found");
  }

  const updated = {
    ...resource,
    status,
    updatedAt: new Date().toISOString(),
  };

  const { resource: saved } = await container.item(orgProductId, tenantId).replace(updated);
  return saved;
}
