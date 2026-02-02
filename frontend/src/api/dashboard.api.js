import http from "./http";

export const fetchDashboardMetrics = (tenantId, role) =>
  http.get(`/api/dashboard/metrics/${tenantId}/${role}`);

export const upsertDashboardMetrics = payload =>
  http.post(`/api/dashboard/metrics/upsert`, payload);