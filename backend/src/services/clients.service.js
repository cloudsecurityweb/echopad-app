import { getContainer } from "../config/cosmosClient.js";
import createClient from "../models/client.model.js";
import { updateDashboardMetric } from "./dashboard.service.js";

export async function getClients(limit, continuationToken) {
  const container = getContainer("clients");

  const query = {
    query: `SELECT * FROM c`
  };

  const response = await container.items
    .query(query, { maxItemCount: limit, continuationToken })
    .fetchNext();

  return {
    items: response.resources,
    continuationToken: response.continuationToken
  };
}

export async function addClient(payload) {
  const container = getContainer("clients");
  const client = createClient(payload);
  await container.items.create(client);

  // UPDATE SUPER ADMIN METRICS
  await updateDashboardMetric(
    "system",           // global tenant
    "SUPER_ADMIN",
    (data) => {
      data.totalClients = (data.totalClients || 0) + 1;
    }
  );

  return client;
}
