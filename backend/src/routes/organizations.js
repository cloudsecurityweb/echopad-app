import express from "express";
import { createDummyOrganization } from "../controllers/dummyController.js";
import { devOnly } from "../middleware/devOnly.js";

const router = express.Router();

/**
 * POST /api/organizations/dummy
 * Create a dummy organization (dev only)
 */
router.post("/dummy", devOnly, createDummyOrganization);

export default router;
