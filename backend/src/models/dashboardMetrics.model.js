/**
 * Dashboard Metrics Model – Cosmos DB
 * Container: dashboardMetrics
 * Partition Key: /tenantId
 */

export default function createDashboardMetrics({
  tenantId,
  role,
  metricScope,
  metricName,
  data
}) {
  if (!tenantId) throw new Error("tenantId is required");
  if (!role) throw new Error("role is required");

  return {
    id: `dashboard_${role.toLowerCase()}_${metricScope.toLowerCase()}_${tenantId}`,
    tenantId,

    role,                 // SUPER_ADMIN | CLIENT_ADMIN | USER
    metricScope,          // GLOBAL | CLIENT | USER
    metricName,           // descriptive identifier

    data: data || {},

    updatedAt: new Date().toISOString(),
    entityType: "dashboardMetrics"
  };
}
