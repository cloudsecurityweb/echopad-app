import * as analyticsService from "../services/analytics.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getSuperAdminAnalytics = asyncHandler(async (req, res) => {
  try {
    const analytics = await analyticsService.getSuperAdminAnalytics();
    res.status(200).json(
      new ApiResponse(200, { analytics }, "analytics fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Failed to fetch analytics");
  }
});
