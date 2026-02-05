/**
 * Product Ownership Utility
 * 
 * This utility checks if a client/user owns a product.
 * Currently uses placeholder data, but can be easily replaced with API calls.
 */

/**
 * Get user's owned products
 * NOTE: This utility is now a thin wrapper around the backend API that derives
 * product access from license assignments. It returns a Promise that resolves
 * to an array matching the structure expected by YourProducts.jsx.
 */
export async function getUserOwnedProducts(api, userId) {
  if (!api || !userId) {
    return [];
  }

  try {
    const response = await api.fetchUserProducts(userId);
    const products = response?.data || response;
    if (!Array.isArray(products)) return [];

    return products.map((p) => ({
      id: p.id,
      name: p.name,
      status: p.status || 'Active',
      subscriptionDate: p.subscriptionDate || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Failed to load user-owned products:', error);
    return [];
  }
}

/**
 * Check if user owns a specific product by product ID
 * @param {string} productId - Product ID from the catalog (e.g., 'ai-scribe', 'ai-docman')
 * @returns {Object|null} - Product ownership info or null if not owned
 */
export function checkProductOwnership(productId, ownedProducts) {
  if (!ownedProducts || !Array.isArray(ownedProducts)) {
    return null;
  }
  
  // Map product IDs to product names
  const productIdToName = {
    'ai-scribe': 'AI Scribe',
    'ai-docman': 'AI Document Manager',
    'ai-medical-assistant': 'AI Medical Assistant',
    'ai-receptionist': 'AI Receptionist',
    'ai-admin-assistant': 'AI Admin Assistant',
    'ai-reminders': 'AI Patient Reminders',
  };

  const productName = productIdToName[productId];
  if (!productName) return null;

  // Check if product is owned (handle both exact name match and variations)
  const ownedProduct = ownedProducts.find(p => {
    // Handle variations: "AI DocMan" vs "AI Document Manager"
    if (productName === 'AI Document Manager') {
      return p.name === 'AI DocMan' || p.name === 'AI Document Manager';
    }
    return p.name === productName;
  });

  return ownedProduct || null;
}

/**
 * Check if user owns a product by product name
 * @param {string} productName - Product name (e.g., 'AI Scribe')
 * @param {Array} ownedProducts - Array of user's owned products
 * @returns {Object|null} - Product ownership info or null if not owned
 */
export function checkProductOwnershipByName(productName, ownedProducts) {
  if (!ownedProducts || !Array.isArray(ownedProducts)) {
    return null;
  }
  
  // Handle name variations
  const nameVariations = {
    'AI Document Manager': ['AI DocMan', 'AI Document Manager'],
    'AI DocMan': ['AI DocMan', 'AI Document Manager'],
  };

  const variations = nameVariations[productName] || [productName];
  const ownedProduct = ownedProducts.find(p => variations.includes(p.name));

  return ownedProduct || null;
}

