import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCode,
  getProductsByTenant
} from "../controllers/products.controller.js";

const router = express.Router();

/**
 * PRODUCTS
 * - GET /: Public or authenticated (product catalog)
 * - POST, PATCH, DELETE: SuperAdmin only (product management)
 */

router.get("/", getProducts); // Public product catalog

// SUPER ADMIN ONLY - Product management
router.post("/", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), createProduct);
router.patch("/:productCode", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), updateProduct);
router.delete("/:productCode", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), deleteProduct);
router.get("/:productCode", getProductByCode); // Public product details
router.get("/:tenantId", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), getProductsByTenant);


export default router;
