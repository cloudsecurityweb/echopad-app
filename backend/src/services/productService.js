/**
 * Product Service
 * 
 * Handles product data access with tenant isolation
 */

import { getContainer } from "../config/cosmosClient.js";
import { createProduct, validateProduct, PRODUCT_STATUS } from "../models/product.js";

const CONTAINER_NAME = "products";

/**
 * Create a new product
 * @param {Object} productData - Product data
 * @returns {Promise<Object>} Created product
 */
export async function createProductRecord(productData) {
  const validation = validateProduct(productData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }
  
  const product = createProduct(productData);
  const container = getContainer(CONTAINER_NAME);
  
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource } = await container.items.create(product);
  return resource;
}

/**
 * Get product by ID (tenant-scoped)
 * @param {string} productId - Product ID
 * @param {string} tenantId - Tenant ID
 * @returns {Promise<Object|null>} Product or null if not found
 */
export async function getProductById(productId, tenantId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  try {
    const { resource } = await container.item(productId, tenantId).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get all products for a tenant
 * @param {string} tenantId - Tenant ID
 * @param {string} [status] - Optional filter by status
 * @returns {Promise<Array>} Array of products
 */
export async function getProductsByTenant(tenantId, status = null) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];
  
  if (status) {
    query += " AND c.status = @status";
    parameters.push({ name: "@status", value: status });
  }
  
  const { resources } = await container.items.query({
    query,
    parameters,
  }).fetchAll();
  
  return resources;
}

/**
 * Update product
 * @param {string} productId - Product ID
 * @param {string} tenantId - Tenant ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated product
 */
export async function updateProduct(productId, tenantId, updates) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }
  
  const { resource: product } = await container.item(productId, tenantId).read();
  if (!product) {
    throw new Error("Product not found");
  }
  
  const updated = {
    ...product,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const { resource } = await container.item(productId, tenantId).replace(updated);
  return resource;
}
