import express from "express";
import crypto from "crypto";
import { verifyAnyAuth } from "../middleware/auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const intercomLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(intercomLimiter);

/**
 * GET /api/intercom
 * Returns Intercom identity data with HMAC user_hash for Identity Verification.
 * Requires authentication — the user_hash is derived from the authenticated user's ID.
 */
router.get("/", verifyAnyAuth, intercomLimiter, (req, res) => {
  const { INTERCOM_APP_ID, INTERCOM_SECRET } = process.env;

  if (!INTERCOM_APP_ID || !INTERCOM_SECRET) {
    return res.status(503).json({
      success: false,
      error: "Intercom is not configured on this server.",
    });
  }

  const user = req.currentUser;

  if (!user || !user.id) {
    return res.status(401).json({
      success: false,
      error: "Authenticated user not found.",
    });
  }

  const userHash = crypto
    .createHmac("sha256", INTERCOM_SECRET)
    .update(user.id)
    .digest("hex");

  return res.json({
    success: true,
    appId: INTERCOM_APP_ID,
    userHash,
    user: {
      id: user.id,
      name: user.displayName || "",
      email: user.email || "",
    },
  });
});

export default router;
