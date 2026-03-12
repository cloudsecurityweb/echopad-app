/**
 * Run Aperio frontend dev server with env from main app's frontend/.env
 * so VITE_APERIO_TOKEN and VITE_APERIO_API_URL are available on localhost:5174.
 *
 * echopad-aperio source reads token from URL hash first (initTokenFromHash at load),
 * so "Start using Aperio" with #access_token=... works without .env. We still write
 * .env.local here as a fallback for opening 5174 directly and for Windows env reliability.
 *
 * Usage: node scripts/run-aperio-dev.js (from backend directory)
 * Or: npm run dev:aperio
 */
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const frontendEnvPath = path.join(backendRoot, "..", "frontend", ".env");
const aperioFrontend = path.join(backendRoot, "node_modules", "@echopad", "aperio", "frontend");

function parseEnv(pathToEnv) {
  if (!fs.existsSync(pathToEnv)) return {};
  const content = fs.readFileSync(pathToEnv, "utf8");
  const out = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let raw = trimmed.slice(eq + 1).trim();
    // Strip inline comment (e.g. "value # comment")
    const commentIdx = raw.indexOf(" #");
    if (commentIdx !== -1) raw = raw.slice(0, commentIdx).trim();
    if (!key.startsWith("VITE_APERIO")) continue;
    const value = raw.startsWith('"') && raw.endsWith('"')
      ? raw.slice(1, -1).replace(/\\"/g, '"')
      : raw;
    out[key] = value;
  }
  return out;
}

const envFromFrontend = parseEnv(frontendEnvPath);
const apiUrl = envFromFrontend.VITE_APERIO_API_URL || "http://localhost:3000";
const token = envFromFrontend.VITE_APERIO_TOKEN || "";

// Write .env.local in Aperio frontend so Vite always loads these (avoids Windows env inheritance issues)
const aperioEnvLocalPath = path.join(aperioFrontend, ".env.local");
const aperioEnvLines = [
  "# Injected by echopad-app backend/scripts/run-aperio-dev.js — do not edit; use frontend/.env instead.",
  `VITE_APERIO_API_URL=${apiUrl}`,
  `VITE_APERIO_TOKEN=${token}`,
].join("\n");
fs.writeFileSync(aperioEnvLocalPath, aperioEnvLines, "utf8");
console.log("[run-aperio-dev] Wrote VITE_APERIO_* to @echopad/aperio/frontend/.env.local");

if (!token) {
  console.warn("[run-aperio-dev] No VITE_APERIO_TOKEN in frontend/.env — Aperio may show 'API not configured'.");
  console.warn("[run-aperio-dev] Run this script from the backend directory so it can read frontend/.env.");
} else {
  console.log("[run-aperio-dev] Using VITE_APERIO_TOKEN and VITE_APERIO_API_URL from frontend/.env");
}

const env = {
  ...process.env,
  VITE_APERIO_API_URL: apiUrl,
  VITE_APERIO_TOKEN: token,
};

const child = spawn("npm", ["run", "dev", "--", "--port", "5174"], {
  cwd: aperioFrontend,
  env,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
