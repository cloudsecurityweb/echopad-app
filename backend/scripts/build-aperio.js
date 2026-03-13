/**
 * Build Aperio frontend from the @echopad/aperio dependency and copy output
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
const nodeModulesAperio = path.join(backendRoot, "node_modules", "@echopad", "aperio");
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

// When Aperio runs inside echopad-app, the same backend serves everything. Patch the built JS
// so messages and any hardcoded 3001 URL point to the app server. Token-from-hash is already
// in echopad-aperio source (aperioApi.js initTokenFromHash + getToken); the getToken patch
// below is only for older package versions whose build output still matches.
// rootDir: directory containing the build (for logging); can be package dist or public/aperio.
const GET_TOKEN_ORIGINAL = 'function Hr(){return typeof import.meta<"u"?fg?.VITE_APERIO_TOKEN:null}';
const GET_TOKEN_PATCHED = 'function Hr(){if(Hr._ht===void 0){var h=typeof window!=="undefined"&&window.location&&window.location.hash?window.location.hash.slice(1):"";Hr._ht=h?(function(){try{var p=new URLSearchParams(h),a=p.get("access_token");if(a){window.history&&window.history.replaceState&&window.history.replaceState(null,"",window.location.pathname+window.location.search);return decodeURIComponent(a)}return null}catch(e){return null}})():null}if(Hr._ht)return Hr._ht;return typeof import.meta<"u"?fg?.VITE_APERIO_TOKEN:null}';

function patchAperioBuildAssets(assetsDir, rootDir) {
  if (!fs.existsSync(assetsDir)) return;
  const logRoot = rootDir || assetsDir;
  const entries = fs.readdirSync(assetsDir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(assetsDir, e.name);
    if (e.isDirectory()) patchAperioBuildAssets(full, logRoot);
    else if (e.name.endsWith(".js")) {
      let content = fs.readFileSync(full, "utf8");
      const before = content;
      content = content.replace(/the Aperio server/g, "the Echopad app server");
      // Fix hardcoded default API URL / error message so embedded app uses same origin
      content = content.replace(/http:\/\/localhost:3001\. Check that the server/g, "the app server. Check that the server");
      content = content.replace(/http:\/\/localhost:3001/g, "");
      // Ensure routes work when Aperio is mounted at /aperio instead of /
      // Standalone dev uses paths like "/dashboard/aperio"; when embedded under /aperio,
      // React Router sees "/aperio/dashboard/aperio". Patch route path literals so they
      // include the /aperio prefix and match the embedded location.
      content = content.replace(/"\/dashboard\//g, '"/aperio/dashboard/');
      // Optional: use token from URL hash first (only matches older echopad-aperio build output)
      if (content.includes(GET_TOKEN_ORIGINAL)) {
        content = content.replace(GET_TOKEN_ORIGINAL, GET_TOKEN_PATCHED);
      }
      if (content !== before) {
        fs.writeFileSync(full, content);
        log(`Patched: ${path.relative(logRoot, full)}`);
      }
    }
  }
}

if (!fs.existsSync(nodeModulesAperio)) {
  log("@echopad/aperio not found in node_modules. Run: npm install");
  process.exit(1);
}

const packageJsonPath = path.join(nodeModulesAperio, "package.json");
if (!fs.existsSync(packageJsonPath)) {
  log("@echopad/aperio package.json not found.");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
if (!pkg.scripts || !pkg.scripts.build) {
  log("@echopad/aperio has no 'build' script. Skipping build; ensure frontend build is in the package or adjust this script.");
  const possibleOutput = path.join(nodeModulesAperio, APERIO_BUILD_OUTPUT);
  if (fs.existsSync(possibleOutput)) {
    log(`Copying existing ${APERIO_BUILD_OUTPUT}/ to public/aperio`);
    rmDirRecursive(publicAperio);
    copyRecursive(possibleOutput, publicAperio);
    patchAperioBuildAssets(path.join(publicAperio, "assets"), publicAperio);
    log("Done.");
  } else {
    log("No build output found. Create backend/src/public/aperio and add the Aperio SPA build manually, or add a build script to echopad-Aperio.");
    process.exit(1);
  }
  process.exit(0);
}

log("Running npm run build in @echopad/aperio (base /aperio/ for mounting at /aperio)...");
const frontendDir = path.join(nodeModulesAperio, "frontend");
// When embedded in echopad-app, Aperio uses the same server (same origin). Pass empty API base
// so the built app uses relative URLs instead of localhost:3001. echopad-aperio can read
// VITE_API_BASE_URL or VITE_APERIO_API_BASE; empty = same origin.
const buildEnv = {
  ...process.env,
  VITE_BASE: "/aperio/",
  VITE_APERIO_API_URL: "",
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
// Patch the PACKAGE dist first — the server serves from node_modules/@echopad/aperio/frontend/dist,
// not from public/aperio. So we must patch the dist that gets served.
const packageAssets = path.join(actualBuildOut, "assets");
patchAperioBuildAssets(packageAssets, actualBuildOut);

rmDirRecursive(publicAperio);
copyRecursive(actualBuildOut, publicAperio);

log("Done.");
