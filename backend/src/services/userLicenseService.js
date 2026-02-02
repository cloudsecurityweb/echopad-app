/**
 * User License Service
 *
 * Handles assigning/revoking licenses to users with seat enforcement.
 */

import { randomUUID } from "crypto";
import { getContainer } from "../config/cosmosClient.js";
import { createUserLicense, validateUserLicense } from "../models/userLicense.js";
import { LICENSE_STATUS, LICENSE_TYPES, hasAvailableSeats, isLicenseExpired } from "../models/license.js";

const USER_LICENSE_CONTAINER = "userLicenses";
const LICENSE_CONTAINER = "licenses";

function getLicenseOrganizationId(license) {
  return license.organizationId || license.ownerOrgId;
}

function isLicenseWithinDateRange(license) {
  if (license.startDate && new Date(license.startDate) > new Date()) {
    return false;
  }
  return !isLicenseExpired(license);
}

function getSeatInfo(license) {
  const totalSeats = license.totalSeats ?? license.seats ?? 0;
  const usedSeats = license.usedSeats ?? (license.assignedUserIds?.length || 0);
  const licenseType = license.licenseType || (totalSeats === 0 ? LICENSE_TYPES.UNLIMITED : LICENSE_TYPES.SEAT);

  return { totalSeats, usedSeats, licenseType };
}

export async function assignLicenseToUser({
  tenantId,
  organizationId,
  userId,
  licenseId,
  assignedBy,
}) {
  const licenseContainer = getContainer(LICENSE_CONTAINER);
  const userLicenseContainer = getContainer(USER_LICENSE_CONTAINER);

  if (!licenseContainer || !userLicenseContainer) {
    throw new Error("Cosmos DB container not available");
  }

  const querySpec = {
    query: `
    SELECT * FROM c
    WHERE c.id = @id AND c.tenantId = @tenantId
  `,
    parameters: [
      { name: "@id", value: licenseId },
      { name: "@tenantId", value: tenantId }
    ]
  };

  const { resources } = await licenseContainer.items
    .query(querySpec)
    .fetchAll();

  const license = resources[0] ?? null;

  if (!license) {
    throw new Error("License not found"); ``
  }

  const licenseOrgId = getLicenseOrganizationId(license);
  if (licenseOrgId !== organizationId) {
    throw new Error("License does not belong to the organization");
  }

  if (license.status !== LICENSE_STATUS.ACTIVE) {
    throw new Error(`License is ${license.status}`);
  }

  if (!isLicenseWithinDateRange(license)) {
    throw new Error("License is not within the valid date range");
  }

  const { totalSeats, usedSeats, licenseType } = getSeatInfo(license);

  if (licenseType === LICENSE_TYPES.SEAT && usedSeats >= totalSeats) {
    throw new Error("No available seats on this license");
  }

  const { resources: existing } = await userLicenseContainer.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.userId = @userId AND c.licenseId = @licenseId",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@userId", value: userId },
      { name: "@licenseId", value: licenseId },
    ],
  }).fetchAll();

  if (existing.length > 0) {
    return existing[0];
  }

  const userLicenseData = {
    id: `userlic_${randomUUID()}`,
    tenantId,
    userId,
    organizationId,
    licenseId,
    productId: license.productId,
    assignedBy,
  };

  const validation = validateUserLicense(userLicenseData);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
  }

  const userLicense = createUserLicense(userLicenseData);
  await userLicenseContainer.items.create(userLicense);

  if (licenseType === LICENSE_TYPES.SEAT) {
    const updatedLicense = {
      ...license,
      usedSeats: usedSeats + 1,
      assignedUserIds: Array.from(new Set([...(license.assignedUserIds || []), userId])),
      updatedAt: new Date().toISOString(),
    };
    await licenseContainer.items.upsert(updatedLicense);
  }

  return userLicense;
}

export async function revokeLicenseFromUser({ tenantId, userId, licenseId }) {
  const licenseContainer = getContainer(LICENSE_CONTAINER);
  const userLicenseContainer = getContainer(USER_LICENSE_CONTAINER);

  if (!licenseContainer || !userLicenseContainer) {
    throw new Error("Cosmos DB container not available");
  }

  const { resources } = await userLicenseContainer.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.userId = @userId AND c.licenseId = @licenseId",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@userId", value: userId },
      { name: "@licenseId", value: licenseId },
    ],
  }).fetchAll();

  if (resources.length === 0) {
    throw new Error("User license assignment not found");
  }

  const userLicense = resources[0];
  await userLicenseContainer.item(userLicense.id, tenantId).delete();

  const { resource: license } = await licenseContainer.item(licenseId, tenantId).read();
  if (!license) {
    return userLicense;
  }

  const { usedSeats, licenseType } = getSeatInfo(license);

  if (licenseType === LICENSE_TYPES.SEAT) {
    const updatedLicense = {
      ...license,
      usedSeats: Math.max(0, usedSeats - 1),
      assignedUserIds: (license.assignedUserIds || []).filter((id) => id !== userId),
      updatedAt: new Date().toISOString(),
    };
    await licenseContainer.items.upsert(updatedLicense);
  }

  return userLicense;
}

export async function getUserLicensesByUser(tenantId, userId) {
  const container = getContainer(USER_LICENSE_CONTAINER);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.userId = @userId",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@userId", value: userId },
    ],
  }).fetchAll();

  return resources;
}

export async function getUserLicensesByOrganization(tenantId, organizationId) {
  const container = getContainer(USER_LICENSE_CONTAINER);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  const { resources } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.organizationId = @organizationId",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@organizationId", value: organizationId },
    ],
  }).fetchAll();

  return resources;
}

export async function hasActiveProductAccess(tenantId, userId, productSku) {
  const container = getContainer(USER_LICENSE_CONTAINER);
  const licenseContainer = getContainer(LICENSE_CONTAINER);

  if (!container || !licenseContainer) {
    throw new Error("Cosmos DB container not available");
  }

  const { resources: mappings } = await container.items.query({
    query: "SELECT * FROM c WHERE c.tenantId = @tenantId AND c.userId = @userId AND c.productId = @productId",
    parameters: [
      { name: "@tenantId", value: tenantId },
      { name: "@userId", value: userId },
      { name: "@productId", value: productSku },
    ],
  }).fetchAll();

  if (mappings.length === 0) {
    return false;
  }

  for (const mapping of mappings) {
    try {
      const { resource: license } = await licenseContainer.item(mapping.licenseId, tenantId).read();
      if (!license) {
        continue;
      }

      if (license.status !== LICENSE_STATUS.ACTIVE) {
        continue;
      }

      if (!isLicenseWithinDateRange(license)) {
        continue;
      }

      if (!hasAvailableSeats(license)) {
        continue;
      }

      return true;
    } catch (error) {
      if (error.code !== 404) {
        console.warn("Error validating license access:", error.message);
      }
    }
  }

  return false;
}
