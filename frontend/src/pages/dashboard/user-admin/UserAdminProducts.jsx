import { useProducts } from '../../../hooks/useProducts';
import { Link } from 'react-router-dom';

function UserAdminProducts() {
  const { products, loading, error } = useProducts();

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Products</h1>
        <p className="text-xl text-gray-600">Browse and learn more about our available products.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col justify-between">
            {/* Removed product.status display as per request */}
            <div>
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xl font-semibold mb-4">
                {product.name ? product.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              {/* Removed product.productCode display as per request */}
              <p className="text-sm text-gray-600 mb-5">{product.description}</p>
            </div>
            <Link
              to={`/ai-agent/${product.endpoint}` || `/products/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full block text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserAdminProducts;