/**
 * Run Aperio frontend dev server with env from main app's frontend/.env
 * so VITE_APERIO_TOKEN and VITE_APERIO_API_URL are available on localhost:5174.
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
const aperioFrontend = path.join(backendRoot, "node_modules", "echopad-aperio", "frontend");

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
    const raw = trimmed.slice(eq + 1).trim();
    if (!key.startsWith("VITE_APERIO")) continue;
    const value = raw.startsWith('"') && raw.endsWith('"')
      ? raw.slice(1, -1).replace(/\\"/g, '"')
      : raw;
    out[key] = value;
  }
  return out;
}

const envFromFrontend = parseEnv(frontendEnvPath);
const env = {
  ...process.env,
  VITE_APERIO_API_URL: envFromFrontend.VITE_APERIO_API_URL || "http://localhost:3000",
  VITE_APERIO_TOKEN: envFromFrontend.VITE_APERIO_TOKEN || "",
};

if (!env.VITE_APERIO_TOKEN) {
  console.warn("[run-aperio-dev] No VITE_APERIO_TOKEN in frontend/.env — Aperio may show 'API not configured'.");
}

const child = spawn("npm", ["run", "dev", "--", "--port", "5174"], {
  cwd: aperioFrontend,
  env,
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
