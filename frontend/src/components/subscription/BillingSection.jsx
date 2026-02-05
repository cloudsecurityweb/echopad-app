function BillingSection({ license, product }) {
  if (!license) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        No active license found for this product.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">Billing and license details</p>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          license.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
        }`}>
          {license.status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">License Type</p>
          <p className="text-lg font-semibold text-gray-900">{license.licenseType || 'seat'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Total Seats</p>
          <p className="text-lg font-semibold text-gray-900">{license.totalSeats ?? license.seats ?? 'Unlimited'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Used Seats</p>
          <p className="text-lg font-semibold text-gray-900">{license.usedSeats ?? 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Start Date</p>
          <p className="text-sm font-medium text-gray-900">{license.startDate ? new Date(license.startDate).toLocaleDateString() : '—'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">End Date</p>
          <p className="text-sm font-medium text-gray-900">{license.endDate ? new Date(license.endDate).toLocaleDateString() : '—'}</p>
        </div>
      </div>
    </div>
  );
}

export default BillingSection;
