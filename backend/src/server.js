// Load environment variables FIRST before any other imports
import "./config/index.js";

import express from "express";
import cors from "cors";
import { testConnection, isConfigured, ensureContainers } from "./config/cosmosClient.js";
import { startWarmup } from "./services/cosmosWarmup.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (email assets)
app.use('/public', express.static(path.join(__dirname, 'public')));

// CORS Configuration
// Allow requests from localhost (development) and production frontend URL
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const allowedOrigins = [
  "http://localhost:5173", // Default Vite dev server
  "http://localhost:3000", // Alternative dev port
  "http://localhost", // Localhost without port
  "https://labs.echopad.ai", // Development frontend URL
  FRONTEND_URL, // Production frontend URL
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
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  preflightContinue: false,
  optionsSuccessStatus: 204, // Some legacy browsers (IE11, various SmartTVs) choke on 204
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
        "https://widget.intercom.io",
        "https://js.intercomcdn.com",
        "https://alcdn.msauth.net",
        "https://*.b2clogin.com"
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
        "https://login.microsoftonline.com",
        "https://graph.microsoft.com",
        "https://*.b2clogin.com",
        "https://www.google-analytics.com",
        "https://api-iam.intercom.io",
        "wss://nexus-websocket-a.intercom.io"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net"
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
