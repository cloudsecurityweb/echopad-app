import express from "express";
import { createDummyAuditEvent } from "../controllers/dummyController.js";
import { devOnly } from "../middleware/devOnly.js";

const router = express.Router();

/**
 * POST /api/auditEvents/dummy
 * Create a dummy audit event (dev only)
 */
router.post("/dummy", devOnly, createDummyAuditEvent);

export default router;
