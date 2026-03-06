/**
 * Update echopad-aperio from GitHub (dev-vk) and install frontend deps without
 * running the package postinstall (avoids "npm not recognized" and EPERM on Windows).
 *
 * Usage: from backend directory: node scripts/update-aperio.js
 * Or: npm run update:aperio
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const nodeModulesAperio = path.join(backendRoot, "node_modules", "echopad-aperio");
const frontendDir = path.join(nodeModulesAperio, "frontend");

function log(msg) {
  console.log(`[update-aperio] ${msg}`);
}

function run(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, {
    cwd: opts.cwd || backendRoot,
    stdio: "inherit",
    shell: true,
    env: process.env,
    ...opts,
  });
  if (result.status !== 0) {
    log(`Command failed: ${cmd} ${args.join(" ")}`);
    process.exit(1);
  }
  return result;
}

// 1) Remove existing echopad-aperio so we get a fresh clone without running postinstall in temp
if (fs.existsSync(nodeModulesAperio)) {
  log("Removing existing node_modules/echopad-aperio ...");
  const maxRetries = 5;
  const retryDelayMs = 1500;
  let lastErr;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      fs.rmSync(nodeModulesAperio, { recursive: true, maxRetries: 2 });
      lastErr = null;
      break;
    } catch (err) {
      lastErr = err;
      if (attempt < maxRetries) {
        log(`Attempt ${attempt}/${maxRetries} failed. Retrying in ${retryDelayMs / 1000}s ...`);
        await new Promise((r) => setTimeout(r, retryDelayMs));
      }
    }
  }
  if (lastErr) {
    log("Could not remove. Close any process using that folder:");
    log("  - Stop dev servers (npm run dev, run-aperio-dev, etc.)");
    log("  - Close terminals whose cwd is backend or echopad-aperio");
    log("  - Then run again.");
    console.error(lastErr.message);
    process.exit(1);
  }
}

// 2) Install deps with --ignore-scripts so echopad-aperio's postinstall is skipped
log("Running npm install --ignore-scripts ...");
run("npm", ["install", "--ignore-scripts"]);

if (!fs.existsSync(nodeModulesAperio)) {
  log("echopad-aperio not found after install. Check package.json and network.");
  process.exit(1);
}

// 3) Install frontend deps (postinstall would do this; we do it with current Node so npm is in PATH)
if (fs.existsSync(path.join(frontendDir, "package.json"))) {
  log("Installing frontend dependencies in echopad-aperio/frontend ...");
  run("npm", ["install"], { cwd: frontendDir });
} else {
  log("No frontend/package.json in echopad-aperio; skipping frontend install.");
}

// 4) Build Aperio for /aperio
log("Building Aperio (npm run build:aperio) ...");
run("npm", ["run", "build:aperio"]);

log("Done. echopad-aperio is updated and built.");
