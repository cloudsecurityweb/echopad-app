/**
 * Seed Cosmos DB with demo SaaS data for client admin dashboard.
 * Can be triggered via API or CLI.
 */

import "../config/index.js";
import {
  ensureContainers,
  isConfigured,
  getContainer,
} from "../config/cosmosClient.js";

import {
  createOrganization,
  ORG_STATUS,
  ORG_TYPES,
} from "../models/organization.js";

import {
  createUser,
  USER_ROLES,
  USER_STATUS,
  getContainerNameByRole,
} from "../models/user.js";

import {
  createOrgProduct,
  ORG_PRODUCT_STATUS,
} from "../models/orgProduct.js";

import {
  createLicense,
  LICENSE_STATUS,
  LICENSE_TYPES,
} from "../models/license.js";

import {
  createAnalyticsEvent,
  ANALYTICS_EVENT_TYPES,
} from "../models/analyticsEvent.js";

import { assignLicenseToUser } from "./userLicenseService.js";

const TENANT_ID = "9188040d-6c67-4c5b-b112-36a304b66dad";
const SYSTEM_USER_ID = "system_seed";

/* -------------------- helpers (unchanged) -------------------- */

async function upsert(containerName, item) {
  const container = getContainer(containerName);
  if (!container) {
    throw new Error(`Cosmos DB container '${containerName}' not available`);
  }
  await container.items.upsert(item);
  return item;
}

async function upsertOrganization(payload) {
  return upsert("organizations", createOrganization(payload));
}

async function upsertUser(payload) {
  const user = createUser(payload);
  return upsert(getContainerNameByRole(user.role), user);
}

async function upsertProduct(payload) {
  const now = new Date().toISOString();
  return upsert("products", {
    id: payload.productCode,
    productCode: payload.productCode,
    name: payload.name,
    description: payload.description || "",
    endpoint: payload.endpoint || "",
    status: payload.status || "ACTIVE",
    createdAt: payload.createdAt || now,
    updatedAt: now,
    entityType: "product",
  });
}

async function upsertOrgProduct(payload) {
  return upsert("orgProducts", createOrgProduct(payload));
}

async function upsertLicense(payload) {
  return upsert("licenses", createLicense(payload));
}

async function upsertAnalyticsEvent(payload) {
  return upsert("analyticsEvents", createAnalyticsEvent(payload));
}

function daysFromNow(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

/* ============================================================ */
/* ===================== MAIN SEED FUNCTION =================== */
/* ============================================================ */

export async function seedSaasDemoData() {
  console.log("🌱 Seeding demo SaaS data...");

  if (!isConfigured()) {
    throw new Error("CosmosDB not configured");
  }

  await ensureContainers();

  /* -------------------- Organizations -------------------- */
  const organizations = [
    { id: "org_echopad", tenantId: TENANT_ID, name: "Echopad HQ", type: ORG_TYPES.SUPER, email: "superadmin@echopad.ai", organizer: "Super Admin", status: ORG_STATUS.ACTIVE },
    { id: "org_aurora", tenantId: TENANT_ID, name: "Aurora Health", type: ORG_TYPES.CLIENT, email: "admin@aurorahealth.com", organizer: "Aurora Admin", status: ORG_STATUS.ACTIVE },
    { id: "org_lighthouse", tenantId: TENANT_ID, name: "Lighthouse Clinic", type: ORG_TYPES.CLIENT, email: "admin@lighthouseclinic.com", organizer: "Lighthouse Admin", status: ORG_STATUS.ACTIVE },
  ];

  for (const org of organizations) await upsertOrganization(org);
  
  return {tenantId: TENANT_ID, status: "Success"};

  // /* -------------------- Users -------------------- */
  // const users = [
  //   { id: "user_super_admin", tenantId: TENANT_ID, email: "superadmin@echopad.ai", displayName: "Echopad Super Admin", role: USER_ROLES.SUPER_ADMIN, status: USER_STATUS.ACTIVE, organizationId: "org_echopad" },
  //   { id: "user_aurora_admin", tenantId: TENANT_ID, email: "admin@aurorahealth.com", displayName: "Aurora Admin", role: USER_ROLES.CLIENT_ADMIN, status: USER_STATUS.ACTIVE, organizationId: "org_aurora" },
  //   { id: "user_lighthouse_admin", tenantId: TENANT_ID, email: "admin@lighthouseclinic.com", displayName: "Lighthouse Admin", role: USER_ROLES.CLIENT_ADMIN, status: USER_STATUS.ACTIVE, organizationId: "org_lighthouse" },
  //   { id: "user_aurora_1", tenantId: TENANT_ID, email: "taylor@aurorahealth.com", displayName: "Taylor Grant", role: USER_ROLES.USER, status: USER_STATUS.ACTIVE, organizationId: "org_aurora" },
  //   { id: "user_aurora_2", tenantId: TENANT_ID, email: "jordan@aurorahealth.com", displayName: "Jordan Lee", role: USER_ROLES.USER, status: USER_STATUS.ACTIVE, organizationId: "org_aurora" },
  //   { id: "user_aurora_3", tenantId: TENANT_ID, email: "casey@aurorahealth.com", displayName: "Casey Patel", role: USER_ROLES.USER, status: USER_STATUS.ACTIVE, organizationId: "org_aurora" },
  //   { id: "user_lighthouse_1", tenantId: TENANT_ID, email: "sam@lighthouseclinic.com", displayName: "Sam Morales", role: USER_ROLES.USER, status: USER_STATUS.ACTIVE, organizationId: "org_lighthouse" },
  // ];

  // for (const user of users) await upsertUser(user);

  /* -------------------- Products -------------------- */
  const products = [
    { productCode: "AI_SCRIBE", name: "AI Scribe", description: "Clinical documentation automation and visit summaries.", endpoint: "ai-scribe" },
    { productCode: "INSIGHTS", name: "Insights", description: "Healthcare Financial Intelligence & Benchmarking.", endpoint: "echopad-insights" },
    { productCode: "APERIO", name: "Aperio", description: "AI-Powered Referral Coordination That Closes the Loop.", endpoint: "aperio" },
    { productCode: "AI_DOCMAN", name: "AI DocMan", description: "Document processing, classification, and routing.", endpoint: "ai-docman" },
  ];

  for (const product of products) await upsertProduct(product);

  /* -------------------- Org Products -------------------- */
  const orgProducts = [
    { organizationId: "org_aurora", productCode: "AI_SCRIBE" },
    { organizationId: "org_aurora", productCode: "INSIGHTS" },
    { organizationId: "org_aurora", productCode: "APERIO" },
    { organizationId: "org_lighthouse", productCode: "AI_SCRIBE" },
    { organizationId: "org_lighthouse", productCode: "INSIGHTS" },
  ];

  for (const m of orgProducts) {
    await upsertOrgProduct({
      id: `orgprod_${m.organizationId}_${m.productCode}`,
      tenantId: TENANT_ID,
      organizationId: m.organizationId,
      productId: m.productCode,
      productSku: m.productCode,
      status: ORG_PRODUCT_STATUS.ENABLED,
    });
  }

  console.log("🌱 Seeded org products");

  /* -------------------- Licenses -------------------- */
  const licenses = [
    { id: "lic_aurora_scribe", tenantId: TENANT_ID, organizationId: "org_aurora", ownerOrgId: "org_aurora", productId: "AI_SCRIBE", licenseType: LICENSE_TYPES.SEAT, totalSeats: 12, usedSeats: 0, startDate: daysFromNow(-30), expiresAt: daysFromNow(365), status: LICENSE_STATUS.ACTIVE },
    { id: "lic_aurora_insights", tenantId: TENANT_ID, organizationId: "org_aurora", ownerOrgId: "org_aurora", productId: "INSIGHTS", licenseType: LICENSE_TYPES.SEAT, totalSeats: 6, usedSeats: 0, startDate: daysFromNow(-30), expiresAt: daysFromNow(365), status: LICENSE_STATUS.ACTIVE },
    { id: "lic_aurora_aperio", tenantId: TENANT_ID, organizationId: "org_aurora", ownerOrgId: "org_aurora", productId: "APERIO", licenseType: LICENSE_TYPES.SEAT, totalSeats: 4, usedSeats: 0, startDate: daysFromNow(-15), expiresAt: daysFromNow(365), status: LICENSE_STATUS.ACTIVE },
    { id: "lic_lighthouse_scribe", tenantId: TENANT_ID, organizationId: "org_lighthouse", ownerOrgId: "org_lighthouse", productId: "AI_SCRIBE", licenseType: LICENSE_TYPES.SEAT, totalSeats: 8, usedSeats: 0, startDate: daysFromNow(-45), expiresAt: daysFromNow(365), status: LICENSE_STATUS.ACTIVE },
    { id: "lic_lighthouse_insights", tenantId: TENANT_ID, organizationId: "org_lighthouse", ownerOrgId: "org_lighthouse", productId: "INSIGHTS", licenseType: LICENSE_TYPES.SEAT, totalSeats: 5, usedSeats: 0, startDate: daysFromNow(-45), expiresAt: daysFromNow(365), status: LICENSE_STATUS.ACTIVE },
  ];

  for (const license of licenses) await upsertLicense(license);

  console.log("🌱 Seeded licenses");

  /* -------------------- Assignments -------------------- */
  const assignments = [
    { userId: "user_aurora_admin", licenseId: "lic_aurora_scribe", orgId: "org_aurora" },
    { userId: "user_aurora_1", licenseId: "lic_aurora_scribe", orgId: "org_aurora" },
    { userId: "user_aurora_2", licenseId: "lic_aurora_scribe", orgId: "org_aurora" },
    { userId: "user_aurora_3", licenseId: "lic_aurora_scribe", orgId: "org_aurora" },
    { userId: "user_aurora_admin", licenseId: "lic_lighthouse_insights", orgId: "org_aurora" },
    { userId: "user_aurora_1", licenseId: "lic_lighthouse_insights", orgId: "org_aurora" },
    { userId: "user_aurora_2", licenseId: "lic_aurora_aperio", orgId: "org_aurora" },
    { userId: "user_lighthouse_admin", licenseId: "lic_lighthouse_scribe", orgId: "org_lighthouse" },
    { userId: "user_lighthouse_1", licenseId: "lic_lighthouse_scribe", orgId: "org_lighthouse" },
    { userId: "user_lighthouse_admin", licenseId: "lic_lighthouse_insights", orgId: "org_lighthouse" },
  ];

  for (const a of assignments) {
    await assignLicenseToUser({
      tenantId: TENANT_ID,
      organizationId: a.orgId,
      userId: a.userId,
      licenseId: a.licenseId,
      assignedBy: SYSTEM_USER_ID,
    });
  }

  console.log("🌱 Seeded license assignments");

  /* -------------------- Analytics -------------------- */
  const analyticsSeeds = [
    { orgId: "org_aurora", userId: "user_aurora_admin", productId: "AI_SCRIBE" },
    { orgId: "org_aurora", userId: "user_aurora_1", productId: "AI_SCRIBE" },
    { orgId: "org_aurora", userId: "user_aurora_2", productId: "INSIGHTS" },
    { orgId: "org_aurora", userId: "user_aurora_3", productId: "APERIO" },
    { orgId: "org_lighthouse", userId: "user_lighthouse_admin", productId: "AI_SCRIBE" },
    { orgId: "org_lighthouse", userId: "user_lighthouse_1", productId: "INSIGHTS" },
  ];

  for (const seed of analyticsSeeds) {
    for (let d = -6; d <= 0; d++) {
      await upsertAnalyticsEvent({
        id: `evt_${seed.orgId}_${seed.productId}_${seed.userId}_${d}`,
        tenantId: TENANT_ID,
        organizationId: seed.orgId,
        userId: seed.userId,
        productId: seed.productId,
        eventType: ANALYTICS_EVENT_TYPES.FEATURE_USED,
        metadata: { source: "seed", dayOffset: d },
        timestamp: daysFromNow(d),
      });
    }
  }

  console.log("✅ Seed complete");
  return { tenantId: TENANT_ID, status: "SUCCESS" };
}

