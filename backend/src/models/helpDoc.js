/**
 * Help Center Doc Model Schema
 * 
 * Represents help center documentation articles
 */

export const HELP_DOC_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

/**
 * Create a new help doc document
 * @param {Object} data - Help doc data
 * @param {string} data.id - Unique doc ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.title - Doc title
 * @param {string} data.category - Doc category
 * @param {string} [data.status="draft"] - Doc status
 * @param {string} [data.summary] - Short summary
 * @param {string} [data.content] - Full content
 * @param {string[]} [data.tags=[]] - Tags for search
 * @param {string} [data.createdBy] - User ID
 * @param {string} [data.updatedBy] - User ID
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Help doc document
 */
export function createHelpDoc(data) {
  const now = new Date();

  return {
    id: data.id,
    tenantId: data.tenantId,

    title: data.title,
    category: data.category,
    status: data.status || HELP_DOC_STATUS.DRAFT,

    summary: data.summary || null,
    content: data.content || "",
    tags: Array.isArray(data.tags) ? data.tags : [],

    createdBy: data.createdBy || null,
    updatedBy: data.updatedBy || null,

    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Validate help doc data
 * @param {Object} data - Help doc data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateHelpDoc(data) {
  const errors = [];

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.title) errors.push("title is required");
  if (!data.category) errors.push("category is required");
  if (data.status && !Object.values(HELP_DOC_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(HELP_DOC_STATUS).join(", ")}`);
  }
  if (data.tags && !Array.isArray(data.tags)) {
    errors.push("tags must be an array");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
