import * as dashboardService from "../services/dashboard.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  try {
    const data = await dashboardService.getDashboardMetrics(
      req.params.tenantId,
      req.params.role
    );
    res.status(200).json(
      new ApiResponse(200, { dashboard: data }, "dashboard fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Dashboard fetch failed");
  }
})


export const upsertDashboardMetric = asyncHandler(async (req, res) => {
  try {
    const {
      tenantId,
      role,
      data
    } = req.body;

    console.log("Received data for upsert:", data);
    console.log("Tenant ID:", tenantId);
    console.log("Role:", role);
    console.log("Type of data:", typeof data);

    if (!tenantId || !role || typeof data !== "object") {
      throw new ApiError(400, "tenantId, role and updates object are required");  
    }

    await dashboardService.updateDashboardMetric(
      tenantId,
      role,
      (data) => {
        Object.keys(data).forEach((key) => {
          data[key] = data[key];
        });
      }
    );

    res.status(200).json(
      new ApiResponse(200, null, "dashboard metrics updated successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Dashboard metric upsert failed");
  }
})
