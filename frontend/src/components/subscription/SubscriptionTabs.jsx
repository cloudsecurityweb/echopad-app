import { useState } from 'react';

function SubscriptionTabs({ products, renderTab }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!products.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        No active products found for this organization.
      </div>
    );
  }

  const activeProduct = products[activeIndex];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
        {products.map((product, index) => (
          <button
            key={product.id || product.productId || product.sku}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`px-8 py-4 rounded-lg text-sm font-medium transition-colors ${
              index === activeIndex
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {product.name}
          </button>
        ))}
      </div>

      <div>{renderTab(activeProduct)}</div>
    </div>
  );
}

export default SubscriptionTabs;
