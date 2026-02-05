import { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useRole } from '../../contexts/RoleContext';
import AnalyticsPage from './client-admin/AnalyticsPage';
import { useSuperAdminAnalytics } from '../../hooks/useSuperAdminAnalytics';

function formatMetricLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function getMetricCategory(key) {
  const normalized = key.toLowerCase();
  if (normalized.includes("client")) return "clients";
  if (normalized.includes("license")) return "licenses";
  if (normalized.includes("user")) return "users";
  if (normalized.includes("invite")) return "invites";
  if (normalized.includes("feedback")) return "feedback";
  return "other";
}

const PIE_COLORS = ["#06b6d4", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

function Analytics() {
  const { isSuperAdmin, isClientAdmin } = useRole();
  const { analytics, loading, error } = useSuperAdminAnalytics();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortDirection, setSortDirection] = useState("desc");
  const [topCount, setTopCount] = useState("8");
  const [searchTerm, setSearchTerm] = useState("");

  if (isClientAdmin) {
    return <AnalyticsPage />;
  }

  if (!isSuperAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const dashboardMetrics = analytics?.dashboard?.data || {};
  const totals = analytics?.totals || {};

  const metricEntries = useMemo(() => {
    return Object.entries(dashboardMetrics)
      .filter(([, value]) => typeof value === "number")
      .map(([key, value]) => ({
        key,
        label: formatMetricLabel(key),
        value,
        category: getMetricCategory(key),
      }));
  }, [dashboardMetrics]);

  const filteredMetrics = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return metricEntries
      .filter((item) => {
        if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
        if (!term) return true;
        return item.label.toLowerCase().includes(term);
      })
      .sort((a, b) => {
        const diff = a.value - b.value;
        return sortDirection === "asc" ? diff : -diff;
      });
  }, [metricEntries, categoryFilter, searchTerm, sortDirection]);

  const chartMetrics = useMemo(() => {
    if (topCount === "all") return filteredMetrics;
    const count = Number(topCount) || filteredMetrics.length;
    return filteredMetrics.slice(0, count);
  }, [filteredMetrics, topCount]);

  const totalsData = useMemo(() => {
    const items = [
      { name: "Clients", value: totals.clients || 0 },
      { name: "Feedback", value: totals.feedback || 0 },
      { name: "Help Docs", value: totals.helpDocs || 0 },
    ].filter((item) => item.value > 0);

    return items;
  }, [totals]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Analytics
        </h1>
        <p className="text-xl text-gray-600">
          Platform-wide insights for super admin monitoring
        </p>
      </div>

      {loading && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
          Loading analytics...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totals.clients ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totals.feedback ?? 0}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Help Center Docs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totals.helpDocs ?? 0}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Metrics Explorer</h2>
                {analytics?.dashboard?.updatedAt && (
                  <p className="text-sm text-gray-500">
                    Updated {formatDate(analytics.dashboard.updatedAt)}
                  </p>
                )}
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200">
                Super Admin
              </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />

              <div className="flex flex-wrap gap-3">
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="clients">Clients</option>
                  <option value="users">Users</option>
                  <option value="licenses">Licenses</option>
                  <option value="invites">Invites</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>

                <select
                  value={sortDirection}
                  onChange={(event) => setSortDirection(event.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>

                <select
                  value={topCount}
                  onChange={(event) => setTopCount(event.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="5">Top 5</option>
                  <option value="8">Top 8</option>
                  <option value="12">Top 12</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>

            {metricEntries.length === 0 ? (
              <div className="text-gray-600">No metrics available yet.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  {chartMetrics.length === 0 ? (
                    <div className="text-gray-600">No metrics match your filters.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <BarChart data={chartMetrics} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="label" width={140} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">Totals Mix</h3>
                  {totalsData.length === 0 ? (
                    <div className="text-gray-600">Totals not available.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <Pie
                          data={totalsData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          dataKey="value"
                        >
                          {totalsData.map((entry, index) => (
                            <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredMetrics.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Metric Details</h2>
                <span className="text-xs text-gray-500">
                  Showing {filteredMetrics.length} metrics
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500">
                      <th className="py-2 text-left font-semibold">Metric</th>
                      <th className="py-2 text-left font-semibold">Category</th>
                      <th className="py-2 text-right font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMetrics.map((item) => (
                      <tr key={item.key} className="border-b border-gray-100">
                        <td className="py-3 pr-4 text-gray-900">{item.label}</td>
                        <td className="py-3 pr-4 text-gray-600 capitalize">{item.category}</td>
                        <td className="py-3 text-right font-semibold text-gray-900">
                          {item.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Analytics;
