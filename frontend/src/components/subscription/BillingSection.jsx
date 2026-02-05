function BillingSection({ licenses, product, onRequestLicense }) {
  if (!licenses || licenses.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        No active license found for this product.
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
          <p className="text-sm text-gray-600">Billing and license details</p>
        </div>

        <button
          type="button"
          onClick={() => {
            console.log('BillingSection: Request License clicked');
            if (onRequestLicense) {
              onRequestLicense();
            } else {
              console.error('BillingSection: onRequestLicense is missing!');
            }
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm font-medium rounded-lg transition-all shadow-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Request License
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {/* <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">License ID</th> */}
              {/* <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Type</th> */}
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Total Seats</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Remaining</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Assigned On</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Expires On</th>
              <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => {
              const totalSeats = license.totalSeats ?? license.seats ?? 0;
              const usedSeats = license.usedSeats ?? 0;
              const isUnlimited = license.licenseType === 'unlimited';
              const remainingSeats = isUnlimited ? 'Unlimited' : Math.max(0, totalSeats - usedSeats);

              return (
                <tr key={license.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  {/* <td className="px-6 py-4 text-sm font-mono text-gray-900">{license.id}</td> */}
                  {/* <td className="px-6 py-4 text-sm text-gray-700 capitalize">{license.licenseType || 'seat'}</td> */}
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {isUnlimited ? 'Unlimited' : totalSeats}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {remainingSeats}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(license.startDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(license.expiresAt || license.endDate)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${license.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : license.status === 'requested'
                        ? 'bg-yellow-100 text-yellow-800'
                        : license.status === 'denied'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                      {license.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BillingSection;
