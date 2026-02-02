import express from "express";
import {
  inviteUser,
  activate,
  revoke,
  getAssignmentsByTenant,
  getAssignmentsByUser,
} from "../controllers/licenseAssignments.controller.js";

const router = express.Router();

/**
 * LICENSE ASSIGNMENTS
 * - Invite user (creates INVITE_SENT)
 * - Activate license
 * - Revoke license
 * - View assignments (tenant scoped)
 */

// View all license assignments for tenant
router.get("/:tenantId", getAssignmentsByTenant);

// View license assignments for a specific user within a tenant
router.get("/user/:tenantId/:userId", getAssignmentsByUser);

// Invite a user to a product
router.post("/invite", inviteUser);

// Activate license (after invite acceptance)
router.patch("/activate/:tenantId/:licenceId/:userId/:email", activate);
// Revoke or deactivate license
router.patch("/revoke/:tenantId/:licenceId", revoke);

export default router;
