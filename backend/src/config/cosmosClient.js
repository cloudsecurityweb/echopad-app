import { CosmosClient } from "@azure/cosmos";
import { CONTAINERS, getContainerConfig } from "./containers.js";

// Get configuration from environment variables
// These are set in Azure App Service Configuration → Application Settings
// For local development, use a .env file (see .env.example)
const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE || "echopad";
const containerId = process.env.COSMOS_CONTAINER || "users";

// Lazy initialization - don't throw on module load
let client = null;
let database = null;
let container = null;
let containersCache = new Map(); // Cache for multiple containers

/**
 * Check if Cosmos DB is configured
 * @returns {boolean} True if credentials are available
 */
export function isConfigured() {
  return !!(endpoint && key);
}

/**
 * Initialize CosmosDB client (lazy initialization)
 * @returns {CosmosClient|null} The CosmosDB client or null if not configured
 */
function initializeClient() {
  if (!isConfigured()) {
    return null;
  }
  
  if (!client) {
    client = new CosmosClient({
      endpoint,
      key,
      connectionPolicy: {
        requestTimeout: 30000, // 30 seconds for individual requests
        enableEndpointDiscovery: true,
        preferredLocations: [],
      },
    });
    database = client.database(databaseId);
    container = database.container(containerId);
  }
  
  return client;
}

/**
 * Get the CosmosDB container instance
 * @param {string|null} containerName - Optional container name. If not provided, returns the default container from env vars
 * @returns {Container|null} The CosmosDB container or null if not configured
 */
export function getContainer(containerName = null) {
  if (!initializeClient()) {
    return null;
  }
  
  // If no container name provided, return the default container (backward compatibility)
  if (!containerName) {
    return container;
  }
  
  // Check cache first
  if (containersCache.has(containerName)) {
    return containersCache.get(containerName);
  }
  
  // Create and cache new container reference
  const containerInstance = database.container(containerName);
  containersCache.set(containerName, containerInstance);
  return containerInstance;
}

/**
 * Get the CosmosDB database instance
 * @returns {Database|null} The CosmosDB database or null if not configured
 */
export function getDatabase() {
  if (!initializeClient()) {
    return null;
  }
  return database;
}

/**
 * Get the CosmosDB client instance
 * @returns {CosmosClient|null} The CosmosDB client or null if not configured
 */
export function getClient() {
  return initializeClient();
}

/**
 * Test the CosmosDB connection
 * @returns {Promise<boolean>} True if connection is successful, false if not configured or connection failed
 */
export async function testConnection() {
  if (!isConfigured()) {
    console.warn("⚠️  CosmosDB not configured. COSMOS_ENDPOINT and COSMOS_KEY environment variables are required.");
    return false;
  }
  
  try {
    const db = getDatabase();
    if (!db) {
      return false;
    }
    const { resource } = await db.read();
    console.log(`✅ Successfully connected to database: ${resource.id}`);
    return true;
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    return false;
  }
}

/**
 * Ensure all required containers exist in the database
 * Creates containers if they don't exist (non-destructive)
 * @returns {Promise<Object>} Object with success status and details about created/existing containers
 */
export async function ensureContainers() {
  if (!isConfigured()) {
    console.warn("⚠️  CosmosDB not configured. Cannot ensure containers.");
    return { success: false, message: "CosmosDB not configured" };
  }
  
  const db = getDatabase();
  if (!db) {
    return { success: false, message: "Database not available" };
  }
  
  const results = {
    success: true,
    created: [],
    existing: [],
    errors: [],
  };
  
  try {
    // Ensure database exists first
    await db.read().catch(async () => {
      // Database doesn't exist, create it
      await db.createIfNotExists();
      console.log(`✅ Created database: ${databaseId}`);
    });
    
    // Create all containers
    for (const containerId of CONTAINERS) {
      try {
        const containerConfig = getContainerConfig(containerId);
        
        // Try to read the container first to check if it exists
        const container = db.container(containerId);
        let exists = false;
        
        try {
          await container.read();
          exists = true;
          results.existing.push(containerId);
          console.log(`✅ Container exists: ${containerId}`);
        } catch (readError) {
          // Container doesn't exist (404), create it
          if (readError.code === 404) {
            await db.containers.create(containerConfig);
            results.created.push(containerId);
            console.log(`✅ Created container: ${containerId}`);
          } else {
            throw readError;
          }
        }
      } catch (error) {
        console.error(`❌ Error ensuring container ${containerId}:`, error.message);
        results.errors.push({ container: containerId, error: error.message });
      }
    }
    
    if (results.errors.length > 0) {
      results.success = false;
    }
    
    return results;
  } catch (error) {
    console.error("❌ Error ensuring containers:", error.message);
    return { success: false, message: error.message, errors: [error.message] };
  }
}

export default {
  getContainer,
  getDatabase,
  getClient,
  testConnection,
  isConfigured,
  ensureContainers,
};
