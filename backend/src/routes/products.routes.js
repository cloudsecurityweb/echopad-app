import express from "express";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";
import {
  getProducts,
  createProduct,
  updateProduct,
  getProductByCode,
  getProductsByTenant
} from "../controllers/products.controller.js";

const router = express.Router();

/**
 * PRODUCTS
 * - GET /: Public or authenticated (product catalog)
 * - POST, PATCH: SuperAdmin only (product management)
 */

router.get("/", getProducts); // Public product catalog

// SUPER ADMIN ONLY - Product management
router.post("/", verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), createProduct);
router.patch("/:productCode", verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), updateProduct);
router.get("/:productCode", getProductByCode); // Public product details
router.get("/:tenantId", verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), getProductsByTenant);


export default router;
