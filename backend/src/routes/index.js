import express from "express";
import { healthCheck, testCosmosContainer, warmup } from "../controllers/healthController.js";
import { ensureContainers } from "../config/cosmosClient.js";
import usersRouter from "./users.js";
import organizationsRouter from "./organizations.js";
// import productsRouter from "./products.js";
// import licensesRouter from "./licenses.js";
import invitesRouter from "./invites.js";
import auditEventsRouter from "./auditEvents.js";
import authRouter from "./auth.js";

// NEW feature routes (Dashboard / Clients / Usage / Feedback)
import dashboardRouter from "./dashboard.routes.js";
import clientsRouter from "./clients.routes.js";
import licenseRouter from "./licenseAssignments.routes.js";
import productsRouter from "./products.routes.js";
import analyticsRouter from "./analytics.routes.js";
import helpCenterRouter from "./helpCenter.routes.js";
import clientFeedbackRouter from "./clientFeedback.routes.js";
import orgProductsRouter from "./orgProducts.routes.js";
import licensesRouter from "./licenses.routes.js";
import userProductRouter from "./userProduct.routes.js";
import userLicensesRouter from "./userLicenses.routes.js";
import transcriptionHistoryRouter from "./transcriptionHistory.routes.js";
import { seedSaasDemoData } from "../services/seed-saas-data.js";

const router = express.Router();

/**
 * GET /
 * Root endpoint - API information
 */
router.get("/", (req, res) => {
  res.json({
    name: "Echopad Backend API",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      cosmosTest: "/health/cosmos",
      setupContainers: "POST /health/containers",
      users: "/api/users",
      auth: {
        signIn: "POST /api/auth/sign-in",
        signUp: "POST /api/auth/sign-up",
        me: "GET /api/auth/me",
        note: "All auth endpoints require Authorization: Bearer <token> header",
      },
      dummy: {
        organizations: "/api/organizations/dummy",
        users: "/api/users/dummy",
        products: "/api/products/dummy",
        licenses: "/api/licenses/dummy",
        invites: "/api/invites/dummy",
        auditEvents: "/api/auditEvents/dummy",
        note: "Dummy endpoints are only available in development mode (NODE_ENV !== 'production')",
      },

      analytics: {
        dashboardMetrics: "/api/dashboard/metrics",
        superAdmin: "/api/analytics/super-admin",
        clients: "/api/clients",
        licenses: "/api/licenses",
        usersProfile: "/api/users/profile/:tenantId/:userId",
        products: "/api/products",
        helpCenter: "/api/help-center",
        clientFeedback: "/api/client-feedback",
        transcriptionHistory: "/api/transcription-history",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /health
 * Health check endpoint
 */
router.get("/health", healthCheck);

/**
 * GET /health/cosmos
 * Test Cosmos DB container endpoint
 */
router.get("/health/cosmos", testCosmosContainer);

/**
 * GET /health/warmup
 * Warmup endpoint - keeps Cosmos DB connection warm
 * Can be called periodically to prevent cold starts
 */
router.get("/health/warmup", warmup);
router.post("/seed-demo", async (req, res) => {
  try {
    const result = await seedSaasDemoData();
    res.json({ message: "Seed successful", result });
  } catch (err) {
    res.status(500).json({ message: "Seed failed", error: err.message });
  }
});

/**
 * POST /health/containers
 * Manually trigger container creation/verification
 */
router.post("/health/containers", async (req, res) => {
  try {
    const result = await ensureContainers();
    res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.message || "Container check completed",
      created: result.created || [],
      existing: result.existing || [],
      errors: result.errors || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to ensure containers",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Mount user routes
 */
router.use("/api/users", usersRouter);

/**
 * Mount organization routes
 */
router.use("/api/organizations", organizationsRouter);

/**
 * Mount product routes
 */
// router.use("/api/products", productsRouter);

/**
 * Mount license routes
 */
// router.use("/api/licenses", licensesRouter);

/**
 * Mount invite routes
 */
router.use("/api/invites", invitesRouter);

/**
 * Mount audit event routes
 */
router.use("/api/auditEvents", auditEventsRouter);


/* =========================
   DASHBOARD & ANALYTICS
========================= */
router.use("/api/auth", authRouter);
router.use("/api/dashboard", dashboardRouter);   // /metrics
router.use("/api/clients", clientsRouter);       // GET, POST
router.use("/api/license-assignments", licenseRouter);      // GET
router.use("/api/products", productsRouter); // GET
router.use("/api/org-products", orgProductsRouter);
router.use("/api/licenses", licensesRouter);
router.use("/api/user-licenses", userLicensesRouter);
router.use("/api/user-products", userProductRouter);
router.use("/api/analytics", analyticsRouter); // GET
router.use("/api/help-center", helpCenterRouter); // GET, POST, PATCH
router.use("/api/client-feedback", clientFeedbackRouter); // GET, POST, PATCH
router.use("/api/transcription-history", transcriptionHistoryRouter); // GET, POST

export default router;
