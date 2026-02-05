import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import { getDashboard, upsertDashboardMetric } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * ROLE AWARE DASHBOARD
 * - SUPER_ADMIN  → global metrics
 * - CLIENT_ADMIN → tenant metrics
 * - USER         → personal metrics
 * 
 * All dashboard routes require authentication (Microsoft, Google, Magic Link, or Email/Password) and appropriate role
 */

router.get("/metrics/:tenantId/:role", verifyAnyAuth, getDashboard);
router.post("/metrics/upsert", verifyAnyAuth, upsertDashboardMetric);

export default router;
