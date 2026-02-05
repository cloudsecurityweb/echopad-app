import { Link } from 'react-router-dom';

function ProductCard({ product, isSubscribed }) {
  const name = product.name;
  const description = product.description || product.shortDescription || 'AI product for your organization.';
  const initial = name ? name.charAt(0).toUpperCase() : 'P';
  const endpoint = product.endpoint || `/products/${product.id}`;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center text-xl font-semibold">
          {initial}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isSubscribed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
          {isSubscribed ? 'Subscribed' : 'Available'}
        </span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-600 mb-5">{description}</p>
      {isSubscribed ? (
        <button
          className="w-full px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 cursor-default"
          disabled
        >
          Subscribed
        </button>
      ) : (
        <Link
          to={endpoint.startsWith('/') ? endpoint : `/${endpoint}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
        >
          View Details
        </Link>
      )}
    </div>
  );
}

export default ProductCard;