/**
 * Product Model Schema
 * 
 * Represents a product in the catalog
 */

/**
 * Product statuses
 */
export const PRODUCT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ARCHIVED: "archived",
};

/**
 * Create a new product document
 * @param {Object} data - Product data
 * @param {string} data.id - Unique product ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.name - Product name
 * @param {string} data.sku - Product SKU
 * @param {string} [data.status="active"] - Product status
 * @param {string} [data.description] - Product description
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Product document
 */
export function createProduct(data) {
  const now = new Date();
  
  return {
    id: data.id,
    tenantId: data.tenantId,
    name: data.name,
    sku: data.sku,
    status: data.status || PRODUCT_STATUS.ACTIVE,
    description: data.description || null,
    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Validate product data
 * @param {Object} data - Product data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateProduct(data) {
  const errors = [];
  
  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.name) errors.push("name is required");
  if (!data.sku) errors.push("sku is required");
  if (data.status && !Object.values(PRODUCT_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(PRODUCT_STATUS).join(", ")}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
