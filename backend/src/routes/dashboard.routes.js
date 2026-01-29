import express from "express";
import { getDashboard, upsertDashboardMetric } from "../controllers/dashboard.controller.js";

const router = express.Router();

/**
 * ROLE AWARE DASHBOARD
 * - SUPER_ADMIN  → global metrics
 * - CLIENT_ADMIN → tenant metrics
 * - USER         → personal metrics
 */

router.get("/metrics/:tenantId/:role", getDashboard);
router.post("/metrics/upsert", upsertDashboardMetric);

export default router;
