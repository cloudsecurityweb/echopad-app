import express from "express";
import { createDummyProduct } from "../controllers/dummyController.js";
import { devOnly } from "../middleware/devOnly.js";

const router = express.Router();

/**
 * POST /api/products/dummy
 * Create a dummy product (dev only)
 */
router.post("/dummy", devOnly, createDummyProduct);

export default router;
