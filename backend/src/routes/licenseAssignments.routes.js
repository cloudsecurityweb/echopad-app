import express from "express";
import {
  inviteUser,
  activate,
  revoke,
  getAssignmentsByTenant,
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

// Invite a user to a product
router.post("/invite", inviteUser);

// Activate license (after invite acceptance)
router.patch("/activate/:tenantId/:licenceId/:userId/:email", activate);
// Revoke or deactivate license
router.patch("/revoke/:tenantId/:licenceId", revoke);

export default router;
