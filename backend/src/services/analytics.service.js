import { getContainer } from "../config/cosmosClient.js";
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
