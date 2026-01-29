/**
 * Dev-Only Middleware
 * 
 * Blocks requests in production environment to prevent accidental use of dev/testing endpoints
 */

/**
 * Middleware to block requests in production
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function devOnly(req, res, next) {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      error: "Forbidden",
      message: "This endpoint is only available in development mode",
    });
  }
  next();
}
