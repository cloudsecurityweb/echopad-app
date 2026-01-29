import express from "express";
import { createDummyLicense } from "../controllers/dummyController.js";
import { devOnly } from "../middleware/devOnly.js";

const router = express.Router();

/**
 * POST /api/licenses/dummy
 * Create a dummy license (dev only)
 */
router.post("/dummy", devOnly, createDummyLicense);

export default router;
