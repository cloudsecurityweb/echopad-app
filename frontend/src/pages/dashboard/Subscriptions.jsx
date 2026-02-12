import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import SubscriptionsPage from './client-admin/SubscriptionsPage';
import DashboardSectionLayout from '../../components/layout/DashboardSectionLayout';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Subscriptions() {
  const { isSuperAdmin, isClientAdmin } = useRole();
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');

  if (isClientAdmin) {
    return <SubscriptionsPage />
  }

  if (!isSuperAdmin && !isClientAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Placeholder data - to be replaced with API calls
  const summaryStats = [
    { label: 'Total Subscriptions', value: '189', change: '+8%', icon: '📊' },
    { label: 'Active', value: '165', change: '+5%', icon: '✅' },
    { label: 'Expiring Soon', value: '12', change: '-2%', icon: '⏰' },
    { label: 'Monthly Revenue', value: '$124.5K', change: '+23%', icon: '💰' },
  ];

  const subscriptions = [
    { id: 1, client: 'Acme Corporation', plan: 'Enterprise', status: 'Active', startDate: '2024-01-15', renewalDate: '2025-01-15', autoRenew: true, amount: '$2,499/mo' },
    { id: 2, client: 'TechStart Inc', plan: 'Professional', status: 'Active', startDate: '2024-02-20', renewalDate: '2025-02-20', autoRenew: true, amount: '$999/mo' },
    { id: 3, client: 'Global Solutions', plan: 'Enterprise', status: 'Active', startDate: '2023-11-10', renewalDate: '2024-11-10', autoRenew: false, amount: '$2,499/mo' },
    { id: 4, client: 'Digital Ventures', plan: 'Starter', status: 'Trial', startDate: '2024-03-01', renewalDate: '2024-03-31', autoRenew: false, amount: '$99/mo' },
    { id: 5, client: 'Innovation Labs', plan: 'Professional', status: 'Active', startDate: '2024-01-28', renewalDate: '2025-01-28', autoRenew: true, amount: '$999/mo' },
    { id: 6, client: 'Cloud Systems', plan: 'Professional', status: 'Active', startDate: '2024-02-15', renewalDate: '2025-02-15', autoRenew: true, amount: '$999/mo' },
    { id: 7, client: 'Enterprise Solutions', plan: 'Enterprise', status: 'Active', startDate: '2023-09-05', renewalDate: '2024-09-05', autoRenew: true, amount: '$2,499/mo' },
  ];

  const statusDistribution = [
    { name: 'Active', value: 165, color: '#10b981' },
    { name: 'Trial', value: 12, color: '#f59e0b' },
    { name: 'Expiring Soon', value: 8, color: '#ef4444' },
    { name: 'Cancelled', value: 4, color: '#6b7280' },
  ];

  const revenueTrend = [
    { month: 'Jan', revenue: 95000 },
    { month: 'Feb', revenue: 105000 },
    { month: 'Mar', revenue: 112000 },
    { month: 'Apr', revenue: 118000 },
    { month: 'May', revenue: 124500 },
    { month: 'Jun', revenue: 131000 },
  ];

  const upcomingRenewals = subscriptions
    .filter(sub => sub.status === 'Active')
    .sort((a, b) => new Date(a.renewalDate) - new Date(b.renewalDate))
    .slice(0, 5);

  // Filter subscriptions
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesStatus = statusFilter === 'all' || sub.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPlan = planFilter === 'all' || sub.plan.toLowerCase() === planFilter.toLowerCase();
    return matchesStatus && matchesPlan;
  });

  return (
    <DashboardSectionLayout
      title="Subscriptions"
      description={isSuperAdmin ? 'Manage all platform subscriptions' : 'View your organization subscriptions'}
    >
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <span className="text-sm font-semibold text-green-600">{stat.change}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expiring">Expiring Soon</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={planFilter}
              onChange={(e) => setPlanFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Plans</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          {isSuperAdmin && (
            <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium">
              Create Subscription
            </button>
          )}
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Start Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Renewal Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Auto-Renew</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{subscription.client}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{subscription.plan}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      subscription.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : subscription.status === 'Trial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{subscription.startDate}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{subscription.renewalDate}</td>
                  <td className="py-4 px-4">
                    {subscription.autoRenew ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">{subscription.amount}</td>
                  <td className="py-4 px-4">
                    <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Status Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Renewals */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Renewals</h2>
        <div className="space-y-4">
          {upcomingRenewals.map((renewal) => (
            <div key={renewal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div>
                <p className="font-medium text-gray-900">{renewal.client}</p>
                <p className="text-sm text-gray-600">{renewal.plan} Plan • {renewal.amount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Renews: {renewal.renewalDate}</p>
                <p className="text-xs text-gray-500">
                  {renewal.autoRenew ? 'Auto-renew enabled' : 'Manual renewal required'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </DashboardSectionLayout>
  );
}

export default Subscriptions;
