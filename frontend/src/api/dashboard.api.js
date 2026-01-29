import http from "./http";

export const fetchDashboardMetrics = (tenantId, role) =>
  http.get(`/dashboard/metrics/${tenantId}/${role}`);

export const upsertDashboardMetrics = payload =>
  http.post(`/dashboard/metrics/upsert`, payload);
