export default function createClient(data) {
  if (!data.name) throw new Error("Client name is required");
  if (!data.tenantId) throw new Error("tenantId is required");

  const now = new Date().toISOString();

  return {
    id: data.id || `client_${crypto.randomUUID()}`,
    tenantId: data.tenantId,

    name: String(data.name),
    status: data.status || "Active",
    subscriptionTier: data.subscriptionTier || "Starter",

    createdAt: data.createdAt || now,
    updatedAt: now,

    entityType: "client"
  };
}
