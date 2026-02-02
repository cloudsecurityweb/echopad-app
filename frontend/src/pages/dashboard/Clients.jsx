import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import ViewClientDetailsModal from '../../components/clients/ViewClientDetailsModal';
import { useAuth } from '../../contexts/AuthContext';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Clients() {
  const { isSuperAdmin } = useRole();
  const { getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  if (!isSuperAdmin) {
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
    { label: 'Total Clients', value: '247', change: '+12%', icon: '👥' },
    { label: 'Active Clients', value: '189', change: '+8%', icon: '✅' },
    { label: 'Trial Clients', value: '32', change: '+5%', icon: '🆓' },
    { label: 'New This Month', value: '18', change: '+23%', icon: '🆕' },
  ];

  const [clients, setClients] = useState([
    { id: 1, name: 'Acme Corporation', status: 'Active', products: 3, licenses: 45, subscription: 'Enterprise', autoPay: true, lastActive: '2 hours ago', joinDate: '2024-01-15' },
    { id: 2, name: 'TechStart Inc', status: 'Active', products: 2, licenses: 28, subscription: 'Professional', autoPay: true, lastActive: '1 day ago', joinDate: '2024-02-20' },
    { id: 3, name: 'Global Solutions', status: 'Active', products: 5, licenses: 120, subscription: 'Enterprise', autoPay: false, lastActive: '3 hours ago', joinDate: '2023-11-10' },
    { id: 4, name: 'Digital Ventures', status: 'Trial', products: 1, licenses: 5, subscription: 'Starter', autoPay: false, lastActive: '2 days ago', joinDate: '2024-03-01' },
    { id: 5, name: 'Innovation Labs', status: 'Active', products: 4, licenses: 67, subscription: 'Professional', autoPay: true, lastActive: '5 hours ago', joinDate: '2024-01-28' },
    { id: 6, name: 'Cloud Systems', status: 'Active', products: 2, licenses: 34, subscription: 'Professional', autoPay: true, lastActive: '1 hour ago', joinDate: '2024-02-15' },
    { id: 7, name: 'Data Analytics Co', status: 'Trial', products: 1, licenses: 3, subscription: 'Starter', autoPay: false, lastActive: '4 days ago', joinDate: '2024-03-10' },
    { id: 8, name: 'Enterprise Solutions', status: 'Active', products: 6, licenses: 200, subscription: 'Enterprise', autoPay: true, lastActive: '30 minutes ago', joinDate: '2023-09-05' },
  ]);

  const handleOpenDetailsModal = (client) => {
    // Navigate to detail page instead of opening modal
    navigate(`/dashboard/clients/${client.id}`);
  };

  const handleClientRemoved = (clientId) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
  };

  const statusDistribution = [
    { name: 'Active', value: 189, color: '#10b981' },
    { name: 'Trial', value: 32, color: '#f59e0b' },
    { name: 'Expired', value: 15, color: '#ef4444' },
    { name: 'Cancelled', value: 11, color: '#6b7280' },
  ];

  const recentActivity = [
    { id: 1, client: 'Acme Corporation', action: 'Upgraded to Enterprise plan', time: '2 hours ago' },
    { id: 2, client: 'TechStart Inc', action: 'Added 10 new licenses', time: '5 hours ago' },
    { id: 3, client: 'Digital Ventures', action: 'Started trial period', time: '1 day ago' },
    { id: 4, client: 'Innovation Labs', action: 'Enabled auto-pay', time: '2 days ago' },
  ];

  // Filter clients based on search and status
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Clients
        </h1>
        <p className="text-xl text-gray-600">
          Manage and monitor all platform clients
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

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Clients</h2>
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Last Active</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      client.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : client.status === 'Trial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
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
                  <td className="py-4 px-4 text-sm text-gray-500">{client.lastActive}</td>
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
        {/* Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Status Distribution</h2>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Client Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.client}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
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

export default Clients;


