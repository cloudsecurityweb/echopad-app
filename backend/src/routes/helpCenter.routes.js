import express from "express";
import {
  getHelpDocs,
  createHelpDoc,
  updateHelpDoc,
} from "../controllers/helpCenter.controller.js";

const router = express.Router();

/**
 * HELP CENTER DOCS
 * - List docs (filters + pagination)
 * - Create doc
 * - Update doc
 */

router.get("/", getHelpDocs);
router.post("/", createHelpDoc);
router.patch("/:docId", updateHelpDoc);

export default router;
