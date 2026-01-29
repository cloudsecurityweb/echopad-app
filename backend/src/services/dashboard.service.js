import { getContainer } from "../config/cosmosClient.js";
import createDashboardMetrics from "../models/dashboardMetrics.model.js";

export async function getDashboardMetrics(tenantId, role) {
  const container = getContainer("dashboardMetrics");

  const query = {
    query: `
      SELECT * FROM c
      WHERE c.tenantId = @tenantId AND c.role = @role
    `,
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@role", value: role }
    ]
  };

  const { resources } = await container.items.query(query).fetchAll();
  return resources[0] || null;
}

export async function upsertDashboardMetrics(payload) {
  const container = getContainer("dashboardMetrics");
  const item = createDashboardMetrics(payload);
  const { resource } = await container.items.upsert(item);
  return resource;
}


export async function updateDashboardMetric(tenantId, role, updater) {
  const container = getContainer("dashboardMetrics");

  const query = {
    query: `
      SELECT * FROM c
      WHERE c.tenantId = @tenantId AND c.role = @role
    `,
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@role", value: role }
    ]
  };

  const { resources } = await container.items.query(query).fetchAll();
  const metric = resources[0] || {
    id: `dashboard_${role}_${tenantId}`,
    tenantId,
    role,
    metricScope: role === "SUPER_ADMIN" ? "GLOBAL" : "CLIENT",
    metricName: `${role}_DASHBOARD`,
    data: {}
  };

  updater(metric.data);

  metric.updatedAt = new Date().toISOString();
  await container.items.upsert(metric, {
    partitionKey: tenantId
  });
}
