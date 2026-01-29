import { CosmosClient } from "@azure/cosmos";

// Get connection string from Vite environment variables
// Vite only exposes variables prefixed with VITE_ to the client
const connectionString = import.meta.env.VITE_COSMOS_CONNECTION_STRING;

// Initialize client, database, and container lazily
let client = null;
let database = null;
let container = null;
let isInitialized = false;
let initializationError = null;

/**
 * Initialize Cosmos DB connection
 * This function should be called on app startup
 */
export function initializeCosmosDB() {
  if (isInitialized) {
    return { client, database, container, error: initializationError };
  }

  if (!connectionString) {
    const error = new Error(
      "VITE_COSMOS_CONNECTION_STRING environment variable is not set. " +
      "Please create a .env file with your connection string."
    );
    console.warn("⚠️ Cosmos DB:", error.message);
    initializationError = error;
    isInitialized = true;
    return { client: null, database: null, container: null, error };
  }

  try {
    client = new CosmosClient(connectionString);
    database = client.database("cosmicworks");
    container = database.container("products");
    isInitialized = true;
    initializationError = null;
    return { client, database, container, error: null };
  } catch (error) {
    console.error("❌ Failed to initialize Cosmos DB client:", error.message);
    initializationError = error;
    isInitialized = true;
    return { client: null, database: null, container: null, error };
  }
}

/**
 * Test Cosmos DB connection
 * @returns {Promise<boolean>} True if connection is successful
 */
export async function testConnection() {
  if (!isInitialized) {
    initializeCosmosDB();
  }

  if (!database || initializationError) {
    console.error("❌ Cosmos DB not initialized:", initializationError?.message || "Unknown error");
    return false;
  }

  try {
    const { resource: db } = await database.read();
    console.log("✅ Successfully connected to database:", db.id);
    return true;
  } catch (error) {
    console.error("❌ Connection test failed:", error.message);
    return false;
  }
}

/**
 * Get Cosmos DB client (lazy initialization)
 * @returns {CosmosClient|null} Cosmos client or null if not initialized
 */
export function getClient() {
  if (!isInitialized) {
    initializeCosmosDB();
  }
  return client;
}

/**
 * Get Cosmos DB database (lazy initialization)
 * @returns {Database|null} Database or null if not initialized
 */
export function getDatabase() {
  if (!isInitialized) {
    initializeCosmosDB();
  }
  return database;
}

/**
 * Get Cosmos DB container (lazy initialization)
 * @returns {Container|null} Container or null if not initialized
 */
export function getContainer() {
  if (!isInitialized) {
    initializeCosmosDB();
  }
  return container;
}

/**
 * Check if Cosmos DB is properly initialized
 * @returns {boolean} True if initialized successfully
 */
export function isCosmosDBInitialized() {
  return isInitialized && client !== null && !initializationError;
}
