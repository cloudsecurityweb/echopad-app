import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import {
  createHelpDoc,
  validateHelpDoc,
  HELP_DOC_STATUS,
} from "../models/helpDoc.js";

const CONTAINER_NAME = "helpCenterDocs";

function buildHelpDocQuery({ tenantId, status, category, search }) {
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
  if (category) {
    conditions.push("c.category = @category");
    parameters.push({ name: "@category", value: category });
  }
  if (search) {
    conditions.push(
      "(CONTAINS(c.title, @search, true) OR CONTAINS(c.content, @search, true))"
    );
    parameters.push({ name: "@search", value: search });
  }

  let query = "SELECT * FROM c";
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }
  query += " ORDER BY c.updatedAt DESC";

  return { query, parameters };
}

export async function getHelpDocs({
  tenantId,
  status,
  category,
  search,
  limit = 20,
  continuationToken,
} = {}) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { query, parameters } = buildHelpDocQuery({
    tenantId,
    status,
    category,
    search,
  });

  const response = await container.items
    .query(
      { query, parameters },
      {
        maxItemCount: Number(limit) || 20,
        continuationToken,
      }
    )
    .fetchNext();

  return {
    items: response.resources,
    continuationToken: response.continuationToken,
  };
}


export async function getHelpDocById(docId) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  // Help docs are stored with tenantId "system"
  const tenantId = "system";

  try {
    const { resource } = await container.item(docId, tenantId).read();
    return resource;
  } catch (error) {
    if (error.code === 404) {
      return null;
    }
    throw error;
  }
}

export async function createHelpDocEntry(payload) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const data = {
    ...payload,
    id: payload.id || `help_${randomUUID()}`,
  };

  const validation = validateHelpDoc(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const doc = createHelpDoc(data);
  await container.items.create(doc);
  return doc;
}

export async function updateHelpDocEntry(id, tenantId, updates) {
  if (!tenantId) {
    throw new Error("tenantId is required");
  }

  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { resource } = await container.item(id, tenantId).read();
  if (!resource) {
    throw new Error("Help doc not found");
  }

  const allowedFields = [
    "title",
    "category",
    "status",
    "summary",
    "content",
    "tags",
    "updatedBy",
  ];

  const next = {};
  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      next[field] = updates[field];
    }
  }

  if (next.status && !Object.values(HELP_DOC_STATUS).includes(next.status)) {
    throw new Error(`status must be one of: ${Object.values(HELP_DOC_STATUS).join(", ")}`);
  }

  if (next.tags && !Array.isArray(next.tags)) {
    throw new Error("tags must be an array");
  }

  Object.assign(resource, next, {
    updatedAt: new Date().toISOString(),
  });

  await container.items.upsert(resource);
  return resource;
}
