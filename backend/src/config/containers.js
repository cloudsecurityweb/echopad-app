/**
 * Cosmos DB Container Configuration
 * 
 * Defines all containers that should be created in the Cosmos DB database.
 * All containers use partition key "/tenantId" for multi-tenant isolation.
 */

export const CONTAINERS = [
  "organizations",
  "users", // Kept for backward compatibility
  "superAdmins",
  "clientAdmins",
  "userAdmins",
  "invites",
  "products",
  "licenses",
  "auditEvents",
  "emailVerifications",

  // NEW
  "clients",
  "licenseAssignments",
  "orgProducts",
  "userLicenses",
  "analyticsEvents",
  "dashboardMetrics",
  "helpCenterDocs",
  "clientFeedback",
];

/**
 * Default partition key for all containers (multi-tenant isolation)
 */
export const DEFAULT_PARTITION_KEY = "/tenantId";

/**
 * Container-specific partition key mappings
 * If a container needs a different partition key, add it here
 */
const CONTAINER_PARTITION_KEYS = {
  organizations: "/tenantId",
  users: "/tenantId", // Kept for backward compatibility
  superAdmins: "/tenantId",
  clientAdmins: "/tenantId",
  userAdmins: "/tenantId",
  invites: "/tenantId",
  products: "/tenantId",
  licenses: "/tenantId",
  auditEvents: "/tenantId",
  emailVerifications: "/tenantId",

   // NEW
  clients: "/tenantId",
  licenseAssignments: "/tenantId",
  orgProducts: "/tenantId",
  userLicenses: "/tenantId",
  analyticsEvents: "/tenantId",
  dashboardMetrics: "/tenantId",
  helpCenterDocs: "/tenantId",
  clientFeedback: "/tenantId",
};

/**
 * Get container configuration for Cosmos DB
 * @param {string} containerId - The container ID
 * @returns {Object} Container configuration with partition key
 */
export function getContainerConfig(containerId) {
  const partitionKey = CONTAINER_PARTITION_KEYS[containerId] || DEFAULT_PARTITION_KEY;
  
  return {
    id: containerId,
    partitionKey: {
      paths: [partitionKey],
    },
  };
}
