import express from "express";
import {
  getClientFeedback,
  createClientFeedback,
  updateClientFeedback,
} from "../controllers/clientFeedback.controller.js";

const router = express.Router();

/**
 * CLIENT FEEDBACK
 * - List feedback (filters + pagination)
 * - Create feedback
 * - Update feedback status/response
 */

router.get("/", getClientFeedback);
router.post("/", createClientFeedback);
router.patch("/:feedbackId", updateClientFeedback);

export default router;
