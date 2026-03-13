/**
 * Update @echopad/aperio from Azure Artifacts to the latest published version and rebuild.
 *
 * This installs the newest version from the feed (not just within current semver range),
 * updates package.json and package-lock.json, then runs the Aperio build.
 *
 * Usage: from backend directory: node scripts/update-aperio.js
 * Or: npm run update:aperio
 */
import { spawnSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");

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

log("Installing latest @echopad/aperio from Azure Artifacts...");
run("npm", ["install", "@echopad/aperio@latest", "--save"]);

log("Building Aperio (npm run build:aperio)...");
run("npm", ["run", "build:aperio"]);

log("Done. @echopad/aperio is updated to latest and built.");
