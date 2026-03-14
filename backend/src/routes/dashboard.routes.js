import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import { getDashboard, upsertDashboardMetric } from "../controllers/dashboard.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const dashboardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(dashboardLimiter);

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
