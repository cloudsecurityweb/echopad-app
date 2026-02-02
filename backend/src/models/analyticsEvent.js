/**
 * Analytics Event Model
 *
 * Stores product usage events for analytics.
 */

export const ANALYTICS_EVENT_TYPES = {
  LOGIN: "LOGIN",
  FEATURE_USED: "FEATURE_USED",
  EXPORT: "EXPORT",
};

export function createAnalyticsEvent(data) {
  return {
    id: data.id,
    tenantId: data.tenantId,
    organizationId: data.organizationId,
    userId: data.userId,
    productId: data.productId,
    eventType: data.eventType,
    metadata: data.metadata || {},
    timestamp: data.timestamp || new Date().toISOString(),
    entityType: "analyticsEvent",
  };
}

export function validateAnalyticsEvent(data) {
  const errors = [];

  if (!data.id) errors.push("id is required");
  if (!data.tenantId) errors.push("tenantId is required");
  if (!data.organizationId) errors.push("organizationId is required");
  if (!data.userId) errors.push("userId is required");
  if (!data.productId) errors.push("productId is required");
  if (!data.eventType) errors.push("eventType is required");
  if (data.metadata && typeof data.metadata !== "object") {
    errors.push("metadata must be an object");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
