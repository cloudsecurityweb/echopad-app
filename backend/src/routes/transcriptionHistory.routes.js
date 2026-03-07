import express from "express";
import { verifyAnyAuth } from "../middleware/auth.js";
import {
  createTranscription,
  getTranscriptions,
  updateTranscription,
  deleteTranscription,
} from "../controllers/transcriptionHistory.controller.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const transcriptionHistoryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per 15 minutes
});
router.use(transcriptionHistoryLimiter);
/**
 * TRANSCRIPTION HISTORY
 * - POST /    : save transcription (body: { text }) — requires auth
 * - GET /     : list transcriptions for current user — requires auth
 * - PUT /:id  : update transcription (body: { text }) — requires auth
 * - DELETE /:id : delete transcription — requires auth
 */
router.post("/", verifyAnyAuth, transcriptionHistoryLimiter, createTranscription);
router.get("/", verifyAnyAuth, transcriptionHistoryLimiter, getTranscriptions);
router.put("/:id", verifyAnyAuth, transcriptionHistoryLimiter, updateTranscription);
router.delete("/:id", verifyAnyAuth, transcriptionHistoryLimiter, deleteTranscription);

export default router;
