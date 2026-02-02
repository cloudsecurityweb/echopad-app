import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function AnalyticsOverview({ summary, loading, error }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        No analytics data available yet.
      </div>
    );
  }

  const cards = [
    { label: 'Active Users', value: summary.activeUsers ?? summary?.uniqueUsers ?? 0 },
    { label: 'Total Events', value: summary.totalEvents ?? 0 },
    { label: 'Products Active', value: summary.activeProducts ?? 0 },
  ];

  const usageByProduct = summary.usageByProduct || [];
  const licenseUtilization = summary.licenseUtilization || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500">{card.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-2">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Usage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={usageByProduct}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">License Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={licenseUtilization}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usedSeats" fill="#06b6d4" name="Used Seats" />
                <Bar dataKey="totalSeats" fill="#94a3b8" name="Total Seats" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsOverview;
