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
router.options("/ai-scribe/version", (req, res) => res.sendStatus(204));

const API_VERSION = "7.0";
const FEEDS_API_VERSION = "7.1";

// Fallback versions when Azure Artifacts API is unavailable (e.g. no PAT or network error).
const FALLBACK_VERSIONS = {
  desktop: { version: "1.0.8", packageName: "echopad-desktop", filename: "Echopad-Setup-1.0.8.exe" },
  mac: { version: "1.0.9", packageName: "echopad-mac", filename: "Echopad-1.0.9.dmg" },
};

const VERSION_CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes — fresh artifact after new deploy
const versionCache = {
  desktop: { version: null, expires: 0 },
  mac: { version: null, expires: 0 },
};

// Azure DevOps: org URL, project (name or GUID), feed. Override via env if your setup differs.
function getOrgUrl() {
  return process.env.AZURE_DEVOPS_ORG_URL || "https://dev.azure.com/cloudsecurityweb";
}

function getProject() {
  return process.env.AZURE_DEVOPS_PROJECT || "echopad";
}

function getFeedName() {
  return process.env.AZURE_ARTIFACTS_FEED || "echopad-app";
}

function getFeedsBaseUrl() {
  const orgUrl = getOrgUrl();
  const pathSegments = new URL(orgUrl).pathname.split("/").filter(Boolean);
  const orgName = pathSegments[0] || "cloudsecurityweb";
  const project = getProject();
  const feed = getFeedName();
  return `https://feeds.dev.azure.com/${orgName}/${encodeURIComponent(project)}/_apis/packaging/Feeds/${encodeURIComponent(feed)}`;
}

/**
 * Compare two version strings (e.g. "1.0.9" vs "1.0.8"). Returns positive if a > b.
 */
function compareVersions(a, b) {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va !== vb) return va - vb;
  }
  return 0;
}

/**
 * Fetch latest version of a package from Azure Artifacts feed via REST API.
 * Uses in-memory cache with TTL. Falls back to FALLBACK_VERSIONS if API fails.
 * @param {"desktop" | "mac"} platform
 * @returns {Promise<{ version: string, packageName: string, filename: string }>}
 */
/**
 * @param {"desktop" | "mac"} platform
 * @param {{ bypassCache?: boolean }} [options] - set bypassCache: true to force fetch from Azure (e.g. ?refresh=1 on download)
 */
async function getLatestPackageInfo(platform, options = {}) {
  const now = Date.now();
  const useCache = !options.bypassCache && versionCache[platform].version && versionCache[platform].expires > now;
  if (useCache) {
    const fallback = FALLBACK_VERSIONS[platform];
    return {
      version: versionCache[platform].version,
      packageName: fallback.packageName,
      filename: platform === "desktop"
        ? `Echopad-Setup-${versionCache[platform].version}.exe`
        : `Echopad-${versionCache[platform].version}.dmg`,
    };
  }

  const pat = process.env.AZURE_DEVOPS_PAT;
  const packageName = FALLBACK_VERSIONS[platform].packageName;
  if (!pat || pat.trim() === "" || pat === "your-secret-pat-here") {
    return { ...FALLBACK_VERSIONS[platform] };
  }

  const auth = Buffer.from(":" + pat).toString("base64");
  const url = `${getFeedsBaseUrl()}/packages?packageNameQuery=${encodeURIComponent(packageName)}&includeAllVersions=true&api-version=${FEEDS_API_VERSION}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error("[DOWNLOAD] Feeds API error:", response.status, text.slice(0, 200));
      return { ...FALLBACK_VERSIONS[platform] };
    }
    const data = await response.json();
    const packages = data?.value ?? [];
    const pkg = packages.find((p) => (p.name || p.normalizedName || "").toLowerCase() === packageName.toLowerCase()) || packages[0];
    if (!pkg) {
      return { ...FALLBACK_VERSIONS[platform] };
    }
    const versions = pkg.versions || [];
    const latest = versions
      .filter((v) => !v.isDeleted)
      .sort((a, b) => compareVersions((b.version || ""), (a.version || "")))[0];
    const version = latest?.version || FALLBACK_VERSIONS[platform].version;
    versionCache[platform] = { version, expires: now + VERSION_CACHE_TTL_MS };
    const filename = platform === "desktop" ? `Echopad-Setup-${version}.exe` : `Echopad-${version}.dmg`;
    return { version, packageName, filename };
  } catch (err) {
    console.error("[DOWNLOAD] getLatestPackageInfo error:", err.message);
    return { ...FALLBACK_VERSIONS[platform] };
  }
}

function getArtifactContentUrl(packageName, version, pathStyle = "universal") {
  const orgUrl = getOrgUrl();
  const pathSegments = new URL(orgUrl).pathname.split("/").filter(Boolean);
  const orgName = pathSegments[0] || "cloudsecurityweb";
  const project = getProject();
  const feed = getFeedName();
  return `https://pkgs.dev.azure.com/${orgName}/${encodeURIComponent(project)}/_apis/packaging/feeds/${feed}/${pathStyle}/packages/${packageName}/versions/${version}/content?api-version=${API_VERSION}`;
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
 * Preferred installer extension per platform (we stream this file, not the whole package zip).
 */
const PREFERRED_EXT = { desktop: ".exe", mac: ".dmg" };

/**
 * Download universal package via Azure CLI, then stream the .exe (Windows) or .dmg (macOS) file.
 * Requires: Azure CLI + "az extension add --name azure-devops"
 */
async function downloadViaCli(req, res, packageName, version, filename, platform = "desktop") {
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
        const child = spawn("az", ["devops", "login", "--organization", getOrgUrl()], {
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
          "--organization", getOrgUrl(),
          "--project", getProject(),
          "--scope", "project",
          "--feed", feed,
          "--name", packageName,
          "--version", version,
          "--path", tempDir,
        ];
        console.log(`[DOWNLOAD] CLI command: az ${args.join(" ")}`);
        const child = spawn("az", args, { stdio: ["ignore", "pipe", "pipe"], shell: true });
        let stderr = "";
        let stdout = "";
        child.stdout?.on("data", (d) => (stdout += d.toString()));
        child.stderr?.on("data", (d) => (stderr += d.toString()));
        child.on("close", (code) => {
          if (stdout.trim()) console.log("[DOWNLOAD] CLI stdout:", stdout.trim().slice(0, 500));
          if (stderr.trim()) console.log("[DOWNLOAD] CLI stderr:", stderr.trim().slice(0, 500));
          code === 0 ? res() : rej(new Error(stderr || "az artifacts universal download failed"));
        });
        child.on("error", rej);
      });

    runLogin()
      .then(runDownload)
      .then(() => {
        try {
          const files = listFilesRecursive(tempDir);
          console.log(`[DOWNLOAD] CLI downloaded ${files.length} file(s) for package ${packageName}@${version}:`);
          files.forEach((f) => console.log(`  - ${path.basename(f.filePath)} (${(f.stat.size / 1024 / 1024).toFixed(2)} MB)`));
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

          const wantExt = PREFERRED_EXT[platform] || "";
          const matching = wantExt
            ? files.filter((f) => path.extname(f.filePath).toLowerCase() === wantExt.toLowerCase())
            : [];
          // Prefer a file that matches the requested version (exact or version in name, case-insensitive).
          // If the package has exactly one .exe, use it (we already requested this package version from Azure).
          const base = (f) => path.basename(f.filePath);
          const exactMatch = filename && matching.find((f) => base(f).toLowerCase() === filename.toLowerCase());
          const versionInName = version && matching.find((f) => base(f).toLowerCase().includes(version.toLowerCase()));
          const singleExe = matching.length === 1 ? matching[0] : null;
          const toStream = exactMatch || versionInName || singleExe;
          const matchReason = exactMatch ? "exact filename match" : versionInName ? "version string in filename" : singleExe ? "only one file with matching extension" : "no match";
          console.log(`[DOWNLOAD] File selection: ${matchReason}`, toStream ? path.basename(toStream.filePath) : "(none)",
            `| expected: ${filename} | version: ${version}`);
          if (matching.length > 0 && !toStream) {
            cleanup();
            console.error("[DOWNLOAD] No file in package matches requested version", version, "expected filename", filename, "found:", matching.map((f) => base(f)));
            return resolve(
              res.status(502).json({
                success: false,
                error: "Version mismatch",
                message: `Package does not contain a file for version ${version}. Expected a file like ${filename}.`,
              })
            );
          }

          if (toStream) {
            const { filePath } = toStream;
            if (!fs.existsSync(filePath)) {
              cleanup();
              return resolve(res.status(502).json({ success: false, error: "Download failed", message: "Downloaded file not found." }));
            }
            const ext = path.extname(filePath);
            // Use expected versioned filename so the saved file is always e.g. Echopad-Setup-1.0.19.exe
            const downloadName = filename || path.basename(filePath);
            console.log("[DOWNLOAD] CLI fallback: streaming file", path.basename(filePath), "for requested version", version);
            res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);
            if (ext === ".exe") res.setHeader("Content-Type", "application/vnd.microsoft.portable-executable");
            else if (ext === ".dmg") res.setHeader("Content-Type", "application/octet-stream");
            else if (ext === ".zip") res.setHeader("Content-Type", "application/zip");
            else res.setHeader("Content-Type", "application/octet-stream");
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
            stream.on("end", cleanup);
            stream.on("error", (e) => {
              console.error("[DOWNLOAD] Stream read error:", e.message);
              cleanup();
            });
            return resolve();
          }

          res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
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

async function streamFromArtifacts(req, res, artifactUrl, filename, packageName, version, platform) {
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
      return downloadViaCli(req, res, packageName, version, filename, platform);
    }

    // REST content endpoint often doesn't exist for Universal packages; body may be missing or invalid
    if (!response.body) {
      console.error("[DOWNLOAD] REST returned 200 but no response body, falling back to CLI.");
      return downloadViaCli(req, res, packageName, version, filename, platform);
    }

    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    try {
      const nodeStream = Readable.fromWeb(response.body);
      nodeStream.pipe(res);
    } catch (streamErr) {
      console.error("[DOWNLOAD] REST stream error:", streamErr.message);
      return downloadViaCli(req, res, packageName, version, filename, platform);
    }
  } catch (err) {
    console.error("[DOWNLOAD] Stream error:", err.message, err.stack);
    // If we haven't sent headers yet, try CLI as last resort
    if (!res.headersSent) {
      console.error("[DOWNLOAD] Falling back to Azure CLI after error.");
      return downloadViaCli(req, res, packageName, version, filename, platform);
    }
    return res.status(502).json({
      success: false,
      error: "Download failed",
      message: "Could not stream file. " + (err.message || ""),
    });
  }
}

/**
 * GET /api/download/ai-scribe/version
 * Returns newest app version and download paths per platform (fetched from Azure Artifacts).
 * No auth required so the desktop/mac app can check for updates without a user token.
 * Query: ?refresh=1 to bypass cache and fetch the latest from Azure.
 */
router.get("/ai-scribe/version", async (req, res) => {
  const basePath = "/api/download/ai-scribe";
  const bypassCache = req.query.refresh === "1" || req.query.refresh === "true";
  const [desktopInfo, macInfo] = await Promise.all([
    getLatestPackageInfo("desktop", { bypassCache }),
    getLatestPackageInfo("mac", { bypassCache }),
  ]);
  res.json({
    desktop: {
      version: desktopInfo.version,
      downloadPath: `${basePath}/desktop`,
      filename: desktopInfo.filename,
    },
    mac: {
      version: macInfo.version,
      downloadPath: `${basePath}/mac`,
      filename: macInfo.filename,
    },
  });
});

// Optional query param version must look like 1.0.19 or 1.0.0 (semver-like)
const REQUESTED_VERSION_REGEX = /^\d+\.\d+(\.\d+)?([-.].*)?$/;

function resolveDesktopDownloadInfo(req) {
  const requested = (req.query.version || "").trim();
  if (requested && REQUESTED_VERSION_REGEX.test(requested)) {
    const packageName = FALLBACK_VERSIONS.desktop.packageName;
    const filename = `Echopad-Setup-${requested}.exe`;
    return { version: requested, packageName, filename };
  }
  return null;
}

function resolveMacDownloadInfo(req) {
  const requested = (req.query.version || "").trim();
  if (requested && REQUESTED_VERSION_REGEX.test(requested)) {
    const packageName = FALLBACK_VERSIONS.mac.packageName;
    const filename = `Echopad-${requested}.dmg`;
    return { version: requested, packageName, filename };
  }
  return null;
}

/**
 * GET /api/download/ai-scribe/desktop
 * Streams Windows .exe installer from Azure Artifacts (echopad-desktop).
 * Query: ?version=1.0.19 to download that exact version (recommended; use the version shown on the page).
 */
router.get(
  "/ai-scribe/desktop",
  verifyAnyAuth,
  async (req, res) => {
    const resolved = resolveDesktopDownloadInfo(req) || await getLatestPackageInfo("desktop", { bypassCache: false });
    const { version, packageName, filename } = resolved;
    console.log("[DOWNLOAD] Windows desktop: serving version", version, "filename", filename);
    const url = getArtifactContentUrl(packageName, version);
    await streamFromArtifacts(req, res, url, filename, packageName, version, "desktop");
  }
);

/**
 * GET /api/download/ai-scribe/mac
 * Streams macOS .dmg installer from Azure Artifacts (echopad-mac).
 * Query: ?version=1.0.9 to download that exact version (recommended; use the version shown on the page).
 */
router.get(
  "/ai-scribe/mac",
  verifyAnyAuth,
  async (req, res) => {
    const resolved = resolveMacDownloadInfo(req) || await getLatestPackageInfo("mac", { bypassCache: false });
    const { version, packageName, filename } = resolved;
    console.log("[DOWNLOAD] Mac: serving version", version, "filename", filename);
    const url = getArtifactContentUrl(packageName, version);
    await streamFromArtifacts(req, res, url, filename, packageName, version, "mac");
  }
);

export default router;
