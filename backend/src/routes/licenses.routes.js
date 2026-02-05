import express from "express";
import {
  createLicenseRecord,
  getLicensesByTenant,
  getLicenseById,
  updateLicenseRecord,
} from "../services/licenseService.js";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";
import { LICENSE_STATUS } from "../models/license.js";

const router = express.Router();

/**
 * GET /api/licenses
 * List licenses by tenant and optional organization/product filters
 */
router.get(
  "/",
  verifyEntraToken,
  attachUserFromDb,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.query.tenantId || req.currentUser.tenantId;
      const ownerOrgId = req.query.organizationId || req.currentUser.organizationId;
      const productId = req.query.productId || null;

      if (req.currentUser.role === "clientAdmin" && ownerOrgId !== req.currentUser.organizationId) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const licenses = await getLicensesByTenant(tenantId, ownerOrgId, productId);
      return res.status(200).json({ success: true, data: licenses });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * POST /api/licenses
 * Create a license for an organization and product
 */
router.post(
  "/",
  verifyEntraToken,
  attachUserFromDb,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.body.tenantId || req.currentUser.tenantId;
      const organizationId = req.body.organizationId || req.currentUser.organizationId;

      if (!organizationId) {
        return res.status(400).json({ success: false, error: "organizationId is required" });
      }

      if (req.currentUser.role === "clientAdmin" && organizationId !== req.currentUser.organizationId) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const license = await createLicenseRecord(
        {
          id: req.body.id,
          tenantId,
          productId: req.body.productId,
          organizationId,
          ownerOrgId: organizationId,
          licenseType: req.body.licenseType,
          totalSeats: req.body.totalSeats,
          usedSeats: req.body.usedSeats,
          startDate: req.body.startDate,
          expiresAt: req.body.expiresAt || req.body.endDate, // Support both during transition, prioritize expiresAt
          status: req.body.status || LICENSE_STATUS.ACTIVE,
        },
        req.currentUser.id
      );

      return res.status(201).json({ success: true, data: license });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

/**
 * GET /api/licenses/:licenseId
 */
router.get(
  "/:licenseId",
  verifyEntraToken,
  attachUserFromDb,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.query.tenantId || req.currentUser.tenantId;
      const license = await getLicenseById(req.params.licenseId, tenantId);
      if (!license) {
        return res.status(404).json({ success: false, error: "License not found" });
      }
      return res.status(200).json({ success: true, data: license });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * PATCH /api/licenses/:licenseId
 * Update status or dates
 */
router.patch(
  "/:licenseId",
  verifyEntraToken,
  attachUserFromDb,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.body.tenantId || req.currentUser.tenantId;
      const updates = {
        status: req.body.status,
        startDate: req.body.startDate,
        expiresAt: req.body.expiresAt || req.body.endDate, // Support both
        totalSeats: req.body.totalSeats,
        licenseType: req.body.licenseType,
      };

      const license = await updateLicenseRecord(req.params.licenseId, tenantId, updates);
      return res.status(200).json({ success: true, data: license });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

export default router;
