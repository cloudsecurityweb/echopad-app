import { useState, useMemo } from 'react';
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
import { toast } from 'react-toastify';

function SubscriptionsPage() {
  const { isClientAdmin } = useRole();
  const { getAccessToken } = useAuth();
  const { organization, orgId } = useOrganization();
  const { orgProducts, loading: orgProductsLoading } = useOrgProducts(orgId);
  const { licenses, loading: licensesLoading, requestLicense } = useOrgLicenses(orgId);
  const { products } = useProducts();
  const { users, loading: usersLoading } = useUsers();
  const { userLicenses, loading: userLicensesLoading, revokeLicense, assignLicense } = useUserLicenses(orgId);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);

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

  // Filter licenses to show in tabs (active, requested, denied)
  // We want to show the product tab if there is ANY license record
  const displayLicenses = useMemo(() => {
    return licenses.filter((license) =>
      ['active', 'requested', 'denied'].includes(license.status)
    );
  }, [licenses]);

  const activeProducts = useMemo(() => {
    return productCatalog
      .filter((product) => {
        const productCode = product.productId || product.productCode || product.id;
        // Show product if it has a license in displayLicenses
        return displayLicenses.some(
          (license) => license.productId === productCode
        );
      })
      .map((product) => ({
        ...product,
        productId: product.sku || product.productCode || product.id
      }));
  }, [productCatalog, displayLicenses]);

  // Products available for request (ALL products)
  const availableForRequest = useMemo(() => {
    return productCatalog;
  }, [productCatalog]);

  const handleRequestLicense = async () => {
    if (!selectedProductId) return;
    setRequestLoading(true);
    try {
      await requestLicense(selectedProductId);
      setIsRequestModalOpen(false);
      setSelectedProductId('');
      toast.success('License requested successfully!');
    } catch (err) {
      toast.error('Failed to request license');
    } finally {
      setRequestLoading(false);
    }
  };

  const isLoading = orgProductsLoading || licensesLoading || usersLoading || userLicensesLoading;

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Subscription</h1>
          <p className="text-xl text-gray-600">
            Manage products and licenses for {organization?.name || 'your organization'}.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
          Loading subscriptions...
        </div>
      )}

      {!isLoading && (
        <SubscriptionTabs
          products={activeProducts}
          onRequestLicense={() => setIsRequestModalOpen(true)}
          renderTab={(product) => {
            const productCode = product.productId || product.productCode || product.id;
            // Get all licenses for this product (active, requested, etc.)
            const productLicenses = licenses.filter((item) => item.productId === productCode);
            // Only fetch usage for active licenses to avoid errors
            const hasActiveLicense = productLicenses.some(l => l.status === 'active');

            // Should we disable usage section if not active? 
            // For now, let's keep it but maybe handle empty usage gracefully
            const { usage, loading, error } = useProductUsage({ organizationId: orgId, productCode: productCode });

            return (
              <ProductTab
                product={product}
                productLicenses={productLicenses}
                users={users}
                licenses={licenses}
                userLicenses={userLicenses}
                onRevokeLicense={revokeLicense}
                onAssignLicense={(payload) => assignLicense({ ...payload, organizationId: orgId })}
                getAccessToken={getAccessToken}
                usageData={usage}
                usageLoading={loading}
                usageError={error}
                onRequestLicense={() => {
                  setSelectedProductId(productCode);
                  setIsRequestModalOpen(true);
                }}
              />
            );
          }}
        />
      )}

      {/* Request License Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Request New License</h3>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors p-1 rounded-full hover:bg-gray-100"
                disabled={requestLoading}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Product
                </label>
                <div className="relative">
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white shadow-sm appearance-none transition-all hover:border-gray-300"
                    disabled={requestLoading}
                  >
                    <option value="">Select a product...</option>
                    {availableForRequest.map((product) => (
                      <option key={product.id} value={product.sku || product.productCode || product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {availableForRequest.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600 font-medium">
                    You currently have licenses for all available products.
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Requested licenses will be reviewed by a Super Admin. Upon approval, you will receive a default allocation of <strong>10 seats</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={requestLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestLicense}
                  disabled={!selectedProductId || requestLoading}
                  className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {requestLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                      <span>Confirm Request</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionsPage;
