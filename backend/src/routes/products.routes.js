import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import rateLimit from "express-rate-limit";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByCode,
  getProductsByTenant
} from "../controllers/products.controller.js";

const router = express.Router();
const productsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(productsLimiter);

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
