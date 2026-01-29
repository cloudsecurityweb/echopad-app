/**
 * Client Feedback Model Schema
 * 
 * Represents feedback submitted by clients
 */

export const FEEDBACK_STATUS = {
  NEW: "new",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
  ARCHIVED: "archived",
};

/**
 * Create a new feedback document
 * @param {Object} data - Feedback data
 * @param {string} data.id - Unique feedback ID
 * @param {string} data.tenantId - Tenant ID (partition key)
 * @param {string} data.clientName - Client name
 * @param {string} [data.clientId] - Client ID
 * @param {string} [data.productName] - Product name
 * @param {number} data.rating - Rating (1-5)
 * @param {string} data.category - Feedback category
 * @param {string} data.subject - Short subject
 * @param {string} data.message - Feedback message
 * @param {string} [data.status="new"] - Feedback status
 * @param {string} [data.response] - Response message
 * @param {string} [data.respondedBy] - Responder name/id
 * @param {Date} [data.respondedAt] - Response timestamp
 * @param {Date} [data.createdAt] - Creation timestamp
 * @returns {Object} Feedback document
 */
export function createClientFeedback(data) {
  const now = new Date();

  return {
    id: data.id,
    tenantId: data.tenantId,

    clientId: data.clientId || null,
    clientName: data.clientName,
    productName: data.productName || null,

    rating: data.rating,
    category: data.category,
    subject: data.subject,
    message: data.message,

    status: data.status || FEEDBACK_STATUS.NEW,
    response: data.response || null,
    respondedBy: data.respondedBy || null,
    respondedAt: data.respondedAt || null,

    createdAt: data.createdAt || now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

/**
 * Validate client feedback data
 * @param {Object} data - Feedback data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validateClientFeedback(data) {
  const errors = [];

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.clientName) errors.push("clientName is required");
  if (data.rating === undefined || data.rating === null) {
    errors.push("rating is required");
  } else if (typeof data.rating !== "number" || data.rating < 1 || data.rating > 5) {
    errors.push("rating must be a number between 1 and 5");
  }
  if (!data.category) errors.push("category is required");
  if (!data.subject) errors.push("subject is required");
  if (!data.message) errors.push("message is required");
  if (data.status && !Object.values(FEEDBACK_STATUS).includes(data.status)) {
    errors.push(`status must be one of: ${Object.values(FEEDBACK_STATUS).join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
