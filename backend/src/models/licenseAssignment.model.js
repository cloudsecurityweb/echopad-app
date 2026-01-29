/**
 * License Assignment Model – Cosmos DB
 * Container: licenseAssignments
 * Partition Key: /tenantId
 */

export default function createLicenseAssignment(data) {
  const { tenantId, productCode, userEmail } = data;

  console.log(tenantId, productCode, userEmail);

  if (!tenantId) throw new Error("tenantId is required");
  if (!productCode) throw new Error("productCode is required");
  if (!userEmail) throw new Error("userEmail is required");

  return {
    id: data.id || `lic_${crypto.randomUUID()}`,
    tenantId,

    userId: null, // populated on activation
    userEmail,

    productCode,

    status: data.status || "INVITE_SENT",
    // INVITE_SENT | ACTIVE | INACTIVE | REVOKED

    invitedAt: new Date().toISOString(),
    activatedAt: null,
    revokedAt: null,

    entityType: "licenseAssignment"
  };
}
