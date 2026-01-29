import * as feedbackService from "../services/clientFeedback.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getClientFeedback = asyncHandler(async (req, res) => {
  try {
    const {
      tenantId,
      status,
      productName,
      search,
      limit = 50,
      token,
    } = req.query;

    const data = await feedbackService.getClientFeedback({
      tenantId,
      status,
      productName,
      search,
      limit: Number(limit),
      continuationToken: token,
    });

    res.status(200).json(
      new ApiResponse(200, { feedback: data }, "client feedback fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Failed to fetch client feedback");
  }
});

export const createClientFeedback = asyncHandler(async (req, res) => {
  try {
    const feedback = await feedbackService.createClientFeedbackEntry(req.body);
    res.status(201).json(
      new ApiResponse(201, { feedback }, "client feedback created successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
});

export const updateClientFeedback = asyncHandler(async (req, res) => {
  try {
    const { feedbackId } = req.params;
    const tenantId = req.body.tenantId || req.query.tenantId;

    if (!tenantId) {
      throw new ApiError(400, "tenantId is required");
    }

    const updates = { ...req.body };
    delete updates.tenantId;

    const feedback = await feedbackService.updateClientFeedbackEntry(
      feedbackId,
      tenantId,
      updates
    );

    res.status(200).json(
      new ApiResponse(200, { feedback }, "client feedback updated successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
});
