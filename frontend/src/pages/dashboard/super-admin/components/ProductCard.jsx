import Card from "./Card";
import LicenseUsageBar from "./LicenseUsageBar";

function ProductCard({ product, license, onManage, onAnalytics }) {
  const usagePercent =
    license && license.allocated
      ? (license.used / license.allocated) * 100
      : 0;

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {product.description}
          </p>
        </div>

        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${
            product.status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {product.status}
        </span>
      </div>

      {license && (
        <div className="mb-4">
          <LicenseUsageBar percent={usagePercent} />
          <p className="text-xs text-gray-500 mt-1">
            {license.used} / {license.allocated} licenses used
          </p>
        </div>
      )}

      <div className="flex gap-3 mt-4">
        <button
          onClick={onAnalytics}
          className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50"
        >
          View Analytics
        </button>

        <button
          onClick={onManage}
          className="flex-1 px-3 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
        >
          Manage
        </button>
      </div>
    </Card>
  );
}

export default ProductCard;
