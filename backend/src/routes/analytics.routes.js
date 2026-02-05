import express from "express";
import { getSuperAdminAnalytics, getOrgAnalyticsSummary, getProductUsageSummary } from "../controllers/analytics.controller.js";
import { recordAnalyticsEvent, getAnalyticsEvents } from "../services/analytics.service.js";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";

const router = express.Router();

/**
 * ANALYTICS (SUPER ADMIN ONLY)
 */

router.get("/super-admin", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), getSuperAdminAnalytics);

/**
 * GET /api/analytics/org-summary
 * Get analytics summary for an organization
 */
router.get(
    "/org-summary",
    verifyAnyAuth,
    requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
    getOrgAnalyticsSummary
);

/**
 * GET /api/analytics/usage
 * Get product usage summary for an organization and product
 */
router.get(
    "/usage",
    verifyAnyAuth,
    requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
    getProductUsageSummary
);

/**
 * POST /api/analytics/events
 * Record a product analytics event
 */
router.post(
  "/events",
  verifyAnyAuth,
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const organizationId = req.currentUser.organizationId;

      const event = await recordAnalyticsEvent({
        tenantId,
        organizationId,
        userId: req.currentUser.id,
        productId: req.body.productId,
        eventType: req.body.eventType,
        metadata: req.body.metadata,
      });

      return res.status(201).json({ success: true, data: event });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

/**
 * GET /api/analytics/events
 * Query analytics events
 */
router.get(
  "/events",
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const organizationId = req.query.organizationId || req.currentUser.organizationId;

      if (req.currentUser.role === "clientAdmin" && organizationId !== req.currentUser.organizationId) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const events = await getAnalyticsEvents(tenantId, {
        organizationId,
        userId: req.query.userId,
        productId: req.query.productId,
        eventType: req.query.eventType,
      });

      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

export default router;