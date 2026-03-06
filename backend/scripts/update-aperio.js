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
  try {
    fs.rmSync(nodeModulesAperio, { recursive: true, maxRetries: 3 });
  } catch (err) {
    log("Could not remove. Close any terminals/editors using that folder, then run again.");
    console.error(err.message);
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
