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
import DashboardSectionLayout from '../../components/layout/DashboardSectionLayout';

function Licenses() {
  const { isSuperAdmin, isClientAdmin } = useRole();
  const [productFilter, setProductFilter] = useState('all');
  const [clientFilter, setClientFilter] = useState('all');

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
    { label: 'Total Licenses', value: '1,234', change: '+15%', icon: '🔑' },
    { label: 'Allocated', value: '1,156', change: '+12%', icon: '📦' },
    { label: 'Used', value: '1,086', change: '+18%', icon: '✅' },
    { label: 'Available', value: '148', change: '-5%', icon: '🆓' },
  ];

  const licenseAllocation = [
    { product: 'AI Scribe', totalAllocated: 450, used: 387, available: 63, utilization: 86 },
    { product: 'AI DocMan', totalAllocated: 320, used: 298, available: 22, utilization: 93 },
    { product: 'AI Medical Assistant', totalAllocated: 280, used: 245, available: 35, utilization: 88 },
    { product: 'AI Receptionist', totalAllocated: 184, used: 156, available: 28, utilization: 85 },
  ];

  const utilizationByProduct = licenseAllocation.map(item => ({
    name: item.product,
    utilization: item.utilization,
  }));

  const distributionByClient = [
    { client: 'Acme Corp', licenses: 45, percentage: 4.1 },
    { client: 'TechStart', licenses: 28, percentage: 2.5 },
    { client: 'Global Sol', licenses: 120, percentage: 10.9 },
    { client: 'Innovation Labs', licenses: 67, percentage: 6.1 },
    { client: 'Cloud Systems', licenses: 34, percentage: 3.1 },
    { client: 'Enterprise Sol', licenses: 200, percentage: 18.2 },
  ];

  const topClientsByUsage = [
    { client: 'Enterprise Solutions', product: 'AI Scribe', used: 85, allocated: 100 },
    { client: 'Global Solutions', product: 'AI DocMan', used: 78, allocated: 90 },
    { client: 'Acme Corporation', product: 'AI Medical', used: 45, allocated: 50 },
    { client: 'Innovation Labs', product: 'AI Scribe', used: 42, allocated: 50 },
  ];

  // Active licenses with user details - placeholder data
  const activeLicensesWithUsers = [
    { id: 1, userId: 101, userName: 'John Doe', userEmail: 'john.doe@acmecorp.com', product: 'AI Scribe', client: 'Acme Corporation', assignedDate: '2024-01-15', status: 'Active' },
    { id: 2, userId: 102, userName: 'Jane Smith', userEmail: 'jane.smith@acmecorp.com', product: 'AI Scribe', client: 'Acme Corporation', assignedDate: '2024-01-20', status: 'Active' },
    { id: 3, userId: 103, userName: 'Robert Johnson', userEmail: 'robert.j@techstart.com', product: 'AI DocMan', client: 'TechStart Inc', assignedDate: '2024-02-01', status: 'Active' },
    { id: 4, userId: 104, userName: 'Emily Davis', userEmail: 'emily.davis@globalsol.com', product: 'AI Medical Assistant', client: 'Global Solutions', assignedDate: '2024-02-05', status: 'Active' },
    { id: 5, userId: 105, userName: 'Michael Brown', userEmail: 'michael.brown@globalsol.com', product: 'AI Scribe', client: 'Global Solutions', assignedDate: '2024-02-10', status: 'Active' },
    { id: 6, userId: 106, userName: 'Sarah Wilson', userEmail: 'sarah.wilson@innovationlabs.com', product: 'AI Receptionist', client: 'Innovation Labs', assignedDate: '2024-02-15', status: 'Active' },
    { id: 7, userId: 107, userName: 'David Martinez', userEmail: 'david.m@enterprisesol.com', product: 'AI Scribe', client: 'Enterprise Solutions', assignedDate: '2024-02-20', status: 'Active' },
    { id: 8, userId: 108, userName: 'Lisa Anderson', userEmail: 'lisa.anderson@acmecorp.com', product: 'AI DocMan', client: 'Acme Corporation', assignedDate: '2024-03-01', status: 'Active' },
    { id: 9, userId: 109, userName: 'James Taylor', userEmail: 'james.taylor@techstart.com', product: 'AI Medical Assistant', client: 'TechStart Inc', assignedDate: '2024-03-05', status: 'Active' },
    { id: 10, userId: 110, userName: 'Patricia White', userEmail: 'patricia.white@globalsol.com', product: 'AI Receptionist', client: 'Global Solutions', assignedDate: '2024-03-10', status: 'Active' },
    { id: 11, userId: 111, userName: 'Christopher Lee', userEmail: 'chris.lee@innovationlabs.com', product: 'AI Scribe', client: 'Innovation Labs', assignedDate: '2024-03-15', status: 'Active' },
    { id: 12, userId: 112, userName: 'Amanda Harris', userEmail: 'amanda.harris@enterprisesol.com', product: 'AI DocMan', client: 'Enterprise Solutions', assignedDate: '2024-03-20', status: 'Active' },
  ];

  // Get unique clients for filter dropdown
  const uniqueClients = [...new Set(activeLicensesWithUsers.map(license => license.client))].sort();

  // Filter by product
  const filteredAllocation = productFilter === 'all' 
    ? licenseAllocation 
    : licenseAllocation.filter(item => item.product.toLowerCase().includes(productFilter.toLowerCase()));

  // Filter active licenses by product and client
  const filteredActiveLicenses = activeLicensesWithUsers.filter(license => {
    const matchesProduct = productFilter === 'all' || 
      license.product.toLowerCase().includes(productFilter.toLowerCase());
    const matchesClient = clientFilter === 'all' || 
      license.client === clientFilter;
    return matchesProduct && matchesClient;
  });

  return (
    <DashboardSectionLayout
      title="Licenses"
      description={isSuperAdmin ? 'Manage license allocation across all clients' : 'View and manage your organization licenses'}
    >
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-64">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All AI Agents</option>
              <option value="ai scribe">AI Scribe</option>
              <option value="ai docman">AI DocMan</option>
              <option value="ai medical">AI Medical Assistant</option>
              <option value="ai receptionist">AI Receptionist</option>
            </select>
          </div>
          {isSuperAdmin && (
            <>
              <div className="md:w-64">
                <select
                  value={clientFilter}
                  onChange={(e) => setClientFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="all">All Clients</option>
                  {uniqueClients.map((client) => (
                    <option key={client} value={client}>{client}</option>
                  ))}
                </select>
              </div>
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium">
                Allocate Licenses
              </button>
            </>
          )}
          {isClientAdmin && (
            <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium">
              Assign License
            </button>
          )}
        </div>
      </div>

      {/* License Allocation Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">License Allocation by AI Agent</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Allocated</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Used</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Available</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Utilization</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAllocation.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.product}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{item.totalAllocated}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{item.used}</td>
                  <td className="py-4 px-4 text-sm font-semibold text-green-600">{item.available}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.utilization >= 90 ? 'bg-red-500' :
                            item.utilization >= 75 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${item.utilization}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-700">{item.utilization}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-cyan-600 hover:text-cyan-700 font-medium text-sm">
                      Manage
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
        {/* Utilization by Product */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">License Utilization by AI Agent</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={utilizationByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilization" fill="#06b6d4" name="Utilization %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution by Client (Super Admin only) */}
        {isSuperAdmin && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">License Distribution by Client</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionByClient}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="client" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="licenses" fill="#3b82f6" name="Licenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top Clients by License Usage (Super Admin only) */}
      {isSuperAdmin && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Top Clients by License Usage</h2>
          <div className="space-y-4">
            {topClientsByUsage.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium text-gray-900">{item.client}</p>
                  <p className="text-sm text-gray-600">{item.product}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{item.used} / {item.allocated} used</p>
                  <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
                      style={{ width: `${(item.used / item.allocated) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Licenses with User Details (Super Admin only) */}
      {isSuperAdmin && (
        <>
          {/* Active Licenses Summary Card */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">👥</div>
              <span className="text-sm font-semibold text-green-600">Active</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Active Licenses</p>
            <p className="text-3xl font-bold text-gray-900">{activeLicensesWithUsers.length}</p>
          </div>

          {/* Active Licenses User Details Table */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Active Licenses - User Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agent</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client/Organization</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActiveLicenses.length > 0 ? (
                    filteredActiveLicenses.map((license) => (
                      <tr key={license.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{license.userName}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{license.userEmail}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{license.product}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{license.client}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{license.assignedDate}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {license.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="py-8 px-4 text-center text-sm text-gray-500">
                        No active licenses found matching the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
    </DashboardSectionLayout>
  );
}

export default Licenses;


