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

export const getOrgAnalyticsSummary = asyncHandler(async (req, res) => {
  const organizationId = req.query.orgId;
  const tenantId = req.currentUser.tenantId; // Use req.currentUser.tenantId for dynamic tenanting

  if (!organizationId) {
    throw new ApiError(400, "Organization ID (orgId) is required");
  }

  // Optional: Add role-based access control
  if (req.currentUser.role === "clientAdmin" && organizationId !== req.currentUser.organizationId) {
    throw new ApiError(403, "Forbidden: You can only access your own organization's analytics.");
  }

  const summary = await analyticsService.getOrgAnalyticsSummary(tenantId, organizationId);

  res.status(200).json(
    new ApiResponse(200, summary, "Organization analytics summary fetched successfully")
  );
});

export const getProductUsageSummary = asyncHandler(async (req, res) => {
  const organizationId = req.query.orgId;
  const productCode = req.query.productCode;
  const tenantId = req.currentUser.tenantId;

  if (!organizationId || !productCode) {
    throw new ApiError(400, "Organization ID (orgId) and Product Code (productCode) are required");
  }

  // Access control: ClientAdmin can only view their own org's product usage
  if (req.currentUser.role === "clientAdmin" && organizationId !== req.currentUser.organizationId) {
    throw new ApiError(403, "Forbidden: You can only access your own organization's product usage.");
  }

  const summary = await analyticsService.getProductUsageSummary(tenantId, organizationId, productCode);

  res.status(200).json(
    new ApiResponse(200, summary, "Product usage summary fetched successfully")
  );
});