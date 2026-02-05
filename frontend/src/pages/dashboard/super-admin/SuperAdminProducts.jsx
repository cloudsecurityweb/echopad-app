import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import ProductModal from './components/ProductModal';
import { createProduct, updateProduct } from '../../../api/products.api';

function SuperAdminProducts() {
  const { products, loading: productsLoading, error: productsError, setRefreshKey } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenModal = (product = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleSave = async (productData) => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.productCode, productData);
      } else {
        await createProduct(productData);
      }
      setRefreshKey(prev => prev + 1);
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save product:", error);
      // You might want to show an error message to the user
    }
  };


  if (productsLoading) {
    return <div>Loading products and stats...</div>;
  }

  if (productsError) {
    return (
      <div className="text-red-500">
        Error loading data: {productsError?.message}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Products</h1>
          <p className="text-xl text-gray-600">Manage all products and configurations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Add Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between relative">
            {product.status && (
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  product.status === 'ACTIVE' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {product.status}
                </span>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="bi bi-robot text-white text-2xl"></i> {/* Placeholder icon */}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.productCode}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-2">{product.description}</p>
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
              <p className="text-xs text-gray-500">Endpoint: {product.endpoint}</p>
            </div>
            <button
              onClick={() => handleOpenModal(product)}
              className="mt-6 w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-sm"
            >
              Update
            </button>
          </div>
        ))}
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        product={selectedProduct}
      />
    </div>
  );
}

export default SuperAdminProducts;

