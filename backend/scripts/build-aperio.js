/**
 * Build Aperio frontend from the echopad-aperio dependency and copy output
 * to backend/src/public/aperio for serving at /aperio.
 *
 * Run from repo root: cd backend && node scripts/build-aperio.js
 * Or: npm run build:aperio (from backend directory)
 *
 * Adjust APERIO_BUILD_OUTPUT if the echopad-Aperio repo uses a different output dir (e.g. build/, dist/).
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const nodeModulesAperio = path.join(backendRoot, "node_modules", "echopad-aperio");
const publicAperio = path.join(backendRoot, "src", "public", "aperio");

// Where echopad-Aperio writes its frontend build (package root dist/ or frontend/dist/)
const APERIO_BUILD_OUTPUT = "dist";
const APERIO_BUILD_OUTPUT_ALT = "frontend/dist";

function log(msg) {
  console.log(`[build-aperio] ${msg}`);
}

function rmDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// When Aperio runs inside echopad-app, there is no separate "Aperio server" — the same backend serves
// everything. Replace the in-app error message so it says "Echopad app server" instead.
function patchAperioErrorMessage(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) patchAperioErrorMessage(full);
    else if (e.name.endsWith(".js")) {
      let content = fs.readFileSync(full, "utf8");
      const before = content;
      content = content.replace(/the Aperio server/g, "the Echopad app server");
      if (content !== before) {
        fs.writeFileSync(full, content);
        log(`Patched error message in ${path.relative(publicAperio, full)}`);
      }
    }
  }
}

if (!fs.existsSync(nodeModulesAperio)) {
  log("echopad-aperio not found in node_modules. Run: npm install");
  process.exit(1);
}

const packageJsonPath = path.join(nodeModulesAperio, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  log("echopad-aperio package.json not found.");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (!pkg.scripts || !pkg.scripts.build) {
  log("echopad-aperio has no 'build' script. Skipping build; ensure frontend build is in the package or adjust this script.");
  const possibleOutput = path.join(nodeModulesAperio, APERIO_BUILD_OUTPUT);
  if (fs.existsSync(possibleOutput)) {
    log(`Copying existing ${APERIO_BUILD_OUTPUT}/ to public/aperio`);
    rmDirRecursive(publicAperio);
    copyRecursive(possibleOutput, publicAperio);
    patchAperioErrorMessage(path.join(publicAperio, "assets"));
    log("Done.");
  } else {
    log("No build output found. Create backend/src/public/aperio and add the Aperio SPA build manually, or add a build script to echopad-Aperio.");
    process.exit(1);
  }
  process.exit(0);
}

log("Running npm run build in echopad-aperio (base /aperio/ for mounting at /aperio)...");
const frontendDir = path.join(nodeModulesAperio, "frontend");
// When embedded in echopad-app, Aperio uses the same server (same origin). Pass empty API base
// so the built app uses relative URLs instead of localhost:3001. echopad-aperio can read
// VITE_API_BASE_URL or VITE_APERIO_API_BASE; empty = same origin.
const buildEnv = {
  ...process.env,
  VITE_BASE: "/aperio/",
  VITE_API_BASE_URL: "",
  VITE_APERIO_API_BASE: "",
};
const buildResult = spawnSync(
  "npm",
  ["run", "build", "--", "--base", "/aperio/"],
  {
    cwd: fs.existsSync(path.join(frontendDir, "package.json")) ? frontendDir : nodeModulesAperio,
    stdio: "inherit",
    shell: true,
    env: buildEnv,
  }
);
if (buildResult.status !== 0) {
  log("Build failed.");
  process.exit(1);
}

const buildOut = path.join(nodeModulesAperio, APERIO_BUILD_OUTPUT);
const buildOutAlt = path.join(nodeModulesAperio, APERIO_BUILD_OUTPUT_ALT);
const actualBuildOut = fs.existsSync(buildOut) ? buildOut : fs.existsSync(buildOutAlt) ? buildOutAlt : null;
if (!actualBuildOut) {
  log(`Build output directory not found: ${buildOut} or ${buildOutAlt}. Set APERIO_BUILD_OUTPUT in this script if the package uses a different path.`);
  process.exit(1);
}

log(`Copying build output to src/public/aperio`);
rmDirRecursive(publicAperio);
copyRecursive(actualBuildOut, publicAperio);

patchAperioErrorMessage(path.join(publicAperio, "assets"));

log("Done.");
