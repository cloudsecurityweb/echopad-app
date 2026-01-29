function MetricCard({ label, value, change }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">{label}</p>
        {change && (
          <span className="text-xs font-semibold text-green-600">
            {change}
          </span>
        )}
      </div>

      <p className="text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

export default MetricCard;
