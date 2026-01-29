import http from "./http";

export const fetchSuperAdminAnalytics = () =>
  http.get("/analytics/super-admin");
