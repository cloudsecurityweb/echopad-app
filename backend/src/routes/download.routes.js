import express from "express";
import { Readable } from "stream";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import archiver from "archiver";
import { verifyAnyAuth } from "../middleware/auth.js";

const router = express.Router();

// Explicit OPTIONS for CORS preflight so the browser gets a clear 204 (avoids "No content for preflight" in DevTools)
router.options("/ai-scribe/desktop", (req, res) => res.sendStatus(204));
router.options("/ai-scribe/mac", (req, res) => res.sendStatus(204));

const ORG = "cloudsecurityweb";
const ORG_URL = "https://dev.azure.com/cloudsecurityweb";
const PROJECT = "echopad";
const API_VERSION = "7.0";

// Feed name in Azure Artifacts (e.g. echopad-app or echopad-artifacts). Override with AZURE_ARTIFACTS_FEED in env.
function getFeedName() {
  return process.env.AZURE_ARTIFACTS_FEED || "echopad-app";
}

function getArtifactContentUrl(packageName, version, pathStyle = "universal") {
  const feed = getFeedName();
  return `https://pkgs.dev.azure.com/${ORG}/${PROJECT}/_apis/packaging/feeds/${feed}/${pathStyle}/packages/${packageName}/versions/${version}/content?api-version=${API_VERSION}`;
}

/**
 * Recursively list all files in a directory.
 * @returns {Array<{ filePath: string, stat: import('fs').Stats }>}
 */
function listFilesRecursive(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...listFilesRecursive(full));
    } else {
      results.push({ filePath: full, stat: fs.statSync(full) });
    }
  }
  return results;
}

/**
 * Download universal package via Azure CLI and stream to response.
 * Requires: Azure CLI + "az extension add --name azure-devops"
 */
async function downloadViaCli(req, res, packageName, version, filename) {
  const pat = process.env.AZURE_DEVOPS_PAT;
  if (!pat || pat.trim() === "" || pat === "your-secret-pat-here") {
    return res.status(503).json({
      success: false,
      error: "Download not configured",
      message: "Azure Artifacts PAT is not configured.",
    });
  }

  const feed = getFeedName();
  const tempDir = path.join(os.tmpdir(), `echopad-dl-${Date.now()}-${Math.random().toString(36).slice(2)}`);

  function cleanup() {
    try {
      if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true });
    } catch (e) {
      console.error("[DOWNLOAD] Cleanup error:", e);
    }
  }

  return new Promise((resolve) => {
    fs.mkdirSync(tempDir, { recursive: true });

    const runLogin = () =>
      new Promise((res, rej) => {
        const child = spawn("az", ["devops", "login", "--organization", ORG_URL], {
          stdio: ["pipe", "pipe", "pipe"],
          shell: true,
        });
        child.stdin.write(pat + "\n");
        child.stdin.end();
        let stderr = "";
        child.stderr?.on("data", (d) => (stderr += d.toString()));
        child.on("close", (code) => (code === 0 ? res() : rej(new Error(stderr || "az devops login failed"))));
        child.on("error", rej);
      });

    const runDownload = () =>
      new Promise((res, rej) => {
        const args = [
          "artifacts",
          "universal",
          "download",
          "--organization", ORG_URL,
          "--project", PROJECT,
          "--scope", "project",
          "--feed", feed,
          "--name", packageName,
          "--version", version,
          "--path", tempDir,
        ];
        const child = spawn("az", args, { stdio: ["ignore", "pipe", "pipe"], shell: true });
        let stderr = "";
        child.stderr?.on("data", (d) => (stderr += d.toString()));
        child.on("close", (code) => (code === 0 ? res() : rej(new Error(stderr || "az artifacts universal download failed"))));
        child.on("error", rej);
      });

    runLogin()
      .then(runDownload)
      .then(() => {
        try {
          const files = listFilesRecursive(tempDir);
          if (files.length === 0) {
            cleanup();
            return resolve(
              res.status(502).json({
                success: false,
                error: "Download failed",
                message: "Package downloaded but no files found.",
              })
            );
          }

          res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

          if (files.length === 1) {
            const { filePath } = files[0];
            if (!fs.existsSync(filePath)) {
              cleanup();
              return resolve(res.status(502).json({ success: false, error: "Download failed", message: "Downloaded file not found." }));
            }
            const stream = fs.createReadStream(filePath);
            const ext = path.extname(filePath);
            if (ext) res.setHeader("Content-Type", ext === ".zip" ? "application/zip" : "application/octet-stream");
            stream.pipe(res);
            stream.on("end", cleanup);
            stream.on("error", (e) => {
              console.error("[DOWNLOAD] Stream read error:", e.message);
              cleanup();
            });
          } else {
            res.setHeader("Content-Type", "application/zip");
            const archive = archiver("zip", { zlib: { level: 0 } });
            archive.on("error", (err) => {
              console.error("[DOWNLOAD] Archive error:", err);
              cleanup();
            });
            archive.pipe(res);
            for (const { filePath } of files) {
              const name = path.relative(tempDir, filePath);
              archive.file(filePath, { name });
            }
            archive.finalize();
            res.on("finish", cleanup);
          }
          resolve();
        } catch (streamErr) {
          cleanup();
          console.error("[DOWNLOAD] CLI stream error:", streamErr.message, streamErr.stack);
          resolve(
            res.status(502).json({
              success: false,
              error: "Download failed",
              message: "Could not stream downloaded file. " + (streamErr.message || ""),
            })
          );
        }
      })
      .catch((err) => {
        cleanup();
        console.error("[DOWNLOAD] CLI error:", err.message);
        resolve(
          res.status(502).json({
            success: false,
            error: "Download failed",
            message: "Could not download via Azure CLI. Ensure Azure CLI and 'az extension add --name azure-devops' are installed, and PAT has Packaging → Read.",
          })
        );
      });
  });
}

async function streamFromArtifacts(req, res, artifactUrl, filename, packageName, version) {
  const pat = process.env.AZURE_DEVOPS_PAT;
  if (!pat || pat.trim() === "" || pat === "your-secret-pat-here") {
    return res.status(503).json({
      success: false,
      error: "Download not configured",
      message: "Azure Artifacts PAT is not configured. Set AZURE_DEVOPS_PAT in backend .env with a PAT that has Packaging → Read scope.",
    });
  }

  const auth = Buffer.from(":" + pat).toString("base64");
  const authHeader = { Authorization: `Basic ${auth}` };

  async function doFetch(url) {
    return fetch(url, { method: "GET", headers: authHeader });
  }

  try {
    let response = await doFetch(artifactUrl);
    const altPathStyle = artifactUrl.includes("/universal/") ? "upack" : "universal";
    const altUrl = artifactUrl.replace(`/${altPathStyle === "upack" ? "universal" : "upack"}/`, `/${altPathStyle}/`);
    if (!response.ok && response.status === 404 && altUrl !== artifactUrl) {
      console.error(`[DOWNLOAD] First URL returned 404, trying alternate path: ${altUrl}`);
      response = await doFetch(altUrl);
    }

    if (!response.ok) {
      let bodyPreview = "";
      try {
        const text = await response.text();
        bodyPreview = text.slice(0, 300);
      } catch (_) {}
      console.error(
        `[DOWNLOAD] Azure Artifacts REST error: ${response.status} ${response.statusText}`,
        "\nURL:",
        artifactUrl,
        "\nBody:",
        bodyPreview
      );
      const isAuth = response.status === 401 || response.status === 403;
      if (isAuth) {
        return res.status(502).json({
          success: false,
          error: "Download failed",
          message: "Artifact store authentication failed. Check AZURE_DEVOPS_PAT has Packaging → Read scope and is valid.",
        });
      }
      // REST has no public content endpoint for Universal packages; fall back to Azure CLI
      console.error("[DOWNLOAD] Falling back to Azure CLI download.");
      return downloadViaCli(req, res, packageName, version, filename);
    }

    // REST content endpoint often doesn't exist for Universal packages; body may be missing or invalid
    if (!response.body) {
      console.error("[DOWNLOAD] REST returned 200 but no response body, falling back to CLI.");
      return downloadViaCli(req, res, packageName, version, filename);
    }

    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    try {
      const nodeStream = Readable.fromWeb(response.body);
      nodeStream.pipe(res);
    } catch (streamErr) {
      console.error("[DOWNLOAD] REST stream error:", streamErr.message);
      return downloadViaCli(req, res, packageName, version, filename);
    }
  } catch (err) {
    console.error("[DOWNLOAD] Stream error:", err.message, err.stack);
    // If we haven't sent headers yet, try CLI as last resort
    if (!res.headersSent) {
      console.error("[DOWNLOAD] Falling back to Azure CLI after error.");
      return downloadViaCli(req, res, packageName, version, filename);
    }
    return res.status(502).json({
      success: false,
      error: "Download failed",
      message: "Could not stream file. " + (err.message || ""),
    });
  }
}

/**
 * GET /api/download/ai-scribe/desktop
 * Streams Windows desktop installer from Azure Artifacts (echopad-desktop 1.0.8).
 */
router.get(
  "/ai-scribe/desktop",
  verifyAnyAuth,
  async (req, res) => {
    const url = getArtifactContentUrl("echopad-desktop", "1.0.8");
    await streamFromArtifacts(req, res, url, "echopad-desktop-1.0.8.zip", "echopad-desktop", "1.0.8");
  }
);

/**
 * GET /api/download/ai-scribe/mac
 * Streams macOS installer from Azure Artifacts (echopad-mac 1.0.9).
 */
router.get(
  "/ai-scribe/mac",
  verifyAnyAuth,
  async (req, res) => {
    const url = getArtifactContentUrl("echopad-mac", "1.0.9");
    await streamFromArtifacts(req, res, url, "echopad-mac-1.0.9.zip", "echopad-mac", "1.0.9");
  }
);

export default router;
