import express from "express";
import {
  assignLicenseToUser,
  revokeLicenseFromUser,
  getUserLicensesByUser,
  getUserLicensesByOrganization,
} from "../services/userLicenseService.js";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";

const router = express.Router();

/**
 * GET /api/user-licenses
 * Query user license assignments
 */
router.get(
  "/",
  verifyAnyAuth,
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const requestedUserId = req.query.userId;
      const requestedOrgId = req.query.organizationId;

      if (requestedUserId) {
        if (req.currentUser.role === "user" && requestedUserId !== req.currentUser.id) {
          return res.status(403).json({ success: false, error: "Forbidden" });
        }
        const records = await getUserLicensesByUser(tenantId, requestedUserId);
        return res.status(200).json({ success: true, data: records });
      }

      if (requestedOrgId) {
        if (req.currentUser.role === "clientAdmin" && requestedOrgId !== req.currentUser.organizationId) {
          return res.status(403).json({ success: false, error: "Forbidden" });
        }
        const records = await getUserLicensesByOrganization(tenantId, requestedOrgId);
        return res.status(200).json({ success: true, data: records });
      }

      return res.status(400).json({ success: false, error: "userId or organizationId is required" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * POST /api/user-licenses/assign
 * Assign license to user (client admin or super admin)
 */
router.post(
  "/assign",
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const organizationId = req.body.organizationId || req.currentUser.organizationId;

      if (!organizationId) {
        return res.status(400).json({ success: false, error: "organizationId is required" });
      }

      if (req.currentUser.role === "clientAdmin" && organizationId !== req.currentUser.organizationId) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const record = await assignLicenseToUser({
        tenantId,
        organizationId,
        userId: req.body.userId,
        licenseId: req.body.licenseId,
        assignedBy: req.currentUser.id,
      });

      return res.status(201).json({ success: true, data: record });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

/**
 * POST /api/user-licenses/revoke
 * Revoke license from user
 */
router.post(
  "/revoke",
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const record = await revokeLicenseFromUser({
        tenantId,
        userId: req.body.userId,
        licenseId: req.body.licenseId,
      });

      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

export default router;
