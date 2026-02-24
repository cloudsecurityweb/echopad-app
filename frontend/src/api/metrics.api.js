import http from "./http";

/**
 * Fetch aggregated metrics for the currently logged-in user
 * @param {{ from?: string, to?: string }} params - Optional date range (ISO strings)
 */
export const fetchUserMetrics = (params = {}) =>
    http.get("/api/metrics/user", { params });
