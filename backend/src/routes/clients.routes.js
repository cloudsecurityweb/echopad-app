import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import {
  getClients,
  addClient,
} from "../controllers/clients.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const clientsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(clientsLimiter);

/**
 * SUPER ADMIN ONLY
 * - View all clients
 * - Create new client
 */

router.get("/", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), getClients);
router.post("/", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), addClient);

export default router;
