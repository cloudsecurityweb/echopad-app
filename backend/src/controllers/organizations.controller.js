import { getOrganizations, updateOrg, getOrganizationsDetails } from "../services/organizationService.js";
import { ORG_TYPES } from "../models/organization.js";
import { isConfigured } from "../config/cosmosClient.js";

/**
 * GET /api/organizations
 * Super Admin: list all client organizations (optionally filter)
 */
export async function listOrganizations(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User information not available",
      });
    }

    const isSuperAdmin = req.currentUser.role === "superAdmin";
    if (!isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Super Admin access required",
      });
    }

    const organizations = await getOrganizations({
      type: req.query.type || ORG_TYPES.CLIENT,
      status: req.query.status || null,
      search: req.query.search || null,
    });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch organizations",
      message: error.message,
    });
  }
}

/**
 * GET /api/organizations/details
 * Super Admin: list all client organizations with product and license details
 */
export async function listOrganizationsDetails(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    if (!req.currentUser) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
        message: "User information not available",
      });
    }

    const isSuperAdmin = req.currentUser.role === "superAdmin";
    if (!isSuperAdmin) {
      return res.status(403).json({
        success: false,
        error: "Forbidden",
        message: "Super Admin access required",
      });
    }

    const organizations = await getOrganizationsDetails({
      type: req.query.type || ORG_TYPES.CLIENT,
      status: req.query.status || null,
      search: req.query.search || null,
    });

    return res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch organizations details",
      message: error.message,
    });
  }
}

/**
 * GET /api/organizations/:orgId
 * Get an organization by ID
 */
export async function getOrganization(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  try {
    const { orgId } = req.params;
    const organizations = await getOrganizations({ organizationId: orgId });

    if (!organizations.length) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Organization not found",
      });
    }
    res.status(200).json({
      success: true,
      data: organizations[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch organization",
      message: error.message,
    });
  }
}

/**
 * PATCH /api/organizations/:orgId
 * Update an organization
 */
export async function updateOrganization(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }
  try {
    const { orgId } = req.params;
    const updates = req.body;

    // First, get the organization to find its tenantId
    const organizations = await getOrganizations({ organizationId: orgId });
    if (!organizations.length) {
      return res.status(404).json({
        success: false,
        error: "Not Found",
        message: "Organization not found",
      });
    }

    const { tenantId } = organizations[0];
    // TODO: get actor user ID from auth context
    const actorUserId = "system";

    const updatedOrganization = await updateOrg(orgId, tenantId, updates, actorUserId);
    res.status(200).json({
      success: true,
      data: updatedOrganization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update organization",
      message: error.message,
    });
  }
}
