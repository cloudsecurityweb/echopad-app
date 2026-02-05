import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function Activity() {
  const { isClientAdmin } = useRole();
  const [userFilter, setUserFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

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
  const summaryStats = [
    { label: 'Total Activities', value: '2,847', change: '+12%', icon: '📊' },
    { label: 'Today', value: '142', change: '+8%', icon: '📅' },
    { label: 'This Week', value: '856', change: '+15%', icon: '📆' },
    { label: 'This Month', value: '2,847', change: '+23%', icon: '🗓️' },
  ];

  const activities = [
    { id: 1, timestamp: '2024-06-15 14:30', user: 'John Doe', action: 'Accessed', product: 'AI Scribe', details: 'Opened transcription dashboard' },
    { id: 2, timestamp: '2024-06-15 13:45', user: 'Bob Johnson', action: 'Assigned License', product: 'AI DocMan', details: 'Assigned license to new user' },
    { id: 3, timestamp: '2024-06-15 12:20', user: 'Jane Smith', action: 'Completed', product: 'AI DocMan', details: 'Completed document processing' },
    { id: 4, timestamp: '2024-06-15 11:15', user: 'Alice Williams', action: 'Revoked License', product: 'AI Scribe', details: 'Revoked license from inactive user' },
    { id: 5, timestamp: '2024-06-15 10:30', user: 'Charlie Brown', action: 'Accessed', product: 'AI Medical Assistant', details: 'Opened medical documentation tool' },
    { id: 6, timestamp: '2024-06-15 09:45', user: 'John Doe', action: 'Uploaded', product: 'AI Scribe', details: 'Uploaded audio file for transcription' },
    { id: 7, timestamp: '2024-06-15 08:20', user: 'Diana Prince', action: 'Generated', product: 'AI DocMan', details: 'Generated report from documents' },
  ];

  const activityTimeline = [
    { hour: '00:00', activities: 5 },
    { hour: '04:00', activities: 8 },
    { hour: '08:00', activities: 45 },
    { hour: '12:00', activities: 62 },
    { hour: '16:00', activities: 38 },
    { hour: '20:00', activities: 24 },
  ];

  const activityByProduct = [
    { product: 'AI Scribe', count: 856, percentage: 30 },
    { product: 'AI DocMan', count: 634, percentage: 22 },
    { product: 'AI Medical', count: 523, percentage: 18 },
    { product: 'AI Receptionist', count: 834, percentage: 30 },
  ];

  const activityByAction = [
    { action: 'Accessed', count: 1247 },
    { action: 'Completed', count: 856 },
    { action: 'Uploaded', count: 523 },
    { action: 'Assigned', count: 189 },
    { action: 'Revoked', count: 32 },
  ];

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesUser = userFilter === 'all' || activity.user.toLowerCase().includes(userFilter.toLowerCase());
    const matchesProduct = productFilter === 'all' || activity.product.toLowerCase().includes(productFilter.toLowerCase());
    const matchesAction = actionFilter === 'all' || activity.action.toLowerCase() === actionFilter.toLowerCase();
    return matchesUser && matchesProduct && matchesAction;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Activity
        </h1>
        <p className="text-xl text-gray-600">
          Monitor user activity and system events
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
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Users</option>
              <option value="john">John Doe</option>
              <option value="jane">Jane Smith</option>
              <option value="bob">Bob Johnson</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All AI Agents</option>
              <option value="ai scribe">AI Scribe</option>
              <option value="ai docman">AI DocMan</option>
              <option value="ai medical">AI Medical</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Actions</option>
              <option value="accessed">Accessed</option>
              <option value="completed">Completed</option>
              <option value="uploaded">Uploaded</option>
              <option value="assigned">Assigned</option>
              <option value="revoked">Revoked</option>
            </select>
          </div>
          <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium">
            Export Log
          </button>
        </div>
      </div>

      {/* Activity Log Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Activity Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.map((activity) => (
                <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-700">{activity.timestamp}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{activity.user}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.action === 'Accessed'
                        ? 'bg-blue-100 text-blue-800'
                        : activity.action === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : activity.action === 'Assigned'
                        ? 'bg-purple-100 text-purple-800'
                        : activity.action === 'Revoked'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.action}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{activity.product}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{activity.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity Timeline (Today)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={activityTimeline}>
              <defs>
                <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="activities" stroke="#06b6d4" fill="url(#colorActivities)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity by Product */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Activity by AI Agent</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityByProduct}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#3b82f6" name="Activities" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activity by Action Type */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Activity by Action Type</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={activityByAction}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="action" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8b5cf6" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Activity;


