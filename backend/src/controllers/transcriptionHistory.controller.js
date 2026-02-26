import * as transcriptionHistoryService from "../services/transcriptionHistory.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function getTenantAndUser(req) {
  const tenantId = req.currentUser?.tenantId || req.auth?.tid;
  const userId = req.currentUser?.id || req.auth?.oid;
  if (!tenantId || !userId) {
    throw new ApiError(401, "Unauthorized: tenant and user identity required");
  }
  return { tenantId, userId };
}

export const createTranscription = asyncHandler(async (req, res) => {
  const { tenantId, userId } = getTenantAndUser(req);
  const text = req.body?.text;

  if (text === undefined || text === null) {
    throw new ApiError(400, "text is required");
  }

  const doc = await transcriptionHistoryService.createTranscriptionEntry({
    tenantId,
    userId,
    text,
  });

  res.status(201).json(
    new ApiResponse(201, { transcription: doc }, "Transcription saved successfully")
  );
});

export const getTranscriptions = asyncHandler(async (req, res) => {
  const { tenantId, userId } = getTenantAndUser(req);
  const limit = req.query.limit;
  const token = req.query.token;

  const data = await transcriptionHistoryService.getTranscriptionsByUser({
    tenantId,
    userId,
    limit: limit !== undefined ? Number(limit) : 20,
    continuationToken: token || undefined,
  });

  res.status(200).json(
    new ApiResponse(200, data, "Transcriptions fetched successfully")
  );
});

export const updateTranscription = asyncHandler(async (req, res) => {
  const { tenantId, userId } = getTenantAndUser(req);
  const id = req.params?.id;
  const text = req.body?.text;

  if (text === undefined || typeof text !== "string") {
    throw new ApiError(400, "Missing or invalid body: { text }");
  }
  if (!id) {
    throw new ApiError(400, "Transcription id is required");
  }

  const updated = await transcriptionHistoryService.updateTranscriptionByIdAndUser({
    tenantId,
    userId,
    transcriptionId: id,
    text: text.trim(),
  });

  if (!updated) {
    throw new ApiError(404, "Transcription not found");
  }

  res.status(200).json(
    new ApiResponse(200, { transcription: updated }, "Transcription updated successfully")
  );
});

export const deleteTranscription = asyncHandler(async (req, res) => {
  const { tenantId, userId } = getTenantAndUser(req);
  const transcriptionId = req.params?.id;
  if (!transcriptionId) {
    throw new ApiError(400, "Transcription id is required");
  }

  await transcriptionHistoryService.deleteTranscriptionById({
    tenantId,
    userId,
    transcriptionId,
  });

  res.status(200).json(
    new ApiResponse(200, null, "Transcription deleted successfully")
  );
});
