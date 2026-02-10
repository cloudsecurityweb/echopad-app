import { useMemo } from 'react';
import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useOrgProducts } from '../../../hooks/useOrgProducts';
import { useOrgLicenses } from '../../../hooks/useOrgLicenses';
import { useProducts } from '../../../hooks/useProducts';
import ProductGrid from '../../../components/store/ProductGrid';
import { handleIntercomAction } from '../../../utils/intercom';

function StorePage() {
  const { isClientAdmin } = useRole();
  const { organization, orgId } = useOrganization();
  const { orgProducts, loading: orgProductsLoading } = useOrgProducts(orgId);
  const { licenses, loading: licensesLoading } = useOrgLicenses(orgId);
  const { products, loading: productsLoading } = useProducts();

  if (!isClientAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const subscribedSkus = useMemo(() => {
    const enabled = orgProducts.filter((item) => item.status === 'enabled');
    const activeLicenses = licenses.filter((license) => license.status === 'active');
    return enabled
      .map((item) => item.productSku || item.productId)
      .filter((sku) => activeLicenses.some((license) => license.productId === sku));
  }, [orgProducts, licenses]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Store</h1>
        <p className="text-xl text-gray-600">
          Browse available products for {organization?.name || 'your organization'}.
        </p>
      </div>

      {(orgProductsLoading || licensesLoading || productsLoading) && (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg mt-2"></div>
            </div>
          ))}
        </div>
      )}

      {!orgProductsLoading && !licensesLoading && (
        <ProductGrid products={products} subscribedSkus={subscribedSkus} />
      )}

      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Need assistance with products?</h2>
        <p className="text-gray-700 mb-4">
          Contact our support team if you have questions about our products or need assistance.
        </p>
        <button
          onClick={() => handleIntercomAction('showNewMessage', 'I have a question about the products.')}
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Contact Support
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default StorePage;
