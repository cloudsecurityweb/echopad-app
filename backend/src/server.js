// Load environment variables FIRST before any other imports
import "./config/index.js";

import express from "express";
import cors from "cors";
import { testConnection, isConfigured, ensureContainers } from "./config/cosmosClient.js";
import { startWarmup } from "./services/cosmosWarmup.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { verifyAnyAuth } from "./middleware/auth.js";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (email assets)
app.use('/public', express.static(path.join(__dirname, 'public')));

// Aperio: mounted after async load below (either echopad-aperio router or static + stub)

// CORS Configuration
// Allow requests from localhost (development) and production frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost",
  "https://labs.echopad.ai",
  "https://www.labs.echopad.ai",
  "https://echopad.ai",
  "https://www.echopad.ai",
  "https://polite-ground-0602c481e.2.azurestaticapps.net",
  "https://www.polite-ground-0602c481e.2.azurestaticapps.net",
  "https://calm-smoke-0ef35d31e.4.azurestaticapps.net",
  "https://www.calm-smoke-0ef35d31e.4.azurestaticapps.net",
  FRONTEND_URL,
].filter(Boolean); // Remove any undefined values

// Remove duplicates and normalize (remove trailing slashes)
const uniqueOrigins = [...new Set(allowedOrigins.map(url => url.replace(/\/$/, '')))];

console.log(`🌐 [CORS] Configured allowed origins: ${uniqueOrigins.join(", ")}`);
console.log(`🌐 [CORS] FRONTEND_URL from env: ${FRONTEND_URL}`);

const corsOptions = {
  origin: function (origin, callback) {
    // Log CORS check for debugging
    console.log(`🔍 [CORS] Request from origin: ${origin || 'no origin'}`);
    console.log(`🔍 [CORS] Allowed origins: ${uniqueOrigins.join(", ")}`);
    console.log(`🔍 [CORS] NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log(`✅ [CORS] Allowing request with no origin`);
      return callback(null, true);
    }

    // Normalize origin (remove trailing slash for comparison)
    const normalizedOrigin = origin.replace(/\/$/, '');

    // Check if origin is in allowed list (exact match or normalized)
    if (uniqueOrigins.includes(origin) || uniqueOrigins.includes(normalizedOrigin)) {
      console.log(`✅ [CORS] Origin ${origin} is allowed`);
      callback(null, true);
    } else {
      // In development or if NODE_ENV is not production, be more permissive
      if (process.env.NODE_ENV !== "production") {
        console.warn(`⚠️  [CORS] Allowing origin ${origin} (non-production mode)`);
        callback(null, true);
      } else {
        // In production, check if it's close match (same domain, different protocol/port)
        const originHost = new URL(origin).hostname;
        const allowedHosts = uniqueOrigins.map(url => {
          try {
            return new URL(url).hostname;
          } catch {
            return url;
          }
        });

        if (allowedHosts.includes(originHost)) {
          console.log(`✅ [CORS] Allowing origin ${origin} (hostname match: ${originHost})`);
          callback(null, true);
        } else {
          // In production, only allow exact matches
          console.error(`❌ [CORS] Blocked request from origin ${origin}. Allowed origins: ${uniqueOrigins.join(", ")}`);
          callback(new Error("Not allowed by CORS"));
        }
      }
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  exposedHeaders: ["Content-Range", "X-Content-Range", "Content-Disposition", "Content-Type", "Content-Length"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

import helmet from "helmet";

// ... imports

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://www.googletagmanager.com",
        "https://www.google-analytics.com",
        "https://widget.intercom.io",
        "https://js.intercomcdn.com",
        "https://alcdn.msauth.net",
        "https://*.b2clogin.com",
        "https://accounts.google.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: [
        "'self'",
        "http://localhost:*",
        "ws://localhost:*",
        "https://polite-ground-0602c481e.2.azurestaticapps.net",
        "https://www.polite-ground-0602c481e.2.azurestaticapps.net",
        "https://calm-smoke-0ef35d31e.4.azurestaticapps.net",
        "https://www.calm-smoke-0ef35d31e.4.azurestaticapps.net",
        "https://labs.echopad.ai",
        "https://www.labs.echopad.ai",
        "https://echopad.ai",
        "https://www.echopad.ai",
        "https://login.microsoftonline.com",
        "https://graph.microsoft.com",
        "https://*.b2clogin.com",
        "https://www.google-analytics.com",
        "https://analytics.google.com",
        "https://www.googletagmanager.com",
        "https://api-iam.intercom.io",
        "wss://*.intercom.io",
        "wss://*.intercom-messenger.com",
        "https://cdn.jsdelivr.net",
        "https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net",
        "https://echopad-prod-api.azurewebsites.net"
      ],
      mediaSrc: ["'self'", "https://js.intercomcdn.com"],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://fonts.intercomcdn.com"
      ],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Set Permissions-Policy header
app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=(), fullscreen=(self)"
  );
  next();
});

app.use(cors(corsOptions));
app.use(express.json());

/** Load Aperio (backend + frontend from @echopad/aperio) and mount at /aperio. Single App Service in production. */
async function mountAperio() {
  const publicAperio = path.join(__dirname, 'public', 'aperio');
  const aperioIndex = path.join(publicAperio, 'index.html');

  // Aperio auth middleware expects JWT_SECRET to verify email/password tokens. Use main app's secret when not set.
  if (!process.env.JWT_SECRET && process.env.EMAIL_PASSWORD_JWT_SECRET) {
    process.env.JWT_SECRET = process.env.EMAIL_PASSWORD_JWT_SECRET;
  }

  // Serve static Aperio assets and SPA shell from backend/src/public/aperio.
  // This ensures index.html, JS, and CSS under /aperio/assets/* are served
  // even when @echopad/aperio router is mounted for API routes.
  app.use('/aperio', express.static(publicAperio));

  // Serve SPA shell for GET /aperio, /aperio/, and client-side routes like /aperio/dashboard/aperio/.
  if (fs.existsSync(aperioIndex)) {
    app.get('/aperio', (req, res) => res.sendFile(aperioIndex));
    app.get('/aperio/', (req, res) => res.sendFile(aperioIndex));
    app.get('/aperio/*', (req, res, next) => {
      // Let API routes fall through to the Aperio router; serve index.html for SPA client routes.
      if (req.path.startsWith('/api')) return next();
      return res.sendFile(aperioIndex);
    });
  }

  try {
    const { default: aperioRouter } = await import('@echopad/aperio');

    // Log Aperio API requests and errors so you can check backend logs for /aperio/* and /api/aperio/*
    app.use('/aperio', (req, res, next) => {
      const isApi = req.path.includes('/api') || req.path === '/health';
      if (isApi) {
        const hasAuth = !!(req.headers.authorization && req.headers.authorization.startsWith('Bearer '));
        const start = Date.now();
        const onFinish = () => {
          res.removeListener('finish', onFinish);
          const duration = Date.now() - start;
          const status = res.statusCode;
          const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'log';
          console[level](`[aperio] ${req.method} ${req.originalUrl} ${status} ${duration}ms hasAuth=${hasAuth}`);
        };
        res.on('finish', onFinish);
      }
      next();
    });

    app.use('/aperio', aperioRouter);

    // Helper route to verify token flow: GET /api/aperio/health-auth returns current user from Bearer token (all providers)
    app.get('/api/aperio/health-auth', verifyAnyAuth, (req, res) => {
      const auth = req.auth || {};
      res.json({
        success: true,
        userId: auth.oid || null,
        email: auth.email || null,
        provider: auth.provider || null,
      });
    });

    // Also serve Aperio API at /api/aperio/* so frontend can call /api/aperio/transfers (path the Aperio app expects)
    app.use('/api/aperio', (req, res, next) => {
      req.url = '/api/aperio' + (req.url || '');
      next();
    }, aperioRouter);

    console.log('✅ [aperio] Mounted @echopad/aperio at /aperio (API + static from package)');
  } catch (err) {
    console.warn('[aperio] @echopad/aperio not loaded, using static build + stub:', err.message);
    const { stubRouter } = await import('./routes/aperio.js');
    app.use('/aperio', stubRouter);
  }
}

await mountAperio();

// Routes
app.use(routes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use(notFound);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);

  // Test Cosmos DB connection and ensure containers on startup (non-blocking)
  if (isConfigured()) {
    testConnection()
      .then(async (connected) => {
        if (connected) {
          console.log("📦 Ensuring Cosmos DB containers exist...");
          const result = await ensureContainers();
          if (result.success) {
            console.log(`✅ Containers ready: ${result.existing.length} existing, ${result.created.length} created`);
            if (result.errors.length > 0) {
              console.warn(`⚠️  Some containers had errors: ${result.errors.length}`);
            }

            // Start warmup service to prevent cold starts
            // Runs every 5 minutes to keep Cosmos DB serverless account warm
            startWarmup(5);
          } else {
            console.error("❌ Failed to ensure containers:", result.message);
          }
        }
      })
      .catch((error) => {
        console.error("⚠️  CosmosDB connection test failed on startup:", error.message);
      });
  } else {
    console.warn("⚠️  CosmosDB not configured. Set COSMOS_ENDPOINT and COSMOS_KEY environment variables to enable database features.");
  }
});
