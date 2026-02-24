import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import {
    recordMetrics,
    getMyMetrics,
    getClientMetrics,
    getPlatformMetrics,
    getUserMetricsById,
} from "../controllers/transcriptionMetrics.controller.js";

const router = express.Router();

// ===== ROUTES ==================================================================

/**
 * POST /api/internal/metrics
 * Record metrics from aiscribe — authenticated via user JWT
 */
router.post("/internal/metrics", verifyAnyAuth, recordMetrics);

/**
 * GET /api/metrics/user
 * Returns aggregated usage for the currently logged-in user
 * Query params: ?from=<ISO>&to=<ISO>
 */
router.get("/metrics/user", verifyAnyAuth, getMyMetrics);

/**
 * GET /api/metrics/client
 * CLIENT_ADMIN+ — returns usage for all users under caller's organization
 * Query params: ?from=<ISO>&to=<ISO>
 */
router.get(
    "/metrics/client",
    verifyAnyAuth,
    requireRole(
        ["SuperAdmin", "ClientAdmin"],
        ["superAdmin", "clientAdmin"]
    ),
    getClientMetrics
);

/**
 * GET /api/metrics/platform
 * SUPER_ADMIN only — returns global platform usage
 * Query params: ?from=<ISO>&to=<ISO>
 */
router.get(
    "/metrics/platform",
    verifyAnyAuth,
    requireRole(["SuperAdmin"], ["superAdmin"]),
    getPlatformMetrics
);

/**
 * GET /api/metrics/user/:userId
 * CLIENT_ADMIN + SUPER_ADMIN — lookup a specific user's metrics
 * Query params: ?from=<ISO>&to=<ISO>
 */
router.get(
    "/metrics/user/:userId",
    verifyAnyAuth,
    requireRole(
        ["SuperAdmin", "ClientAdmin"],
        ["superAdmin", "clientAdmin"]
    ),
    getUserMetricsById
);

export default router;
