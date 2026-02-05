import React from 'react';

const ProductTabsV2 = ({ products, activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap gap-3 border-b border-gray-200 pb-4">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => setActiveTab(product.id)}
          className={`px-8 py-4 rounded-lg text-sm font-medium transition-colors ${
            activeTab === product.id
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {product.name}
        </button>
      ))}
    </div>
  );
};

export default ProductTabsV2;
