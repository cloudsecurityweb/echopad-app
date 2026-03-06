/**
 * Aperio route handler - mounts echopad-Aperio Express router at /aperio when installed.
 * When loaded via dynamic import in server.js, the real echopad-aperio router is mounted there instead.
 * This file exports the stub router for when the package fails to load (ESM/require issues).
 */
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicAperio = path.join(__dirname, "..", "public", "aperio");
const indexPath = path.join(publicAperio, "index.html");

export const stubRouter = (() => {
  const router = express.Router();
  router.use((req, res, next) => {
    const isGet = req.method === "GET";
    const pathIsRoot = !req.path || req.path === "/";
    if (isGet && pathIsRoot && fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
      return;
    }
    if (isGet && req.path !== "/" && !req.path.startsWith("/api") && fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
      return;
    }
    res.status(503).json({
      error: "Aperio not available",
      message: "Ensure the Echopad app backend is running (this server). Run: npm run build:aperio in backend, then start the backend. Aperio is served at /aperio on the same server.",
    });
  });
  return router;
})();

export default stubRouter;
