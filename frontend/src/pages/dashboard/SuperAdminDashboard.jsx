import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import ViewClientDetailsModal from '../../components/clients/ViewClientDetailsModal';
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

function SuperAdminDashboard() {
  const { isSuperAdmin, isLoadingRole } = useRole();
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  // Placeholder data - to be replaced with API calls
  const overviewStats = [
    { label: 'Total Clients', value: '247', change: '+12%', icon: '👥' },
    { label: 'Active Subscriptions', value: '189', change: '+8%', icon: '' },
    { label: 'Total Licenses', value: '1,234', change: '+15%', icon: '🔑' },
    { label: 'Monthly Revenue', value: '$124.5K', change: '+23%', icon: '💰' },
    { label: 'Client Feedback', value: '8', change: '+3', icon: '💬' },
  ];

  const [recentClients, setRecentClients] = useState([
    { id: 1, name: 'Acme Corporation', status: 'Active', products: 3, licenses: 45, autoPay: true, subscription: 'Enterprise' },
    { id: 2, name: 'TechStart Inc', status: 'Active', products: 2, licenses: 28, autoPay: true, subscription: 'Professional' },
    { id: 3, name: 'Global Solutions', status: 'Active', products: 5, licenses: 120, autoPay: false, subscription: 'Enterprise' },
    { id: 4, name: 'Digital Ventures', status: 'Trial', products: 1, licenses: 5, autoPay: false, subscription: 'Starter' },
    { id: 5, name: 'Innovation Labs', status: 'Active', products: 4, licenses: 67, autoPay: true, subscription: 'Professional' },
  ]);

  const handleOpenDetailsModal = (client) => {
    // Navigate to detail page instead of opening modal
    navigate(`/dashboard/clients/${client.id}`);
  };

  const handleClientRemoved = (clientId) => {
    setRecentClients(prevClients => prevClients.filter(client => client.id !== clientId));
  };

  const productUsageByClient = [
    { client: 'Acme Corp', 'AI Scribe': 1247, 'AI DocMan': 856, 'AI Medical': 523 },
    { client: 'TechStart', 'AI Scribe': 892, 'AI DocMan': 634, 'AI Medical': 312 },
    { client: 'Global Sol', 'AI Scribe': 2156, 'AI DocMan': 1890, 'AI Medical': 1456 },
  ];

  const subscriptionStatus = [
    { name: 'Active', value: 189, color: '#10b981' },
    { name: 'Trial', value: 32, color: '#f59e0b' },
    { name: 'Expired', value: 15, color: '#ef4444' },
    { name: 'Cancelled', value: 11, color: '#6b7280' },
  ];

  const licenseAllocation = [
    { product: 'AI Scribe', allocated: 450, used: 387, available: 63 },
    { product: 'AI DocMan', allocated: 320, used: 298, available: 22 },
    { product: 'AI Medical', allocated: 280, used: 245, available: 35 },
    { product: 'AI Receptionist', allocated: 184, used: 156, available: 28 },
  ];

  // Recent feedback data - to be replaced with API calls
  const recentFeedback = [
    { id: 1, clientName: 'Acme Corporation', productName: 'AI Scribe', date: '2024-03-15', rating: 5, subject: 'Great product, would love to see more integrations', status: 'new' },
    { id: 2, clientName: 'TechStart Inc', productName: 'AI Scribe', date: '2024-03-14', rating: 4, subject: 'Minor issue with audio quality detection', status: 'reviewed' },
    { id: 3, clientName: 'Global Solutions', productName: 'AI DocMan', date: '2024-03-13', rating: 5, subject: 'Outstanding customer support', status: 'resolved' },
    { id: 4, clientName: 'Digital Ventures', productName: 'AI Medical Assistant', date: '2024-03-12', rating: 3, subject: 'UI could be more intuitive', status: 'reviewed' },
    { id: 5, clientName: 'Innovation Labs', productName: 'AI Scribe', date: '2024-03-11', rating: 4, subject: 'Request for bulk export functionality', status: 'new' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  // Only show permission error if role is loaded and confirmed as non-SuperAdmin
  // Don't block rendering while role is loading
  if (!isLoadingRole && !isSuperAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Super Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Complete platform visibility and control
        </p>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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

      {/* Recent Clients Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Clients</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agents</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Licenses</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subscription</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Auto-Pay</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{client.products}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{client.licenses}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{client.subscription}</td>
                  <td className="py-4 px-4">
                    {client.autoPay ? (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✓ Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => handleOpenDetailsModal(client)}
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                    >
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
        {/* AI Agent Usage by Client */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Agent Usage by Client</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productUsageByClient}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="client" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="AI Scribe" fill="#06b6d4" />
              <Bar dataKey="AI DocMan" fill="#3b82f6" />
              <Bar dataKey="AI Medical" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Subscription Status */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={subscriptionStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {subscriptionStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* License Allocation */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">License Allocation</h2>
        <div className="space-y-4">
          {licenseAllocation.map((item, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{item.product}</h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">Used: <span className="font-semibold text-gray-900">{item.used}</span></span>
                  <span className="text-gray-600">Available: <span className="font-semibold text-green-600">{item.available}</span></span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(item.used / item.allocated) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Total Allocated: {item.allocated}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Feedback Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Recent Client Feedback</h2>
          <Link
            to="/dashboard/client-feedback"
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm"
          >
            View All Feedback
          </Link>
        </div>
        <div className="space-y-4">
          {recentFeedback.map((feedback) => (
            <div key={feedback.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 p-3 rounded-lg transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{feedback.clientName}</p>
                    {feedback.productName && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-100 text-cyan-800">
                        {feedback.productName}
                      </span>
                    )}
                    <span className="text-sm text-gray-500">{feedback.date}</span>
                    <span className="text-sm text-gray-700">{getRatingStars(feedback.rating)}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{feedback.subject}</p>
                </div>
                <Link
                  to="/dashboard/client-feedback"
                  className="text-cyan-600 hover:text-cyan-700 font-medium text-sm ml-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-1">Manage AI Agents</h3>
            <p className="text-sm text-gray-600">Configure platform AI agents and features</p>
          </button>
          <Link
            to="/dashboard/client-feedback"
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200 block"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Client Feedback</h3>
            <p className="text-sm text-gray-600">View and manage all client feedback</p>
          </Link>
        </div>
      </div>

      {/* View Client Details Modal */}
      <ViewClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedClient(null);
        }}
        client={selectedClient}
        onRemove={handleClientRemoved}
      />
    </div>
  );
}

export default SuperAdminDashboard;



