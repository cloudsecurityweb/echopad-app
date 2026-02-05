import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import {
  createTranscription,
  validateTranscription,
} from "../models/transcriptionHistory.js";

const CONTAINER_NAME = "transcriptionHistory";

/**
 * Create a new transcription and persist to Cosmos DB
 * @param {Object} params
 * @param {string} params.tenantId - Tenant ID (partition key)
 * @param {string} params.userId - User ID who saved the transcription
 * @param {string} params.text - Transcription text content
 * @returns {Promise<Object>} Created transcription document
 */
export async function createTranscriptionEntry({ tenantId, userId, text }) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const id = `trans_${randomUUID()}`;
  const data = {
    id,
    tenantId,
    userId,
    text: typeof text === "string" ? text : String(text ?? ""),
  };

  const validation = validateTranscription(data);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const doc = createTranscription(data);
  await container.items.create(doc);
  return doc;
}

/**
 * Get all transcriptions for a user within a tenant, newest first
 * @param {Object} params
 * @param {string} params.tenantId - Tenant ID (partition key)
 * @param {string} params.userId - User ID
 * @param {number} [params.limit=20] - Max items per page
 * @param {string} [params.continuationToken] - Cosmos continuation token for pagination
 * @returns {Promise<{ items: Object[], continuationToken?: string }>}
 */
export async function getTranscriptionsByUser({
  tenantId,
  userId,
  limit = 20,
  continuationToken,
} = {}) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const query =
    "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.userId = @userId ORDER BY c.createdAt DESC";
  const parameters = [
    { name: "@tenantId", value: tenantId },
    { name: "@userId", value: userId },
  ];

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

/**
 * Delete a transcription by id (user can only delete their own within tenant)
 * @param {Object} params
 * @param {string} params.tenantId - Tenant ID (partition key)
 * @param {string} params.userId - User ID (must own the item)
 * @param {string} params.transcriptionId - Transcription document id
 * @returns {Promise<void>}
 */
export async function deleteTranscriptionById({
  tenantId,
  userId,
  transcriptionId,
} = {}) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const item = container.item(transcriptionId, tenantId);
  const { resource } = await item.read();
  if (!resource) {
    throw new Error("Transcription not found");
  }
  if (resource.userId !== userId) {
    throw new Error("Not authorized to delete this transcription");
  }
  await item.delete();
}
