import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/entraAuth.js";
import {
  getClients,
  addClient,
} from "../controllers/clients.controller.js";

const router = express.Router();

/**
 * SUPER ADMIN ONLY
 * - View all clients
 * - Create new client
 */

router.get("/", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), getClients);
router.post("/", verifyAnyAuth, requireRole(['SuperAdmin'], ['superAdmin']), addClient);

export default router;
