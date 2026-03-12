/**
 * Run the Aperio standalone backend (port 3001) with env from backend/.env.
 * Sets JWT_SECRET from EMAIL_PASSWORD_JWT_SECRET if JWT_SECRET is not set.
 *
 * Usage: node scripts/run-aperio-backend.js (from backend directory)
 * Or: npm run dev:aperio:backend
 */
import dotenv from "dotenv";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const envPath = path.join(backendRoot, ".env");

dotenv.config({ path: envPath });

if (!process.env.JWT_SECRET && process.env.EMAIL_PASSWORD_JWT_SECRET) {
  process.env.JWT_SECRET = process.env.EMAIL_PASSWORD_JWT_SECRET;
}

if (!process.env.JWT_SECRET) {
  console.warn("⚠️  [aperio] Set JWT_SECRET or EMAIL_PASSWORD_JWT_SECRET in backend/.env to fix 'JWT_SECRET not set'.\n");
}

process.env.NODE_ENV = process.env.NODE_ENV || "development";
// Always use 3001 so Aperio doesn't conflict with main backend on 3000
process.env.PORT = "3001";

const child = spawn(
  "node",
  [path.join(backendRoot, "node_modules", "@echopad", "aperio", "backend", "src", "server.js")],
  {
    cwd: backendRoot,
    env: process.env,
    stdio: "inherit",
    shell: true,
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
