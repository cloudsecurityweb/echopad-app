/**
 * Aperio route handler - mounts echopad-Aperio Express router at /aperio when installed.
 * If the echopad-aperio package is not installed, exports a stub router so the server still starts.
 */
import { createRequire } from "module";
import express from "express";

let aperioRouter;

try {
  const require = createRequire(import.meta.url);
  aperioRouter = require("echopad-aperio");
} catch (err) {
  console.warn("[aperio] echopad-aperio not installed or failed to load:", err.message);
  aperioRouter = express.Router();
  aperioRouter.use((req, res) => {
    res.status(503).json({
      error: "Aperio not available",
      message: "Install the echopad-aperio package (e.g. npm install) to enable the Aperio app at /aperio.",
    });
  });
}

export default aperioRouter;
