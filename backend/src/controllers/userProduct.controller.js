import { getProductsByUserId } from "../services/userProduct.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const tenantId = req.currentUser.tenantId || req.auth.tid;
    const userId = req.currentUser.id || req.auth.oid;
    const data = await getProductsByUserId(tenantId, userId);
    res.status(200).json(
      new ApiResponse(200, { products: data }, "user products fetched successfully")
    );
  } catch (err) {
    throw new ApiError(500, "Failed to fetch user products");
  }
});
