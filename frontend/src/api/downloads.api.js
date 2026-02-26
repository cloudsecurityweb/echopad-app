import http from "./http";

/**
 * GET /api/download/ai-scribe/version
 * Returns latest desktop and mac versions and download paths (for update app / download page).
 */
export const getAiScribeVersion = () =>
  http.get("/api/download/ai-scribe/version");
