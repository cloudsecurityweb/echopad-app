import { useMemo } from 'react';
import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useOrgProducts } from '../../../hooks/useOrgProducts';
import { useOrgLicenses } from '../../../hooks/useOrgLicenses';
import { useProducts } from '../../../hooks/useProducts';
import ProductGrid from '../../../components/store/ProductGrid';
import DashboardSectionLayout from '../../../components/layout/DashboardSectionLayout';
import { handleIntercomAction } from '../../../utils/intercom';

function StorePage() {
  const { isClientAdmin } = useRole();
  const { organization, orgId } = useOrganization();
  const { orgProducts, loading: orgProductsLoading } = useOrgProducts(orgId);
  const { licenses, loading: licensesLoading } = useOrgLicenses(orgId);
  const { products } = useProducts();

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
    <DashboardSectionLayout
      title="Store"
      description={`Browse available products for ${organization?.name || 'your organization'}.`}
    >
    <div className="max-w-7xl mx-auto space-y-8">
      {(orgProductsLoading || licensesLoading) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
          Loading products...
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
    </DashboardSectionLayout>
  );
}

export default StorePage;
