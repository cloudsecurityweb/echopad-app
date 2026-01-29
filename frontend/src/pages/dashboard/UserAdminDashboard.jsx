import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import { Link } from 'react-router-dom';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
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
import TranscriptionHistory from '../../components/transcription/TranscriptionHistory';
import AccessRequestModal from '../../components/ui/AccessRequestModal';

function UserAdminDashboard() {
  const { isUserAdmin } = useRole();

  const [selectedTimeRange, setSelectedTimeRange] = useState('weekly');
  const [activityFilter, setActivityFilter] = useState('all');
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Placeholder data - to be replaced with API calls
  const overviewStats = [
    { label: 'Assigned AI Agents', value: '3', change: 'Active', icon: '' },
    { label: 'Usage This Month', value: '1,247', change: '+15%', icon: '' },
    { label: 'Active Sessions', value: '2', change: 'Now', icon: '🟢' },
    { label: 'Team Members', value: '12', change: 'In Org', icon: '👥' },
    { label: 'Available AI Agents', value: '5', change: 'To Purchase', icon: '🛒' },
  ];

  const assignedProducts = [
    {
      id: 1,
      name: 'AI Scribe',
      description: 'Intelligent documentation and transcription services',
      status: 'Active',
      usage: 1247,
      lastUsed: '2 hours ago',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 2,
      name: 'AI DocMan',
      description: 'Advanced document management system',
      status: 'Active',
      usage: 856,
      lastUsed: '1 day ago',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      name: 'AI Medical Assistant',
      description: 'Specialized AI assistant for medical documentation',
      status: 'Active',
      usage: 523,
      lastUsed: '3 days ago',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
  ];

  const usageData = [
    { day: 'Mon', usage: 45 },
    { day: 'Tue', usage: 52 },
    { day: 'Wed', usage: 48 },
    { day: 'Thu', usage: 61 },
    { day: 'Fri', usage: 55 },
    { day: 'Sat', usage: 38 },
    { day: 'Sun', usage: 42 },
  ];

  const monthlyUsageData = [
    { month: 'Jan', usage: 1200 },
    { month: 'Feb', usage: 1350 },
    { month: 'Mar', usage: 1420 },
    { month: 'Apr', usage: 1380 },
    { month: 'May', usage: 1500 },
    { month: 'Jun', usage: 1247 },
  ];

  const productUsageBreakdown = [
    { product: 'AI Scribe', usage: 1247, percentage: 45 },
    { product: 'AI DocMan', usage: 856, percentage: 31 },
    { product: 'AI Medical', usage: 523, percentage: 19 },
    { product: 'AI Receptionist', usage: 145, percentage: 5 },
  ];

  const recentActivity = [
    { id: 1, action: 'Completed transcription in AI Scribe', time: '2 hours ago', product: 'AI Scribe', type: 'usage' },
    { id: 2, action: 'Uploaded document to AI DocMan', time: '1 day ago', product: 'AI DocMan', type: 'usage' },
    { id: 3, action: 'Requested AI Receptionist product', time: '2 days ago', product: 'AI Receptionist', type: 'purchase' },
    { id: 4, action: 'Generated report in AI Medical Assistant', time: '3 days ago', product: 'AI Medical Assistant', type: 'usage' },
    { id: 5, action: 'Product request approved', time: '4 days ago', product: 'AI Admin Assistant', type: 'purchase' },
    { id: 6, action: 'Team member assigned to AI Scribe', time: '5 days ago', product: 'AI Scribe', type: 'team' },
  ];

  // Available products to purchase
  const availableProducts = [
    {
      id: 4,
      name: 'AI Receptionist',
      description: 'Automated receptionist and appointment scheduling',
      price: '$99/month',
      status: 'Available',
      features: ['24/7 Availability', 'Appointment Scheduling', 'Multi-language Support'],
    },
    {
      id: 5,
      name: 'AI Admin Assistant',
      description: 'Administrative task automation and management',
      price: '$149/month',
      status: 'Available',
      features: ['Task Automation', 'Calendar Management', 'Email Handling'],
    },
    {
      id: 6,
      name: 'AI Reminders',
      description: 'Smart reminder and notification system',
      price: '$79/month',
      status: 'Available',
      features: ['Smart Reminders', 'Multi-channel Notifications', 'Custom Rules'],
    },
  ];

  // Pending product requests
  const pendingRequests = [
    { id: 1, product: 'AI Receptionist', requestedDate: '2024-06-10', status: 'Pending Approval', requestedBy: 'You' },
    { id: 2, product: 'AI Admin Assistant', requestedDate: '2024-06-08', status: 'Approved', requestedBy: 'John Doe' },
  ];

  // Purchase history
  const purchaseHistory = [
    { id: 1, product: 'AI Scribe', purchaseDate: '2024-01-15', amount: '$199/month', status: 'Active' },
    { id: 2, product: 'AI DocMan', purchaseDate: '2024-02-01', amount: '$149/month', status: 'Active' },
    { id: 3, product: 'AI Medical Assistant', purchaseDate: '2024-03-10', amount: '$249/month', status: 'Active' },
  ];

  // Team members
  const teamMembers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', products: 2, status: 'Active', lastActive: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', products: 3, status: 'Active', lastActive: '1 day ago' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', products: 1, status: 'Active', lastActive: '3 hours ago' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', products: 2, status: 'Inactive', lastActive: '1 week ago' },
  ];

  // Shared resources
  const sharedResources = [
    { resource: 'Shared Documents', type: 'Storage', usage: '45 GB / 100 GB', users: 8 },
    { resource: 'Team Licenses', type: 'Licenses', usage: '12 / 20', users: 12 },
    { resource: 'API Credits', type: 'Credits', usage: '8,500 / 10,000', users: 12 },
  ];

  // Filter activities
  const filteredActivities = recentActivity.filter(activity => {
    if (activityFilter === 'all') return true;
    return activity.type === activityFilter;
  });

  if (!isUserAdmin) {
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
          Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Access your assigned products and view your usage
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

      {/* Assigned Products */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Your AI Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assignedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {product.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 bg-green-100 text-green-800">
                    {product.status}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm">
                {product.description}
              </p>

              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Usage</span>
                  <span className="text-lg font-semibold text-gray-900">{product.usage.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Used</span>
                  <span className="text-sm font-medium text-gray-700">{product.lastUsed}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/dashboard/your-products`}
                  className="block w-full text-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm"
                >
                  Access Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Purchase/Request Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Available AI Agents</h2>
          <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm">
            View All AI Agents
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {availableProducts.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{product.description}</p>
              <div className="mb-3">
                <p className="text-2xl font-bold text-gray-900 mb-2">{product.price}</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1">
                      <span className="text-green-500">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={() => {
                  setSelectedProduct(product.name);
                  setIsAccessModalOpen(true);
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm"
              >
                Request AI Agent
              </button>
            </div>
          ))}
        </div>

        {/* Pending Requests */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Pending AI Agent Requests</h3>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{request.product}</p>
                  <p className="text-sm text-gray-600">Requested by {request.requestedBy} on {request.requestedDate}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  request.status === 'Approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Purchase History */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Purchase History</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agent</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Purchase Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {purchaseHistory.map((purchase) => (
                  <tr key={purchase.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{purchase.product}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{purchase.purchaseDate}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{purchase.amount}</td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {purchase.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Team View Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Team Overview</h2>
        
        {/* Team Members */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">AI Agents:</span>
                    <span className="font-medium text-gray-900">{member.products}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      member.status === 'Active' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Last Active:</span>
                    <span className="text-gray-500">{member.lastActive}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Resources */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Shared Resources</h3>
          <div className="space-y-4">
            {sharedResources.map((resource, idx) => {
              // Calculate percentage for progress bar
              const calculatePercentage = (usageStr) => {
                try {
                  const parts = usageStr.split('/');
                  if (parts.length !== 2) return 0;
                  const used = parseFloat(parts[0].trim().replace(/[^\d.]/g, ''));
                  const total = parseFloat(parts[1].trim().replace(/[^\d.]/g, ''));
                  if (total === 0) return 0;
                  return Math.min((used / total) * 100, 100);
                } catch {
                  return 0;
                }
              };
              const percentage = calculatePercentage(resource.usage);
              
              return (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">{resource.resource}</p>
                      <p className="text-sm text-gray-600">{resource.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{resource.usage}</p>
                      <p className="text-xs text-gray-500">{resource.users} users</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Usage Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Usage Chart with Time Range Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Usage Trends</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTimeRange('weekly')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedTimeRange === 'weekly'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setSelectedTimeRange('monthly')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedTimeRange === 'monthly'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Monthly
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {selectedTimeRange === 'weekly' ? (
              <AreaChart data={usageData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="usage" stroke="#06b6d4" fill="url(#colorUsage)" />
              </AreaChart>
            ) : (
              <LineChart data={monthlyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="usage" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Product Usage Breakdown */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Agent Usage Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productUsageBreakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="product" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="usage" fill="#06b6d4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity with Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <select
            value={activityFilter}
            onChange={(e) => setActivityFilter(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">All Activities</option>
            <option value="usage">Usage</option>
            <option value="purchase">Purchases</option>
            <option value="team">Team</option>
          </select>
        </div>
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                activity.type === 'usage' ? 'bg-cyan-500' :
                activity.type === 'purchase' ? 'bg-green-500' :
                'bg-blue-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.product} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcription History */}
      <div className="mb-8">
        <TranscriptionHistory />
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/dashboard/your-products"
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Access AI Agents</h3>
            <p className="text-sm text-gray-600">Open and use your assigned products</p>
          </Link>
          <Link
            to="/dashboard/analytics"
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
            <p className="text-sm text-gray-600">Check your usage statistics and insights</p>
          </Link>
          <button 
            onClick={() => {
              setSelectedProduct(null);
              setIsAccessModalOpen(true);
            }}
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Request AI Agent</h3>
            <p className="text-sm text-gray-600">Purchase or request new products</p>
          </button>
        </div>
      </div>

      {/* Access Request Modal */}
      <AccessRequestModal
        isOpen={isAccessModalOpen}
        onClose={() => {
          setIsAccessModalOpen(false);
          setSelectedProduct(null);
        }}
        onSuccess={() => {
          // Optional: Handle success (e.g., refresh data, show additional message)
        }}
        preselectedProduct={selectedProduct}
      />
    </div>
  );
}

export default UserAdminDashboard;



