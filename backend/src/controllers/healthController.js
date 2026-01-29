import { testConnection, isConfigured, getContainer } from "../config/cosmosClient.js";
import { warmupNow } from "../services/cosmosWarmup.js";

/**
 * GET /health/warmup
 * Warmup endpoint - keeps Cosmos DB connection warm
 * Can be called periodically (e.g., every 5 minutes) to prevent cold starts
 */
export async function warmup(req, res) {
  const timestamp = new Date().toISOString();
  
  if (!isConfigured()) {
    return res.status(503).json({
      status: "error",
      message: "CosmosDB not configured",
      timestamp,
    });
  }
  
  try {
    await warmupNow();
    return res.status(200).json({
      status: "success",
      message: "Cosmos DB warmed up successfully",
      timestamp,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Warmup failed",
      error: error.message,
      timestamp,
    });
  }
}

/**
 * GET /health
 * Health check endpoint
 */
export async function healthCheck(req, res) {
  const timestamp = new Date().toISOString();
  
  // Server is always healthy if it can respond
  const response = {
    status: "healthy",
    message: "Server is running",
    timestamp,
    cosmosdb: {
      configured: isConfigured(),
      connected: false,
    },
  };
  
  // Test Cosmos DB connection only if configured
  if (isConfigured()) {
    try {
      // Perform warmup first (lightweight, keeps connection alive)
      await warmupNow().catch(() => {
        // Ignore warmup errors
      });
      
      const isConnected = await testConnection();
      response.cosmosdb.connected = isConnected;
      
      if (isConnected) {
        response.message = "Server is running and connected to CosmosDB";
      } else {
        response.message = "Server is running but CosmosDB connection failed";
        // Still return 200 - server is healthy, just DB connection issue
      }
    } catch (error) {
      response.cosmosdb.connected = false;
      response.message = `Server is running but CosmosDB connection error: ${error.message}`;
      // Still return 200 - server is healthy
    }
  } else {
    response.message = "Server is running (CosmosDB not configured)";
  }
  
  res.status(200).json(response);
}

/**
 * GET /health/cosmos
 * Test Cosmos DB container by creating and reading a test item
 */
export async function testCosmosContainer(req, res) {
  const timestamp = new Date().toISOString();
  
  if (!isConfigured()) {
    return res.status(503).json({
      status: "error",
      message: "CosmosDB not configured",
      timestamp,
    });
  }
  
  try {
    // Use users container for testing (it should exist)
    const testContainer = getContainer("users");
    if (!testContainer) {
      return res.status(503).json({
        status: "error",
        message: "Test container not available",
        timestamp,
      });
    }
    
    // Create a test item with tenantId (required for partition key)
    const testItem = {
      id: `test-${Date.now()}`,
      tenantId: "test_tenant", // Required for partition key /tenantId
      type: "test",
      message: "Cosmos DB test item",
      timestamp,
      createdAt: new Date().toISOString(),
    };
    
    // Insert the test item
    const { resource: createdItem } = await testContainer.items.create(testItem);
    
    // Read it back using tenantId as partition key
    const { resource: readItem } = await testContainer.item(testItem.id, testItem.tenantId).read();
    
    // Clean up - delete the test item
    await testContainer.item(testItem.id, testItem.tenantId).delete().catch(() => {
      // Ignore cleanup errors
    });
    
    return res.status(200).json({
      status: "success",
      message: "Cosmos DB test container is working correctly",
      timestamp,
      test: {
        created: !!createdItem,
        read: !!readItem,
        itemId: testItem.id,
        cleanup: "completed",
      },
    });
  } catch (error) {
    console.error("❌ Cosmos DB test failed:", error);
    return res.status(500).json({
      status: "error",
      message: "Cosmos DB test failed",
      error: error.message,
      timestamp,
    });
  }
}
