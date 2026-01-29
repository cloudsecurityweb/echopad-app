/**
 * Product Model – Cosmos DB
 * Container: products
 * Partition Key: /productCode
 */

export default function createProduct(data) {
  if (!data.productCode) throw new Error("productCode is required");
  if (!data.name) throw new Error("Product name is required");

  const now = new Date().toISOString();

  return {
    id: data.productCode,
    productCode: data.productCode,

    name: data.name,
    description: data.description || "",

    status: data.status || "ACTIVE", // ACTIVE | INACTIVE

    createdAt: now,
    updatedAt: now,

    entityType: "product"
  };
}
