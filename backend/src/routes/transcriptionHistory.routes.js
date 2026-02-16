import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import {
  createTranscription,
  getTranscriptions,
  updateTranscription,
  deleteTranscription,
} from "../controllers/transcriptionHistory.controller.js";

const router = express.Router();

/**
 * TRANSCRIPTION HISTORY
 * - POST /    : save transcription (body: { text }) — requires auth
 * - GET /     : list transcriptions for current user — requires auth
 * - PUT /:id  : update transcription (body: { text }) — requires auth
 * - DELETE /:id : delete transcription — requires auth
 */
router.post("/", verifyAnyAuth, createTranscription);
router.get("/", verifyAnyAuth, getTranscriptions);
router.put("/:id", verifyAnyAuth, updateTranscription);
router.delete("/:id", verifyAnyAuth, deleteTranscription);

export default router;
