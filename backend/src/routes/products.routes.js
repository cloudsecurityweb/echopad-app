import express from "express";
import {
  getProducts,
  createProduct,
  updateProduct
} from "../controllers/products.controller.js";
import { getProductByCode } from "../services/products.service.js";

const router = express.Router();

/**
 * PRODUCTS
 */

router.get("/", getProducts);

// SUPER ADMIN
router.post("/", createProduct);
router.patch("/:productCode", updateProduct);
router.get("/:productCode", getProductByCode);

export default router;
