import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import {
  createClientFeedback,
  validateClientFeedback,
  FEEDBACK_STATUS,
} from "../models/clientFeedback.js";
import { updateDashboardMetric } from "./dashboard.service.js";

const CONTAINER_NAME = "clientFeedback";

function buildFeedbackQuery({ tenantId, status, productName, search }) {
  const parameters = [];
  const conditions = [];

  if (tenantId) {
    conditions.push("c.tenantId = @tenantId");
    parameters.push({ name: "@tenantId", value: tenantId });
  }
  if (status) {
    conditions.push("c.status = @status");
    parameters.push({ name: "@status", value: status });
  }
  if (productName) {
    conditions.push("c.productName = @productName");
    parameters.push({ name: "@productName", value: productName });
  }
  if (search) {
    conditions.push(
      "(CONTAINS(c.clientName, @search, true) OR CONTAINS(c.subject, @search, true) OR CONTAINS(c.message, @search, true) OR CONTAINS(c.productName, @search, true))"
    );
    parameters.push({ name: "@search", value: search });
  }

  let query = "SELECT * FROM c";
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }
  query += " ORDER BY c.createdAt DESC";

  return { query, parameters };
}

export async function getClientFeedback({
  tenantId,
  status,
  productName,
  search,
  limit = 50,
  continuationToken,
} = {}) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { query, parameters } = buildFeedbackQuery({
    tenantId,
    status,
    productName,
    search,
  });

  const response = await container.items
    .query(
      { query, parameters },
      {
        maxItemCount: Number(limit) || 50,
        continuationToken,
      }
    )
    .fetchNext();

  return {
    items: response.resources,
    continuationToken: response.continuationToken,
  };
}

export async function createClientFeedbackEntry(payload) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const data = {
    ...payload,
    id: payload.id || `feedback_${randomUUID()}`,
  };

  const validation = validateClientFeedback(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const feedback = createClientFeedback(data);
  await container.items.create(feedback);

  await updateDashboardMetric(
    data.tenantId,
    "CLIENT_ADMIN",
    (metrics) => {
      metrics.totalFeedback = (metrics.totalFeedback || 0) + 1;
      metrics.newFeedback = (metrics.newFeedback || 0) + 1;
    }
  );

  await updateDashboardMetric(
    "system",
    "SUPER_ADMIN",
    (metrics) => {
      metrics.totalFeedback = (metrics.totalFeedback || 0) + 1;
      metrics.newFeedback = (metrics.newFeedback || 0) + 1;
    }
  );

  return feedback;
}

export async function updateClientFeedbackEntry(id, tenantId, updates) {
  if (!tenantId) {
    throw new Error("tenantId is required");
  }

  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { resource } = await container.item(id, tenantId).read();
  if (!resource) {
    throw new Error("Feedback not found");
  }

  const allowedFields = [
    "status",
    "response",
    "respondedBy",
    "respondedAt",
  ];

  const next = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      next[field] = updates[field];
    }
  }

  if (next.status && !Object.values(FEEDBACK_STATUS).includes(next.status)) {
    throw new Error(`status must be one of: ${Object.values(FEEDBACK_STATUS).join(", ")}`);
  }

  if (next.response && !next.respondedAt) {
    next.respondedAt = new Date().toISOString();
  }

  Object.assign(resource, next, {
    updatedAt: new Date().toISOString(),
  });

  await container.items.upsert(resource);
  return resource;
}
