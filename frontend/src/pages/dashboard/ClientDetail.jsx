import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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

function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSuperAdmin } = useRole();
  const { getAccessToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Permission check
  if (!isSuperAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Simulate loading
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [id]);

  // Placeholder data - to be replaced with API calls
  // In a real app, this would be fetched based on the client ID from the URL
  const client = {
    id: parseInt(id) || 1,
    name: 'Acme Corporation',
    status: 'Active',
    subscription: 'Enterprise',
    autoPay: true,
    products: 3,
    licenses: 45,
    lastActive: '2 hours ago',
    joinDate: '2024-01-15',
    email: 'contact@acme.com',
    phone: '+1 (555) 123-4567',
  };

  // Overview stats
  const overviewStats = [
    { label: 'Total Users', value: '156', change: '+8%', icon: '👥' },
    { label: 'Active Subscriptions', value: '1', change: 'Active', icon: '' },
    { label: 'Total Licenses', value: '45', change: '87% used', icon: '🔑' },
    { label: 'Monthly Revenue', value: '$2,499', change: 'Enterprise', icon: '💰' },
  ];

  // Users data
  const users = [
    { id: 1, name: 'John Doe', email: 'john@acme.com', role: 'Admin', status: 'Active', products: 3, lastActive: '2 hours ago', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@acme.com', role: 'User', status: 'Active', products: 2, lastActive: '1 day ago', joinDate: '2024-01-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@acme.com', role: 'User', status: 'Active', products: 4, lastActive: '5 minutes ago', joinDate: '2024-02-01' },
    { id: 4, name: 'Alice Williams', email: 'alice@acme.com', role: 'User', status: 'Active', products: 1, lastActive: '3 hours ago', joinDate: '2024-02-15' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@acme.com', role: 'User', status: 'Inactive', products: 2, lastActive: '1 week ago', joinDate: '2024-03-01' },
  ];

  // Subscriptions data
  const subscriptions = [
    { id: 1, plan: 'Enterprise', status: 'Active', startDate: '2024-01-15', renewalDate: '2025-01-15', autoRenew: true, amount: '$2,499/mo' },
    { id: 2, plan: 'Professional', status: 'Cancelled', startDate: '2023-06-01', renewalDate: '2024-06-01', autoRenew: false, amount: '$999/mo' },
  ];

  // Billing transactions
  const transactions = [
    { id: 1, date: '2024-06-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-001' },
    { id: 2, date: '2024-05-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-002' },
    { id: 3, date: '2024-04-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-003' },
    { id: 4, date: '2024-03-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-004' },
    { id: 5, date: '2024-02-15', description: 'Enterprise Plan - Monthly', amount: '$2,499', status: 'Paid', invoice: 'INV-2024-005' },
  ];

  // Product assignments
  const productAssignments = [
    { product: 'AI Scribe', allocated: 20, used: 18, available: 2, utilization: 90 },
    { product: 'AI DocMan', allocated: 15, used: 12, available: 3, utilization: 80 },
    { product: 'AI Medical', allocated: 10, used: 8, available: 2, utilization: 80 },
  ];

  // License utilization trend
  const licenseUtilization = [
    { month: 'Jan', used: 35, available: 10 },
    { month: 'Feb', used: 38, available: 7 },
    { month: 'Mar', used: 40, available: 5 },
    { month: 'Apr', used: 42, available: 3 },
    { month: 'May', used: 43, available: 2 },
    { month: 'Jun', used: 39, available: 6 },
  ];

  // Activity logs
  const activities = [
    { id: 1, timestamp: '2024-06-15 14:30', user: 'John Doe', action: 'Accessed', product: 'AI Scribe', details: 'Opened transcription dashboard' },
    { id: 2, timestamp: '2024-06-15 13:45', user: 'Bob Johnson', action: 'Completed', product: 'AI DocMan', details: 'Completed document processing' },
    { id: 3, timestamp: '2024-06-15 12:20', user: 'Jane Smith', action: 'Uploaded', product: 'AI Scribe', details: 'Uploaded audio file for transcription' },
    { id: 4, timestamp: '2024-06-15 11:15', user: 'Alice Williams', action: 'Accessed', product: 'AI Medical', details: 'Opened medical documentation tool' },
    { id: 5, timestamp: '2024-06-15 10:30', user: 'John Doe', action: 'Generated', product: 'AI DocMan', details: 'Generated report from documents' },
  ];

  // Client feedback
  const feedback = [
    { id: 1, productName: 'AI Scribe', date: '2024-03-15', rating: 5, subject: 'Great product, would love to see more integrations', status: 'new' },
    { id: 2, productName: 'AI DocMan', date: '2024-03-10', rating: 4, subject: 'Minor issue with document formatting', status: 'reviewed' },
    { id: 3, productName: 'AI Medical', date: '2024-03-05', rating: 5, subject: 'Outstanding customer support', status: 'resolved' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
      case 'Paid':
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'Trial':
      case 'Pending':
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
      case 'Inactive':
      case 'new':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading client details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/dashboard/clients')}
            className="text-gray-600 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Back to clients"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {client.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                client.status === 'Active'
                  ? 'bg-green-100 text-green-800'
                  : client.status === 'Trial'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {client.status}
              </span>
              <span className="text-sm text-gray-600">{client.subscription} Plan</span>
              <span className="text-sm text-gray-500">Joined: {client.joinDate}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm">
              Edit Client
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm">
              Actions
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat, index) => (
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

      {/* Client Information Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Client Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Client Name</p>
            <p className="text-base font-medium text-gray-900">{client.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
              {client.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Subscription Plan</p>
            <p className="text-base font-medium text-gray-900">{client.subscription}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Auto-Pay</p>
            {client.autoPay ? (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                ✓ Enabled
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                Disabled
              </span>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">AI Agents</p>
            <p className="text-base font-medium text-gray-900">{client.products}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Licenses</p>
            <p className="text-base font-medium text-gray-900">{client.licenses}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Last Active</p>
            <p className="text-base font-medium text-gray-900">{client.lastActive}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Join Date</p>
            <p className="text-base font-medium text-gray-900">{client.joinDate}</p>
          </div>
          {client.email && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Contact Email</p>
              <p className="text-base font-medium text-gray-900">{client.email}</p>
            </div>
          )}
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Users</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm">
            Manage Users
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agents</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'Admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{user.products}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{user.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Subscriptions Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Subscriptions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plan Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Start Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Renewal Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Auto-Renew</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{subscription.plan}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing History Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Billing History</h2>
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
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-700">{transaction.date}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{transaction.description}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">{transaction.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
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

      {/* Products & Licenses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Product Assignment Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Agent Assignment Overview</h2>
          <div className="space-y-4">
            {productAssignments.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.product}</span>
                  <span className="text-sm text-gray-600">{item.used} / {item.allocated}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.utilization}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Available: {item.available}</p>
              </div>
            ))}
          </div>
        </div>

        {/* License Utilization Trend */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">License Utilization (Last 6 Months)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={licenseUtilization}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="used" stroke="#06b6d4" strokeWidth={2} name="Used" />
              <Line type="monotone" dataKey="available" stroke="#3b82f6" strokeWidth={2} name="Available" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.action === 'Accessed' ? 'bg-cyan-500' :
                activity.action === 'Completed' ? 'bg-green-500' :
                activity.action === 'Uploaded' ? 'bg-blue-500' :
                'bg-purple-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action} - {activity.product}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Client Feedback Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Client Feedback</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm">
            View All Feedback
          </button>
        </div>
        <div className="space-y-4">
          {feedback.map((item) => (
            <div key={item.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    {item.productName && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-800">
                        {item.productName}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{item.date}</span>
                    <span className="text-sm text-gray-700">{getRatingStars(item.rating)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{item.subject}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ClientDetail;
