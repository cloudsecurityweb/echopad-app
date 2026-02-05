import express from "express";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";
import { getDashboard, upsertDashboardMetric } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * ROLE AWARE DASHBOARD
 * - SUPER_ADMIN  → global metrics
 * - CLIENT_ADMIN → tenant metrics
 * - USER         → personal metrics
 * 
 * All dashboard routes require authentication and appropriate role
 */

router.get("/metrics/:tenantId/:role", verifyEntraToken, attachUserFromDb, getDashboard);
router.post("/metrics/upsert", verifyEntraToken, attachUserFromDb, upsertDashboardMetric);

export default router;
