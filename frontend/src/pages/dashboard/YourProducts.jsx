import { useState, useMemo } from 'react';
import ProductFeedbackModal from '../../components/ui/ProductFeedbackModal';
import { getUserOwnedProducts } from '../../utils/productOwnership';
import { products } from '../../data/products';

function YourProducts() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState(null);

  // Get owned products and merge with full product details from catalog
  const userProducts = useMemo(() => {
    const ownedProducts = getUserOwnedProducts();
    
    // Map owned products to full product details from catalog
    return ownedProducts.map(ownedProduct => {
      // Find matching product in catalog by name
      const catalogProduct = products.find(p => {
        // Handle name variations
        if (ownedProduct.name === 'AI DocMan') {
          return p.name === 'AI Document Manager';
        }
        return p.name === ownedProduct.name;
      });

      if (catalogProduct) {
        return {
          ...catalogProduct,
          status: ownedProduct.status,
          subscriptionDate: ownedProduct.subscriptionDate,
          downloadUrl: `/api/products/${catalogProduct.id}/download`, // Placeholder download URL
        };
      }

      // Fallback if product not found in catalog
      return {
        id: ownedProduct.id,
        name: ownedProduct.name,
        description: 'Product purchased and available for download.',
        status: ownedProduct.status,
        subscriptionDate: ownedProduct.subscriptionDate,
        icon: 'bi-box-seam',
        downloadUrl: `/api/products/${ownedProduct.id}/download`,
      };
    });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleOpenFeedbackModal = (productName) => {
    setSelectedProductName(productName);
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setIsFeedbackModalOpen(false);
    setSelectedProductName(null);
  };

  const handleFeedbackSuccess = () => {
    // Optionally refresh data or show additional success message
  };

  const handleDownload = (product) => {
    // Handle product download
    // In production, this would trigger an actual download from the server
    if (product.downloadUrl) {
      // For now, we'll simulate a download
      // In production, replace with actual API call
      window.open(product.downloadUrl, '_blank');
      
      // You could also use fetch to download a file:
      // fetch(product.downloadUrl)
      //   .then(response => response.blob())
      //   .then(blob => {
      //     const url = window.URL.createObjectURL(blob);
      //     const a = document.createElement('a');
      //     a.href = url;
      //     a.download = `${product.name}.zip`; // or appropriate file extension
      //     document.body.appendChild(a);
      //     a.click();
      //     window.URL.revokeObjectURL(url);
      //     document.body.removeChild(a);
      //   });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Your AI Agents
        </h1>
        <p className="text-xl text-gray-600">
          Manage and view your subscribed AI agents
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {userProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {typeof product.icon === 'string' ? (
                    <i className={`bi ${product.icon} text-white text-2xl`}></i>
                  ) : (
                    product.icon
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                    product.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.status}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Subscribed on</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(product.subscriptionDate)}</p>
                </div>
              </div>
              
              {/* Download Button - Primary Action */}
              <button
                onClick={() => handleDownload(product)}
                className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium inline-flex items-center justify-center gap-2"
              >
                <i className="bi bi-download text-lg"></i>
                Download AI Agent
              </button>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => handleOpenFeedbackModal(product.name)}
                  className="flex-1 px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 font-medium inline-flex items-center justify-center gap-2 text-sm transition-colors rounded-lg border border-purple-200"
                >
                  <i className="bi bi-star-fill"></i>
                  Give Feedback
                </button>
                <a
                  href={product.route || `/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="flex-1 px-4 py-2 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 font-medium inline-flex items-center justify-center gap-2 text-sm transition-colors rounded-lg border border-cyan-200"
                >
                  View Details
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State (if no products) */}
      {userProducts.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No AI Agents Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't subscribed to any AI agents yet. Browse all available AI agents to get started.
          </p>
          <a
            href="/dashboard/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
          >
            Browse All AI Agents
          </a>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Need Help?</h2>
        <p className="text-gray-700">
          Contact our support team if you have questions about your products or need assistance with your subscriptions.
        </p>
      </div>

      {/* Product Feedback Modal */}
      <ProductFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        onSuccess={handleFeedbackSuccess}
        productName={selectedProductName}
      />
    </div>
  );
}

export default YourProducts;



