/**
 * Setup script to ensure CosmosDB database and containers exist
 * 
 * Usage: node setup-cosmos.js
 */

import "./src/config/index.js";
import { ensureContainers, isConfigured, testConnection } from "./src/config/cosmosClient.js";

async function setup() {
  console.log("🔧 Setting up CosmosDB...\n");

  if (!isConfigured()) {
    console.error("❌ CosmosDB not configured!");
    console.log("\nPlease set the following environment variables:");
    console.log("  - COSMOS_ENDPOINT");
    console.log("  - COSMOS_KEY");
    console.log("  - COSMOS_DATABASE (optional, defaults to 'echopad')");
    process.exit(1);
  }

  console.log("✅ CosmosDB is configured\n");

  // Test connection first
  console.log("📡 Testing connection...");
  const connected = await testConnection();
  if (!connected) {
    console.error("❌ Failed to connect to CosmosDB");
    console.log("\nPlease check:");
    console.log("  1. COSMOS_ENDPOINT is correct");
    console.log("  2. COSMOS_KEY is correct");
    console.log("  3. Network connectivity to Azure");
    process.exit(1);
  }
  console.log("✅ Connection successful\n");

  // Ensure containers exist
  console.log("📦 Ensuring containers exist...");
  const result = await ensureContainers();

  if (result.success) {
    console.log("\n✅ Setup complete!");
    console.log(`   Created: ${result.created.length} containers`);
    console.log(`   Existing: ${result.existing.length} containers`);
    
    if (result.errors.length > 0) {
      console.log(`\n⚠️  ${result.errors.length} error(s) occurred:`);
      result.errors.forEach((err) => {
        console.log(`   - ${err.container}: ${err.error}`);
      });
    }

    console.log("\n📋 Available containers:");
    const allContainers = [...result.created, ...result.existing];
    allContainers.forEach((name) => {
      console.log(`   - ${name}`);
    });

    console.log("\n✨ You can now use the dummy data endpoints!");
    console.log("   Example: POST http://localhost:3000/api/users/dummy");
  } else {
    console.error("\n❌ Setup failed!");
    console.error(`   Error: ${result.message}`);
    if (result.errors && result.errors.length > 0) {
      result.errors.forEach((err) => {
        console.error(`   - ${err.container || 'unknown'}: ${err.error}`);
      });
    }
    process.exit(1);
  }
}

setup().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
