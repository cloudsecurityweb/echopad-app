import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
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
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Billing() {
  const { isClientAdmin } = useRole();
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  if (!isClientAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Placeholder data - to be replaced with API calls
  // Client Admin sees organization-specific billing data
  const summaryStats = [
    { label: 'Current Plan', value: 'Enterprise', change: 'Active', icon: '📦' },
    { label: 'Monthly Cost', value: '$2,499', change: 'Auto-renew', icon: '💰' },
    { label: 'Pending', value: '$0', change: '0', icon: '⏳' },
    { label: 'Next Billing', value: 'Jul 15', change: '2024', icon: '📅' },
  ];

  // Client Admin sees only their organization's transactions
  const allTransactions = [
    { id: 1, date: '2024-06-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-001', organizationId: 1 },
    { id: 2, date: '2024-05-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-002', organizationId: 1 },
    { id: 3, date: '2024-04-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-003', organizationId: 1 },
    { id: 4, date: '2024-03-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-004', organizationId: 1 },
  ];

  // Filter to their organization (assuming organizationId: 1 for demo)
  const transactions = allTransactions.filter(t => t.organizationId === 1);

  // Calculate payment status from filtered transactions
  const paymentStatusData = transactions.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] || 0) + 1;
    return acc;
  }, {});
  
  const paymentStatus = [
    { name: 'Paid', value: paymentStatusData.Paid || 0, color: '#10b981' },
    { name: 'Pending', value: paymentStatusData.Pending || 0, color: '#f59e0b' },
    { name: 'Overdue', value: paymentStatusData.Overdue || 0, color: '#ef4444' },
    { name: 'Refunded', value: paymentStatusData.Refunded || 0, color: '#6b7280' },
  ].filter(item => item.value > 0);

  // Monthly spending for Client Admin's organization
  const monthlyRevenue = [
    { month: 'Jan', revenue: 2499 },
    { month: 'Feb', revenue: 2499 },
    { month: 'Mar', revenue: 2499 },
    { month: 'Apr', revenue: 2499 },
    { month: 'May', revenue: 2499 },
    { month: 'Jun', revenue: 2499 },
  ];

  // Upcoming invoices for Client Admin's organization
  const upcomingInvoices = [
    { id: 1, amount: '$2,499', dueDate: '2024-07-15', plan: 'Enterprise', organizationId: 1 },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesStatus = statusFilter === 'all' || transaction.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Billing
        </h1>
        <p className="text-xl text-gray-600">
          View and manage your organization's billing and invoices
        </p>
      </div>

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
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium">
            Generate Report
          </button>
        </div>
      </div>

      {/* Billing Transactions Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Payment History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Invoice</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-700">{transaction.date}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{transaction.description}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">{transaction.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : transaction.status === 'Overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-cyan-600 font-medium">{transaction.invoice}</td>
                  <td className="py-4 px-4">
                    <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                      View Invoice
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
        {/* Payment Status Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Spending */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#06b6d4" name="Spending ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Payments</h2>
        <div className="space-y-4">
          {upcomingInvoices.length > 0 ? (
            upcomingInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-600">{invoice.plan} Plan</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{invoice.amount}</p>
                  <p className="text-xs text-gray-500">Due: {invoice.dueDate}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No upcoming payments</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Billing;



