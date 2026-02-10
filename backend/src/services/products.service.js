import { getContainer } from "../config/cosmosClient.js";
import createProduct from "../models/product.model.js";

export async function getProducts() {
  const container = getContainer("products");
  const { resources } = await container.items.query("SELECT * FROM c").fetchAll();
  return resources;
}

export async function createProducts(payload) {
  const container = getContainer("products");
  const product = createProduct(payload);
  await container.items.create(product);
  return product;
}

export async function updateProduct(productCode, updates) {
  const container = getContainer("products");
  const { resource } = await container.item(productCode, productCode).read();

  Object.assign(resource, updates, {
    updatedAt: new Date().toISOString()
  });

  await container.items.upsert(resource);
  return resource;
}

export async function getProductByCode(productCode) {
  const container = getContainer("products");
  const { resource } = await container.item(productCode, productCode).read();
  return resource;
}

export async function deleteProduct(productCode) {
  const container = getContainer("products");
  await container.item(productCode, productCode).delete();
}

export async function getProductById(productId, tenantId) {
  // NOTE: tenantId is ignored for now, as products are considered global.
  // The partition key for products is productCode, which is the same as productId.
  return getProductByCode(productId);
}

export async function getProductsByTenant(tenantId, status = null) {
  const container = getContainer(CONTAINER_NAME);
  if (!container) {
    throw new Error("Cosmos DB container not available");
  }

  let query = "SELECT * FROM c WHERE c.tenantId = @tenantId";
  const parameters = [{ name: "@tenantId", value: tenantId }];

  if (status) {
    query += " AND c.status = @status";
    parameters.push({ name: "@status", value: status });
  }

  const { resources } = await container.items.query({
    query,
    parameters,
  }).fetchAll();

  return resources;
}