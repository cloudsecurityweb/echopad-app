import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import { createAnalyticsEvent, validateAnalyticsEvent } from "../models/analyticsEvent.js";
import { getDashboardMetrics } from "./dashboard.service.js";

async function getContainerCount(containerName) {
  const container = getContainer(containerName);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { resources } = await container.items
    .query({ query: "SELECT VALUE COUNT(1) FROM c" })
    .fetchAll();

  return resources[0] || 0;
}

export async function getSuperAdminAnalytics() {
  const [dashboard, clients, feedback, helpDocs] = await Promise.all([
    getDashboardMetrics("system", "SUPER_ADMIN"),
    getContainerCount("clients"),
    getContainerCount("clientFeedback"),
    getContainerCount("helpCenterDocs"),
  ]);

  return {
    dashboard,
    totals: {
      clients,
      feedback,
      helpDocs,
    },
  };
}

export async function recordAnalyticsEvent(payload) {
  const container = getContainer("analyticsEvents");
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const data = {
    ...payload,
    id: payload.id || `evt_${randomUUID()}`,
  };

  const validation = validateAnalyticsEvent(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const event = createAnalyticsEvent(data);
  const { resource } = await container.items.create(event);
  return resource;
}

export async function getAnalyticsEvents(tenantId, filters = {}) {
  const container = getContainer("analyticsEvents");
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];

  if (filters.organizationId) {
    query += " AND c.organizationId = @organizationId";
    parameters.push({ name: "@organizationId", value: filters.organizationId });
  }

  if (filters.userId) {
    query += " AND c.userId = @userId";
    parameters.push({ name: "@userId", value: filters.userId });
  }

  if (filters.productId) {
    query += " AND c.productId = @productId";
    parameters.push({ name: "@productId", value: filters.productId });
  }

  if (filters.eventType) {
    query += " AND c.eventType = @eventType";
    parameters.push({ name: "@eventType", value: filters.eventType });
  }

  const { resources } = await container.items.query({
    query,
    parameters,
  }).fetchAll();

  return resources;
}

export async function getProductUsageSummary(tenantId, organizationId, productCode) {
  const container = getContainer("analyticsEvents");
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  // Fetch events for the specific organization and product
  const events = await getAnalyticsEvents(tenantId, {
    organizationId,
    productId: productCode, // productId corresponds to productCode
  });

  if (!events || events.length === 0) {
    return {
      totalEvents: 0,
      uniqueUsers: 0,
      eventsByType: {},
    };
  }

  const summary = {
    totalEvents: events.length,
    uniqueUsers: new Set(),
    eventsByType: {},
  };

  for (const event of events) {
    summary.uniqueUsers.add(event.userId);
    summary.eventsByType[event.eventType] = (summary.eventsByType[event.eventType] || 0) + 1;
  }

  summary.uniqueUsers = summary.uniqueUsers.size;

  return summary;
}

export async function getOrgAnalyticsSummary(tenantId, organizationId) {
  const events = await getAnalyticsEvents(tenantId, { organizationId });

  if (!events || events.length === 0) {
    return {
      totalEvents: 0,
      uniqueUsers: 0,
      eventsByType: {},
      eventsByProduct: {},
    };
  }

  const summary = {
    totalEvents: events.length,
    uniqueUsers: new Set(),
    eventsByType: {},
    eventsByProduct: {},
  };

  for (const event of events) {
    summary.uniqueUsers.add(event.userId);

    summary.eventsByType[event.eventType] = (summary.eventsByType[event.eventType] || 0) + 1;

    if (event.productId) {
      summary.eventsByProduct[event.productId] = (summary.eventsByProduct[event.productId] || 0) + 1;
    }
  }

  summary.uniqueUsers = summary.uniqueUsers.size;

  return summary;
}