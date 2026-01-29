import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import { products } from '../../data/products';
import BuyNowCTA from '../../components/products/BuyNowCTA';
import { checkProductOwnership } from '../../utils/productOwnership';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Products() {
  const { isSuperAdmin, isClientAdmin } = useRole();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Product usage statistics for Super Admin
  const productUsageStats = [
    { product: 'AI Scribe', clients: 45, licenses: 450, usage: 12470 },
    { product: 'AI DocMan', clients: 32, licenses: 320, usage: 8560 },
    { product: 'AI Medical', clients: 28, licenses: 280, usage: 5230 },
    { product: 'AI Receptionist', clients: 18, licenses: 184, usage: 3120 },
  ];

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {isSuperAdmin ? 'Platform AI Agents' : 'Our AI Agents'}
        </h1>
        <p className="text-xl text-gray-600 mb-4">
          {isSuperAdmin 
            ? 'Manage all platform AI agents and configurations'
            : 'Choose the AI agents that fit your practice. View details and purchase directly.'}
        </p>
        {!isSuperAdmin && (
          <a 
            href="#products-grid" 
            className="text-cyan-600 hover:text-cyan-700 font-medium inline-flex items-center gap-2 text-sm"
          >
            Compare AI Agents
            <i className="bi bi-arrow-down"></i>
          </a>
        )}
      </div>

      {/* Super Admin: AI Agent Usage Statistics */}
      {isSuperAdmin && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">AI Agent Usage Statistics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productUsageStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="clients" fill="#06b6d4" name="Clients" />
              <Bar dataKey="licenses" fill="#3b82f6" name="Licenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Products Grid */}
      <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products
          .filter(product => 
            product.id === 'ai-scribe' || 
            product.id === 'ai-docman' || 
            product.id === 'ai-medical-assistant'
          )
          .map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all relative"
          >
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  product.badge === 'Most Popular' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                }`}>
                  {product.badge}
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <i className={`bi ${product.icon} text-white text-2xl`}></i>
            </div>

            {/* Product Info */}
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
              {(() => {
                const ownership = checkProductOwnership(product.id);
                if (!isSuperAdmin) {
                  if (ownership) {
                    return (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <i className="bi bi-check-circle-fill mr-1"></i>
                        Owned
                      </span>
                    );
                  } else {
                    return (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <i className="bi bi-cart-plus mr-1"></i>
                        Available
                      </span>
                    );
                  }
                }
                return null;
              })()}
            </div>
            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Pricing */}
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">{product.price}</span>
                <span className="text-sm text-gray-600">{product.pricePeriod}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleViewDetails(product)}
                className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-sm"
              >
                View Details
              </button>
              {(() => {
                const ownership = checkProductOwnership(product.id);
                if (ownership && !isSuperAdmin) {
                  return (
                    <div className="w-full px-4 py-2 bg-green-50 border border-green-200 text-green-800 rounded-lg font-medium text-sm text-center">
                      <i className="bi bi-check-circle-fill mr-2"></i>
                      You own this product
                    </div>
                  );
                }
                return (
                  <BuyNowCTA
                    stripePaymentLink={product.stripePaymentLink}
                    productName={product.name}
                    size="sm"
                    fullWidth={true}
                  />
                );
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Trust & FAQ Section */}
      {!isSuperAdmin && (
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trust Badges */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Trusted & Secure</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <i className="bi bi-shield-check text-green-500 text-xl"></i>
                  <span className="text-gray-700">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bi bi-shield-lock text-blue-500 text-xl"></i>
                  <span className="text-gray-700">SOC 2 Type II Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bi bi-lock-fill text-purple-500 text-xl"></i>
                  <span className="text-gray-700">End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="bi bi-check-circle-fill text-cyan-500 text-xl"></i>
                  <span className="text-gray-700">Secure Payment Processing</span>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Can I try before purchasing?</h4>
                  <p className="text-sm text-gray-600">Yes, we offer a 14-day free trial for all products. No credit card required.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">What payment methods do you accept?</h4>
                  <p className="text-sm text-gray-600">We accept all major credit cards and ACH transfers through Stripe.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Can I cancel anytime?</h4>
                  <p className="text-sm text-gray-600">Yes, you can cancel your subscription at any time with no cancellation fees.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Is there a setup fee?</h4>
                  <p className="text-sm text-gray-600">No setup fees. Your first month starts immediately after purchase.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Need Help?</h2>
        <p className="text-gray-700 mb-4">
          Contact our support team to learn more about our products and how they can benefit your organization.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Contact Support
          <i className="bi bi-arrow-right"></i>
        </a>
      </div>

      {/* Product Details Modal */}
      {isDetailsOpen && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={handleCloseDetails}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <i className={`bi ${selectedProduct.icon} text-white text-xl`}></i>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    {selectedProduct.badge && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        selectedProduct.badge === 'Most Popular' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white'
                          : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      }`}>
                        {selectedProduct.badge}
                      </span>
                    )}
                    {(() => {
                      const ownership = checkProductOwnership(selectedProduct.id);
                      if (!isSuperAdmin) {
                        if (ownership) {
                          return (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <i className="bi bi-check-circle-fill mr-1"></i>
                              Owned
                            </span>
                          );
                        } else {
                          return (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <i className="bi bi-cart-plus mr-1"></i>
                              Available
                            </span>
                          );
                        }
                      }
                      return null;
                    })()}
                  </div>
                </div>
              </div>
              <button
                onClick={handleCloseDetails}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close"
              >
                <i className="bi bi-x-lg text-xl"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Pricing */}
              <div className="mb-6 p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg border border-cyan-200">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">{selectedProduct.price}</span>
                  <span className="text-sm text-gray-600">{selectedProduct.pricePeriod}</span>
                </div>
                {(() => {
                  const ownership = checkProductOwnership(selectedProduct.id);
                  if (ownership && !isSuperAdmin) {
                    return (
                      <div className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-800 rounded-lg font-medium text-center">
                        <i className="bi bi-check-circle-fill mr-2"></i>
                        You own this product
                      </div>
                    );
                  }
                  return (
                    <BuyNowCTA
                      stripePaymentLink={selectedProduct.stripePaymentLink}
                      productName={selectedProduct.name}
                      size="lg"
                      fullWidth={true}
                    />
                  );
                })()}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
                <p className="text-gray-700 leading-relaxed">{selectedProduct.longDescription}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {selectedProduct.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <i className="bi bi-check-circle-fill text-green-500 mt-0.5 flex-shrink-0"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Metrics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Metrics</h3>
                <div className="grid grid-cols-3 gap-4">
                  {selectedProduct.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                      <div className="font-bold text-gray-900 text-lg mb-1">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect For</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.useCases.map((useCase, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learn More Link */}
              <div className="pt-4 border-t border-gray-200">
                <a
                  href={selectedProduct.route}
                  className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
                >
                  Learn More About {selectedProduct.name}
                  <i className="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
