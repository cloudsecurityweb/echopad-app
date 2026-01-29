import express from "express";
import {
  getClients,
  addClient,
} from "../controllers/clients.controller.js";

const router = express.Router();

/**
 * SUPER ADMIN
 * - View all clients
 * - Create new client
 */

router.get("/", getClients);
router.post("/", addClient);

export default router;
