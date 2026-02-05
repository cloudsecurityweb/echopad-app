import { getUserLicensesByUser } from "./userLicenseService.js";
import { getProductById } from "./products.service.js";

export async function getProductsByUserId(tenantId, userId) {
  const userLicenses = await getUserLicensesByUser(tenantId, userId);

  if (!userLicenses || userLicenses.length === 0) {
    return [];
  }

  const productIds = userLicenses.map((license) => license.productId);
  const uniqueProductIds = [...new Set(productIds)];

  const products = await Promise.all(
    uniqueProductIds.map((productId) => getProductById(productId))
  );

  return products.filter((product) => product !== null);
}
