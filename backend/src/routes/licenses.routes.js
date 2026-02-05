import express from "express";
import {
  createLicenseRecord,
  getLicensesByTenant,
  getLicenseById,
  updateLicenseRecord,
} from "../services/licenseService.js";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import { LICENSE_STATUS } from "../models/license.js";

const router = express.Router();

/**
 * GET /api/licenses
 * List licenses by tenant and optional organization/product filters
 */
router.get(
  "/",
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      // If SuperAdmin and no tenantId specified, allow querying all tenants (pass null)
      // Otherwise default to current user's tenant
      let tenantId = req.query.tenantId;
      if (!tenantId && req.currentUser.role === 'clientAdmin') {
        tenantId = req.currentUser.tenantId;
      } else if (!tenantId && req.currentUser.role === 'superAdmin') {
        // Explicitly keeping it undefined/null for superAdmin to fetch all
        tenantId = null;
      } else if (!tenantId) {
        // Default fallthrough safety
        tenantId = req.currentUser.tenantId;
      }

      // Allow SuperAdmin to view all licenses if no organizationId is provided
      // Only default to currentUser.organizationId for ClientAdmin
      let ownerOrgId = req.query.organizationId;
      if (!ownerOrgId && req.currentUser.role === 'clientAdmin') {
        ownerOrgId = req.currentUser.organizationId;
      }
      const productId = req.query.productId || null;
      const status = req.query.status || null;

      if (req.currentUser.role === "clientAdmin" && ownerOrgId !== req.currentUser.organizationId) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const licenses = await getLicensesByTenant(tenantId, ownerOrgId, productId, status);
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
  verifyAnyAuth,
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
          startDate: req.currentUser.role === "clientAdmin" ? null : req.body.startDate,
          expiresAt: req.currentUser.role === "clientAdmin" ? null : (req.body.expiresAt || req.body.endDate), // Support both during transition, prioritize expiresAt
          status: req.currentUser.role === "clientAdmin" ? LICENSE_STATUS.REQUESTED : (req.body.status || LICENSE_STATUS.ACTIVE),
          // For client admin requests, default to 10 seats if not specified (or force it as per requirement)
          // Requirement: "each license in this flow gonna have exactly 10 seats as fixed by default"
          totalSeats: req.currentUser.role === "clientAdmin" ? 10 : req.body.totalSeats,
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
  verifyAnyAuth,
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
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.body.tenantId || req.currentUser.tenantId;
      const updates = {};

      // Only include fields that are explicitly provided in the request body
      if (req.body.status !== undefined) {
        updates.status = req.body.status;
      }
      if (req.body.startDate !== undefined) {
        updates.startDate = req.body.startDate;
      }
      if (req.body.expiresAt !== undefined || req.body.endDate !== undefined) {
        updates.expiresAt = req.body.expiresAt || req.body.endDate;
      }
      if (req.body.totalSeats !== undefined) {
        updates.totalSeats = req.body.totalSeats;
      }
      if (req.body.licenseType !== undefined) {
        updates.licenseType = req.body.licenseType;
      }

      // If status is changing to ACTIVE (Approval flow), set default dates if not provided
      if (req.body.status === "active") {
        const now = new Date();
        const oneYearLater = new Date(now);
        oneYearLater.setFullYear(now.getFullYear() + 1);

        if (!updates.startDate) {
          updates.startDate = now.toISOString();
        }
        if (!updates.expiresAt) {
          updates.expiresAt = oneYearLater.toISOString();
        }
      }

      const license = await updateLicenseRecord(req.params.licenseId, tenantId, updates);
      return res.status(200).json({ success: true, data: license });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

export default router;
