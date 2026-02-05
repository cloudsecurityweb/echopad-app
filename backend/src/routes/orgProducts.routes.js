import express from "express";
import { createOrgProductRecord, getOrgProductsByOrganization, updateOrgProductStatus } from "../services/orgProductService.js";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";

const router = express.Router();

/**
 * GET /api/org-products
 * List organization product mappings
 */
router.get(
  "/",
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const organizationId = req.query.organizationId || req.currentUser.organizationId;

      if (!organizationId) {
        return res.status(400).json({ success: false, error: "organizationId is required" });
      }

      console.log("------", req.currentUser.role, req.currentUser.organizationId);
      console.log("/////>>>>>>", organizationId);

      if (req.currentUser.role === "clientAdmin" && organizationId !== req.currentUser.organizationId) {
        return res.status(403).json({ success: false, error: "Forbidden" });
      }

      const records = await getOrgProductsByOrganization(tenantId, organizationId);
      return res.status(200).json({ success: true, data: records });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
);

/**
 * POST /api/org-products
 * Enable a product for an organization
 */
router.post(
  "/",
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

      const productId = req.body.productId || req.body.productSku;
      const productSku = req.body.productSku || req.body.productId;

      const record = await createOrgProductRecord({
        tenantId,
        organizationId,
        productId,
        productSku,
        status: req.body.status,
      });

      return res.status(201).json({ success: true, data: record });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

/**
 * PATCH /api/org-products/:orgProductId
 * Update org-product status
 */
router.patch(
  "/:orgProductId",
  verifyAnyAuth,
  requireRole(["SuperAdmin", "ClientAdmin"], ["superAdmin", "clientAdmin"]),
  async (req, res) => {
    try {
      const tenantId = req.currentUser.tenantId;
      const record = await updateOrgProductStatus(tenantId, req.params.orgProductId, req.body.status);
      return res.status(200).json({ success: true, data: record });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
);

export default router;
