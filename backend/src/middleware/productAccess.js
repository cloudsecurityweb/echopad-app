/**
 * Product access middleware
 *
 * Ensures the current user has an active license for a product SKU.
 */

import { hasActiveProductAccess } from "../services/userLicenseService.js";

export function requireProductAccess(productSku) {
  return async (req, res, next) => {
    try {
      if (!req.currentUser) {
        return res.status(401).json({
          success: false,
          error: "Unauthorized",
          message: "User information not available",
        });
      }

      const tenantId = req.currentUser.tenantId;
      const userId = req.currentUser.id;

      const hasAccess = await hasActiveProductAccess(tenantId, userId, productSku);
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          error: "Forbidden",
          message: "No active license for this product",
        });
      }

      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: "Access check failed",
        message: error.message,
      });
    }
  };
}
