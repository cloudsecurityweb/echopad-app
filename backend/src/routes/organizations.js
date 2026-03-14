import express from "express";
import { createDummyOrganization } from "../controllers/dummyController.js";
import {
  listOrganizations,
  getOrganization,
  updateOrganization,
  listOrganizationsDetails,
} from "../controllers/organizations.controller.js";
import { devOnly } from "../middleware/devOnly.js";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const organizationsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(organizationsLimiter);

/**
 * POST /api/organizations/dummy
 * Create a dummy organization (dev only)
 */
router.post("/dummy", devOnly, createDummyOrganization);

/**
 * GET /api/organizations/details
 * Super Admin list of client organizations with product and license details
 */
router.get(
  "/details",
  verifyAnyAuth,
  requireRole(["SuperAdmin"], ["superAdmin"]),
  listOrganizationsDetails
);

/**
 * GET /api/organizations
 * Super Admin list of client organizations
 */
router.get(
  "/",
  verifyAnyAuth,
  requireRole(["SuperAdmin"], ["superAdmin"]),
  listOrganizations
);

/**
 * GET /api/organizations/:orgId
 * Get an organization by ID
 */
router.get("/:orgId", getOrganization);

/**
 * PATCH /api/organizations/:orgId
 * Update an organization
 */
router.patch("/:orgId", updateOrganization);

export default router;
