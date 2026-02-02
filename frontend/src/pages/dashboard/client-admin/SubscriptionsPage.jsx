import { useMemo } from 'react';
import { useRole } from '../../../contexts/RoleContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useOrgProducts } from '../../../hooks/useOrgProducts';
import { useOrgLicenses } from '../../../hooks/useOrgLicenses';
import { useProducts } from '../../../hooks/useProducts';
import { useUsers } from '../../../hooks/useUsers';
import { useUserLicenses } from '../../../hooks/useUserLicenses';
import { useProductUsage } from '../../../hooks/useProductUsage';
import SubscriptionTabs from '../../../components/subscription/SubscriptionTabs';
import ProductTab from '../../../components/subscription/ProductTab';

function SubscriptionsPage() {
  const { isClientAdmin } = useRole();
  const { getAccessToken } = useAuth();
  const { organization, orgId } = useOrganization();
  const { orgProducts, loading: orgProductsLoading } = useOrgProducts(orgId);
  const { licenses, loading: licensesLoading } = useOrgLicenses(orgId);
  const { products } = useProducts();
  const { users, loading: usersLoading } = useUsers();
  const { userLicenses, loading: userLicensesLoading, assignLicense, revokeLicense } = useUserLicenses(orgId);

  console.log('Organization Products:', orgProducts);
  if (!isClientAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const productCatalog = products || [];

  const activeLicenses = useMemo(() => {
    return licenses.filter((license) => license.status === 'active');
  }, [licenses]);

  const activeProducts = useMemo(() => {
    const enabled = orgProducts.filter((item) => item.status === 'enabled');
    return enabled
      .map((item) => {
        const sku = item.productSku || item.productId;
        const product = productCatalog.find((entry) => {
          const productSku = entry.sku || entry.productCode || entry.id;
          return productSku === sku;
        });
        return product ? { ...product, productId: sku } : null;
      })
      .filter(Boolean)
      .filter((product) =>
        activeLicenses.some((license) => license.productId === (product.productId || product.sku || product.productCode))
      );
  }, [orgProducts, productCatalog, activeLicenses]);

  const isLoading = orgProductsLoading || licensesLoading || usersLoading || userLicensesLoading;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Subscription</h1>
        <p className="text-xl text-gray-600">
          Manage products and licenses for {organization?.name || 'your organization'}.
        </p>
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
          Loading subscriptions...
        </div>
      )}

      {!isLoading && (
        <SubscriptionTabs
          products={activeProducts}
          renderTab={(product) => {
            const productCode = product.productId || product.productCode || product.id;
            const license = activeLicenses.find((item) => item.productId === productCode);
            const { usage, loading, error } = useProductUsage({ organizationId: orgId, productCode: productCode });

            return (
              <ProductTab
                product={product}
                license={license}
                users={users}
                licenses={licenses}
                userLicenses={userLicenses}
                onAssignLicense={(payload) => assignLicense({ ...payload, organizationId: orgId })}
                onRevokeLicense={revokeLicense}
                getAccessToken={getAccessToken}
                usageData={usage}
                usageLoading={loading}
                usageError={error}
              />
            );
          }}
        />
      )}
    </div>
  );
}

export default SubscriptionsPage;
