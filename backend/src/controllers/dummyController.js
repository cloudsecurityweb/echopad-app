import { getContainer, isConfigured } from "../config/cosmosClient.js";
import { createOrg } from "../services/organizationService.js";
import { createUserRecord } from "../services/userService.js";
import { createProductRecord } from "../services/productService.js";
import { createLicenseRecord } from "../services/licenseService.js";
import { createInvitation } from "../services/inviteService.js";
import { createAuditEvent } from "../models/auditEvent.js";
import { USER_ROLES, USER_STATUS } from "../models/user.js";
import { ORG_TYPES, ORG_STATUS } from "../models/organization.js";
import { PRODUCT_STATUS } from "../models/product.js";
import { LICENSE_STATUS } from "../models/license.js";
import { INVITE_STATUS } from "../models/invite.js";
import { AUDIT_EVENT_TYPES } from "../models/auditEvent.js";
import { randomUUID } from "crypto";

const DEFAULT_TENANT_ID = "tenant_demo";
const AUDIT_CONTAINER_NAME = "auditEvents";

/**
 * Generate a unique dummy ID with timestamp
 */
function generateDummyId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * POST /api/organizations/dummy
 * Create a dummy organization
 */
export async function createDummyOrganization(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const tenantId = req.body.tenantId || DEFAULT_TENANT_ID;
    const orgData = {
      id: req.body.id || generateDummyId("org"),
      tenantId,
      name: req.body.name || `Dummy Organization ${Date.now()}`,
      type: req.body.type || ORG_TYPES.CLIENT,
      status: req.body.status || ORG_STATUS.ACTIVE,
    };

    const organization = await createOrg(orgData, "system_dummy");

    res.status(201).json({
      success: true,
      message: "Dummy organization created successfully",
      data: organization,
    });
  } catch (error) {
    console.error("Error creating dummy organization:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dummy organization",
      message: error.message,
    });
  }
}

/**
 * POST /api/users/dummy
 * Create a dummy user
 */
export async function createDummyUser(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const tenantId = req.body.tenantId || DEFAULT_TENANT_ID;
    const timestamp = Date.now();
    const userData = {
      id: req.body.id || generateDummyId("user"),
      tenantId,
      email: req.body.email || `dummy.user.${timestamp}@example.com`,
      displayName: req.body.displayName || `Dummy User ${timestamp}`,
      role: req.body.role || USER_ROLES.USER,
      status: req.body.status || USER_STATUS.ACTIVE,
      organizationId: req.body.organizationId || null,
    };

    const user = await createUserRecord(userData, "system_dummy");

    res.status(201).json({
      success: true,
      message: "Dummy user created successfully",
      data: user,
    });
  } catch (error) {
    console.error("Error creating dummy user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dummy user",
      message: error.message,
    });
  }
}

/**
 * POST /api/products/dummy
 * Create a dummy product
 */
export async function createDummyProduct(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const tenantId = req.body.tenantId || DEFAULT_TENANT_ID;
    const timestamp = Date.now();
    const productData = {
      id: req.body.id || generateDummyId("product"),
      tenantId,
      name: req.body.name || `Dummy Product ${timestamp}`,
      sku: req.body.sku || `SKU-${timestamp}`,
      status: req.body.status || PRODUCT_STATUS.ACTIVE,
      description: req.body.description || `This is a dummy product created at ${new Date().toISOString()}`,
    };

    const product = await createProductRecord(productData);

    res.status(201).json({
      success: true,
      message: "Dummy product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating dummy product:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dummy product",
      message: error.message,
    });
  }
}

/**
 * POST /api/licenses/dummy
 * Create a dummy license
 */
export async function createDummyLicense(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const tenantId = req.body.tenantId || DEFAULT_TENANT_ID;
    const licenseData = {
      id: req.body.id || generateDummyId("license"),
      tenantId,
      productId: req.body.productId || generateDummyId("product"),
      ownerOrgId: req.body.ownerOrgId || generateDummyId("org"),
      seats: req.body.seats !== undefined ? req.body.seats : 5,
      assignedUserIds: req.body.assignedUserIds || [],
      status: req.body.status || LICENSE_STATUS.ACTIVE,
      expiresAt: req.body.expiresAt || null,
    };

    const license = await createLicenseRecord(licenseData, "system_dummy");

    res.status(201).json({
      success: true,
      message: "Dummy license created successfully",
      data: license,
    });
  } catch (error) {
    console.error("Error creating dummy license:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dummy license",
      message: error.message,
    });
  }
}

/**
 * POST /api/invites/dummy
 * Create a dummy invite
 */
export async function createDummyInvite(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const tenantId = req.body.tenantId || DEFAULT_TENANT_ID;
    const timestamp = Date.now();
    const inviteData = {
      id: req.body.id || generateDummyId("invite"),
      tenantId,
      email: req.body.email || `dummy.invite.${timestamp}@example.com`,
      role: req.body.role || "user",
      token: req.body.token || `inv_${timestamp}_${randomUUID().replace(/-/g, "")}`,
      createdBy: req.body.createdBy || "system_dummy",
      organizationId: req.body.organizationId || null,
      status: req.body.status || INVITE_STATUS.PENDING,
      expiresAt: req.body.expiresAt || null, // Will default to 7 days in createInvite
    };

    const invite = await createInvitation(inviteData, "system_dummy");

    res.status(201).json({
      success: true,
      message: "Dummy invite created successfully",
      data: invite,
    });
  } catch (error) {
    console.error("Error creating dummy invite:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dummy invite",
      message: error.message,
    });
  }
}

/**
 * POST /api/auditEvents/dummy
 * Create a dummy audit event
 */
export async function createDummyAuditEvent(req, res) {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      error: "CosmosDB not configured",
      message: "COSMOS_ENDPOINT and COSMOS_KEY environment variables are required",
    });
  }

  try {
    const tenantId = req.body.tenantId || DEFAULT_TENANT_ID;
    const auditEventData = {
      id: req.body.id || generateDummyId("audit"),
      tenantId,
      type: req.body.type || AUDIT_EVENT_TYPES.USER_CREATED,
      actorUserId: req.body.actorUserId || "system_dummy",
      details: req.body.details || { message: "Dummy audit event created for testing" },
    };

    const auditEvent = createAuditEvent(auditEventData);
    const container = getContainer(AUDIT_CONTAINER_NAME);

    if (!container) {
      return res.status(503).json({
        success: false,
        error: "CosmosDB container not available",
      });
    }

    const { resource } = await container.items.create(auditEvent);

    res.status(201).json({
      success: true,
      message: "Dummy audit event created successfully",
      data: resource,
    });
  } catch (error) {
    console.error("Error creating dummy audit event:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create dummy audit event",
      message: error.message,
    });
  }
}
