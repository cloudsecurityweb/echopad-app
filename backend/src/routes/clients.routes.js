import express from "express";
import { verifyEntraToken, attachUserFromDb, requireRole } from "../middleware/entraAuth.js";
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

router.get("/", verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), getClients);
router.post("/", verifyEntraToken, attachUserFromDb, requireRole(['SuperAdmin'], ['superAdmin']), addClient);

export default router;
