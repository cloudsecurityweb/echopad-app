/**
 * Quick test for a single dummy endpoint
 * Usage: node test-single-endpoint.js
 */

import "./src/config/index.js";

const BASE_URL = process.env.API_URL || "http://localhost:3000";
const ENDPOINT = process.argv[2] || "/api/users/dummy";

async function test() {
  console.log(`Testing: ${ENDPOINT}`);
  console.log(`URL: ${BASE_URL}${ENDPOINT}\n`);

  try {
    const response = await fetch(`${BASE_URL}${ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tenantId: "tenant_demo",
      }),
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log("\n Success! Data should be in CosmosDB.");
      console.log(`   Container: ${getContainerName(ENDPOINT)}`);
      console.log(`   Item ID: ${data.data?.id}`);
      console.log(`   Tenant ID: ${data.data?.tenantId}`);
      console.log("\nTo view in CosmosDB:");
      console.log(`   1. Go to Azure Portal → Data Explorer`);
      console.log(`   2. Select container: ${getContainerName(ENDPOINT)}`);
      console.log(`   3. Run query: SELECT * FROM c WHERE c.tenantId = "tenant_demo"`);
    } else {
      console.log("\n Failed!");
      if (response.status === 403) {
        console.log("   Error: Endpoint is blocked (NODE_ENV is 'production')");
      } else if (response.status === 503) {
        console.log("   Error: CosmosDB not configured");
        console.log("   Check: COSMOS_ENDPOINT and COSMOS_KEY environment variables");
      }
    }
  } catch (error) {
    console.error(" Request failed:", error.message);
    console.log("\nMake sure:");
    console.log("  1. Server is running (npm start)");
    console.log("  2. Server is accessible at", BASE_URL);
  }
}

function getContainerName(endpoint) {
  const mapping = {
    "/api/organizations/dummy": "organizations",
    "/api/users/dummy": "users",
    "/api/products/dummy": "products",
    "/api/licenses/dummy": "licenses",
    "/api/invites/dummy": "invites",
    "/api/auditEvents/dummy": "auditEvents",
  };
  return mapping[endpoint] || "unknown";
}

test();
