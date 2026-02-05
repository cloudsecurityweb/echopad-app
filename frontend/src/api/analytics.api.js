import http from "./http";

export const fetchSuperAdminAnalytics = () =>
  http.get("/api/analytics/super-admin");
