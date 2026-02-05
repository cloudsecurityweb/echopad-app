import * as helpCenterService from "../services/helpCenter.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getHelpDocs = asyncHandler(async (req, res) => {
  try {
    const {
      tenantId,
      status,
      category,
      search,
      limit = 20,
      token,
    } = req.query;

    const data = await helpCenterService.getHelpDocs({
      tenantId,
      status,
      category,
      search,
      limit: Number(limit),
      continuationToken: token,
    });

    res.status(200).json(
      new ApiResponse(200, { docs: data }, "help docs fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Failed to fetch help docs");
  }
});

export const createHelpDoc = asyncHandler(async (req, res) => {
  try {
    const doc = await helpCenterService.createHelpDocEntry(req.body);
    res.status(201).json(
      new ApiResponse(201, { doc }, "help doc created successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
});

export const getHelpDocById = asyncHandler(async (req, res) => {
  const { docId } = req.params;
  const doc = await helpCenterService.getHelpDocById(docId);

  if (!doc) {
    throw new ApiError(404, "Help document not found");
  }

  res.status(200).json(
    new ApiResponse(200, { doc }, "help doc fetched successfully")
  );
});

export const updateHelpDoc = asyncHandler(async (req, res) => {
  try {
    const { docId } = req.params;
    const tenantId = req.body.tenantId || req.query.tenantId;

    if (!tenantId) {
      throw new ApiError(400, "tenantId is required");
    }

    const updates = { ...req.body };
    delete updates.tenantId;

    const doc = await helpCenterService.updateHelpDocEntry(
      docId,
      tenantId,
      updates
    );

    res.status(200).json(
      new ApiResponse(200, { doc }, "help doc updated successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
});
