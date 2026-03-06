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

// Where echopad-Aperio writes its frontend build (adjust if the package uses build/ or other)
const APERIO_BUILD_OUTPUT = "dist";

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
    log("Done.");
  } else {
    log("No build output found. Create backend/src/public/aperio and add the Aperio SPA build manually, or add a build script to echopad-Aperio.");
    process.exit(1);
  }
  process.exit(0);
}

log("Running npm run build in echopad-aperio...");
const buildResult = spawnSync("npm", ["run", "build"], {
  cwd: nodeModulesAperio,
  stdio: "inherit",
  shell: true,
});
if (buildResult.status !== 0) {
  log("Build failed.");
  process.exit(1);
}

const buildOut = path.join(nodeModulesAperio, APERIO_BUILD_OUTPUT);
if (!fs.existsSync(buildOut)) {
  log(`Build output directory not found: ${buildOut}. Set APERIO_BUILD_OUTPUT in this script if the package uses a different path (e.g. build/).`);
  process.exit(1);
}

log(`Copying ${APERIO_BUILD_OUTPUT}/ to src/public/aperio`);
rmDirRecursive(publicAperio);
copyRecursive(buildOut, publicAperio);
log("Done.");
