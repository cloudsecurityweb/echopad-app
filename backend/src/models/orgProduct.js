/**
 * Organization Product Model
 *
 * Maps enabled products for a specific organization.
 */

export const ORG_PRODUCT_STATUS = {
  ENABLED: "enabled",
  DISABLED: "disabled",
};

export function createOrgProduct(data) {
  const now = new Date().toISOString();

  return {
    id: data.id,
    tenantId: data.tenantId,
    organizationId: data.organizationId,
    productId: data.productId,
    productSku: data.productSku,
    status: data.status || ORG_PRODUCT_STATUS.ENABLED,
    createdAt: data.createdAt || now,
    updatedAt: now,
    entityType: "orgProduct",
  };
}

export function validateOrgProduct(data) {
  const errors = [];

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.organizationId) errors.push("organizationId is required");
  if (!data.productId) errors.push("productId is required");
  if (!data.productSku) errors.push("productSku is required");
  if (data.status && !Object.values(ORG_PRODUCT_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(ORG_PRODUCT_STATUS).join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
