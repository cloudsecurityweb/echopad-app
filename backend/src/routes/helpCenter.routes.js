import express from "express";
import {
  getHelpDocs,
  createHelpDoc,
  updateHelpDoc,
  getHelpDocById,
} from "../controllers/helpCenter.controller.js";

const router = express.Router();

/**
 * HELP CENTER DOCS
 * - List docs (filters + pagination)
 * - Get doc by ID
 * - Create doc
 * - Update doc
 */

router.get("/", getHelpDocs);
router.get("/:docId", getHelpDocById);
router.post("/", createHelpDoc);
router.patch("/:docId", updateHelpDoc);

export default router;
