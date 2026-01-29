import * as productService from "../services/products.service.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts();
  res.status(200).json(
    new ApiResponse(200, { products }, "products fetched successfully")
  );
});

export const createProduct = asyncHandler(async (req, res) => {
  try {
    const product = await productService.createProducts(req.body);
    res.status(201).json(
      new ApiResponse(201, { product }, "product created successfully")
    );
  } catch (err) {
    throw new ApiError(400, err.message);
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productCode } = req.params;
  const product = await productService.updateProduct(productCode, req.body);
  res.status(200).json(
    new ApiResponse(200, { product }, "product updated successfully")
  );
})

export const getProductByCode = asyncHandler(async (req, res) => {
  const { productCode } = req.params;
  try {
    const product = await productService.getProductByCode(productCode);
    if (product) {
      res.status(200).json(
        new ApiResponse(200, { product }, "product fetched successfully")
      );
    } else {
      throw new ApiError(404, "Product not found");
    }
  } catch (err) {
    throw new ApiError(500, "Failed to fetch product");
  }
})