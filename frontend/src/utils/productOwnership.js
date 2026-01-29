/**
 * Product Ownership Utility
 * 
 * This utility checks if a client/user owns a product.
 * Currently uses placeholder data, but can be easily replaced with API calls.
 */

/**
 * Get user's owned products
 * TODO: Replace with API call to fetch user's products
 */
export function getUserOwnedProducts() {
  // Placeholder data - matches YourProducts.jsx structure
  // In production, this would fetch from an API endpoint
  return [
    {
      id: 1,
      name: 'AI Scribe',
      status: 'Active',
      subscriptionDate: '2024-01-15',
    },
    {
      id: 3,
      name: 'AI Medical Assistant',
      status: 'Active',
      subscriptionDate: '2024-03-10',
    },
  ];
}

/**
 * Check if user owns a specific product by product ID
 * @param {string} productId - Product ID from the catalog (e.g., 'ai-scribe', 'ai-docman')
 * @returns {Object|null} - Product ownership info or null if not owned
 */
export function checkProductOwnership(productId) {
  const ownedProducts = getUserOwnedProducts();
  
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
 * @returns {Object|null} - Product ownership info or null if not owned
 */
export function checkProductOwnershipByName(productName) {
  const ownedProducts = getUserOwnedProducts();
  
  // Handle name variations
  const nameVariations = {
    'AI Document Manager': ['AI DocMan', 'AI Document Manager'],
    'AI DocMan': ['AI DocMan', 'AI Document Manager'],
  };

  const variations = nameVariations[productName] || [productName];
  const ownedProduct = ownedProducts.find(p => variations.includes(p.name));

  return ownedProduct || null;
}
