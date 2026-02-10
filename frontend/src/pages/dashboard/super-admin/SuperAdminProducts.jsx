import { useState } from 'react';
import { useProducts } from '../../../hooks/useProducts';
import ProductModal from './components/ProductModal';
import DeleteProductModal from './components/DeleteProductModal';
import { createProduct, updateProduct, deleteProduct } from '../../../api/products.api';
import { toast } from 'react-toastify';

function SuperAdminProducts() {
  const { products, loading: productsLoading, error: productsError, refetch } = useProducts();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
      refetch();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(`Failed to save product: ${error?.response?.data?.message || error.message}`);
    }
  };

  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async (productCode) => {
    await deleteProduct(productCode);
    toast.success('Product deleted successfully');
    refetch();
  };


  if (productsLoading) {
    return (
      <div className="max-w-7xl mx-auto animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-10 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-5 w-72 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-gray-200 rounded"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-3 w-48 bg-gray-200 rounded pt-4 border-t border-gray-200"></div>
              <div className="h-10 w-full bg-gray-200 rounded-lg mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${product.status === 'ACTIVE'
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
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => handleOpenModal(product)}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-sm cursor-pointer"
              >
                Update
              </button>
              <button
                onClick={() => handleOpenDeleteModal(product)}
                className="px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm cursor-pointer flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        product={selectedProduct}
      />
      <DeleteProductModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onDelete={handleDelete}
        product={productToDelete}
      />
    </div>
  );
}

export default SuperAdminProducts;

