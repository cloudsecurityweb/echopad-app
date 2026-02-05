import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function UsageSection({ usage, loading, error }) {

  console.log('Rendering UsageSection with usage:', usage, 'loading:', loading, 'error:', error);
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        Loading usage metrics...
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

  if (!usage) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
        No usage data available for this product yet.
      </div>
    );
  }

  const trend = usage.trend || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Usage</h3>
        <p className="text-sm text-gray-600">Recent activity for this product.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Active Users</p>
          <p className="text-2xl font-semibold text-gray-900">{usage.activeUsers ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Events (7d)</p>
          <p className="text-2xl font-semibold text-gray-900">{usage.events7d ?? 0}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Events (30d)</p>
          <p className="text-2xl font-semibold text-gray-900">{usage.events30d ?? 0}</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default UsageSection;
