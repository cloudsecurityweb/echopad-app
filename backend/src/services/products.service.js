import { getContainer } from "../config/cosmosClient.js";
import createProduct  from "../models/product.model.js";

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