/**
 * Run the Aperio frontend install (npm install --prefix frontend) inside
 * @echopad/aperio using the same Node/npm as this process. Use this after
 * "npm install --ignore-scripts" on Windows when the package's postinstall
 * fails with "npm is not recognized" or EPERM.
 *
 * Usage: from backend directory: npm run install:aperio-deps
 */
import { spawnSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const aperioRoot = path.join(backendRoot, "node_modules", "@echopad", "aperio");
const frontendDir = path.join(aperioRoot, "frontend");

function log(msg) {
  console.log(`[install-aperio-deps] ${msg}`);
}

// Use npm from the same Node installation that's running this script.
// Quote path when using shell: true so "C:\Program Files\..." is not split.
const npmCmd = process.platform === "win32" ? "npm.cmd" : "npm";
const npmPath = path.join(path.dirname(process.execPath), npmCmd);
const npmPathQuoted = npmPath.includes(" ") ? `"${npmPath.replace(/"/g, '""')}"` : npmPath;

if (!fs.existsSync(aperioRoot)) {
  log("@echopad/aperio not found. Running: npm install --ignore-scripts");
  // Use shell so npm runs in the same environment as your terminal (PATH, .npmrc, vsts-npm-auth).
  const installResult = spawnSync(`${npmPathQuoted} install --ignore-scripts`, [], {
    cwd: backendRoot,
    stdio: "inherit",
    shell: true,
    env: process.env,
  });
  if (installResult.status !== 0) {
    log(`npm install --ignore-scripts failed (exit code ${installResult.status}).`);
    log("Ensure: 1) vsts-npm-auth -config .npmrc  2) node_modules removed if you had EPERM.");
    process.exit(1);
  }
  if (!fs.existsSync(aperioRoot)) {
    log("@echopad/aperio still not found after install. Check .npmrc and vsts-npm-auth.");
    process.exit(1);
  }
}

if (!fs.existsSync(path.join(frontendDir, "package.json"))) {
  log("No frontend/package.json in @echopad/aperio. Nothing to install.");
  process.exit(0);
}

log(`Running: npm install --ignore-scripts --prefix frontend (cwd: ${aperioRoot})`);
const result = spawnSync(`${npmPathQuoted} install --ignore-scripts --prefix frontend`, [], {
  cwd: aperioRoot,
  stdio: "inherit",
  shell: true,
  env: process.env,
});

if (result.status !== 0) {
  log("npm install --prefix frontend failed.");
  process.exit(1);
}

log("Done. Run: npm run build:aperio");
