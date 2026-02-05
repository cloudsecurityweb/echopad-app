/**
 * Test script for dummy data endpoints
 * 
 * Usage: node test-dummy-endpoints.js
 * 
 * This script tests all dummy data endpoints to verify they're working
 */

import "./src/config/index.js";

const BASE_URL = process.env.API_URL || "http://localhost:3000";

const endpoints = [
  { path: "/api/organizations/dummy", method: "POST", name: "Organization" },
  { path: "/api/users/dummy", method: "POST", name: "User" },
  { path: "/api/products/dummy", method: "POST", name: "Product" },
  { path: "/api/licenses/dummy", method: "POST", name: "License" },
  { path: "/api/invites/dummy", method: "POST", name: "Invite" },
  { path: "/api/auditEvents/dummy", method: "POST", name: "Audit Event" },
];

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint.path}`, {
      method: endpoint.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenantId: "tenant_demo",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`✅ ${endpoint.name}: Created successfully`);
      console.log(`   ID: ${data.data?.id}`);
      console.log(`   Tenant: ${data.data?.tenantId}`);
      return { success: true, data: data.data };
    } else {
      console.error(`❌ ${endpoint.name}: Failed`);
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${data.error || data.message}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.error(`❌ ${endpoint.name}: Request failed`);
    console.error(`   Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testAllEndpoints() {
  console.log("🧪 Testing dummy data endpoints...\n");
  console.log(`Base URL: ${BASE_URL}\n`);

  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push({ endpoint: endpoint.name, ...result });
    console.log(""); // Empty line for readability
  }

  // Summary
  console.log("📊 Summary:");
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  console.log(`   ✅ Successful: ${successful}/${results.length}`);
  console.log(`   ❌ Failed: ${failed}/${results.length}`);

  if (failed > 0) {
    console.log("\n⚠️  Some endpoints failed. Check:");
    console.log("   1. Server is running (node src/server.js)");
    console.log("   2. NODE_ENV is not set to 'production'");
    console.log("   3. CosmosDB is configured (COSMOS_ENDPOINT and COSMOS_KEY)");
    console.log("   4. Containers exist in CosmosDB");
  } else {
    console.log("\n✅ All endpoints working! Check CosmosDB for the created data.");
    console.log("   Look in containers: organizations, users, products, licenses, invites, auditEvents");
    console.log("   Filter by tenantId: 'tenant_demo'");
  }
}

// Run tests
testAllEndpoints().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
