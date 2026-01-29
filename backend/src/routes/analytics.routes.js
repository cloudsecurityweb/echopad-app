import express from "express";
import { getSuperAdminAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * ANALYTICS (SUPER ADMIN)
 */

router.get("/super-admin", getSuperAdminAnalytics);

export default router;
