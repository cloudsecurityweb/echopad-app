import express from "express";
import { createDummyOrganization } from "../controllers/dummyController.js";
import {
  listOrganizations,
  getOrganization,
  updateOrganization,
  listOrganizationsDetails,
} from "../controllers/organizations.controller.js";
import { devOnly } from "../middleware/devOnly.js";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";

const router = express.Router();

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
  verifyEntraToken,
  attachUserFromDb,
  requireRole(["SuperAdmin"], ["superAdmin"]),
  listOrganizationsDetails
);

/**
 * GET /api/organizations
 * Super Admin list of client organizations
 */
router.get(
  "/",
  verifyEntraToken,
  attachUserFromDb,
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
