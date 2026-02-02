import { useEffect, useState } from 'react';
import { fetchUserProducts } from '../../api/userProduct.api';
import ProductTabsV2 from '../../components/products/ProductTabsV2';
import ProductDownloadCard from '../../components/products/ProductDownloadCard';
import UserMetricsCard from '../../components/products/UserMetricsCard';
import HistorySection from '../../components/products/HistorySection';

const AI_SCRIBE_PRODUCT_ID = "AI_SCRIBE"; // Assuming AI_SCRIBE is the product ID for AI Scribe

function ProductsOwned() {
  const [userProducts, setUserProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
          const response = await fetchUserProducts();
          const ownedProducts = response?.data?.data?.products || [];

          if (isMounted) {
            setUserProducts(ownedProducts);
            if (ownedProducts.length > 0) {
              // Set default active tab to AI Scribe if available, otherwise the first product
              const scribeProduct = ownedProducts.find(product => product.id === AI_SCRIBE_PRODUCT_ID);
              setActiveTab(scribeProduct ? scribeProduct.id : ownedProducts[0].id);
            }
          }
      } catch (err) {
        console.error('Failed to load user products for dashboard:', err);
        if (isMounted) {
          setError('Unable to load your products right now. Please try again later.');
          setUserProducts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

      loadProducts();


    return () => {
      isMounted = false;
    };
  }, []);

  const activeProduct = userProducts.find(p => p.id === activeTab);


  return (
    <div className="max-w-7xl mx-auto">
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {userProducts.length > 0 ? (
        <>
          <ProductTabsV2 products={userProducts} activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="mt-8 grid grid-cols-1 gap-6">
            <ProductDownloadCard activeProduct={activeProduct} />
            <UserMetricsCard activeProduct={activeProduct} />
          </div>
          {activeTab === AI_SCRIBE_PRODUCT_ID && ( // Conditional rendering for Transcription History
            <div className="mt-8">
              <HistorySection title="Transcription History" />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't been assigned to any Products yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductsOwned;