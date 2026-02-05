import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import InviteUserModal from '../../components/users/InviteUserModal';
import ChangeUserRoleModal from '../../components/users/ChangeUserRoleModal';
import DeleteUserModal from '../../components/users/DeleteUserModal';
import UserManageDropdown from '../../components/users/UserManageDropdown';
import ProductRequestDetailsModal from '../../components/ui/ProductRequestDetailsModal';
import { updateUserRole } from '../../utils/user-role-service';
import { useAuth } from '../../contexts/AuthContext';
import { showNotification } from '../../utils/notifications';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function ClientAdminDashboard() {
  const { isClientAdmin, isLoadingRole } = useRole();
  const { getAccessToken } = useAuth();
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [isRequestDetailsModalOpen, setIsRequestDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Placeholder data - to be replaced with API calls
  const overviewStats = [
    { label: 'Total Users', value: '156', change: '+8%', icon: '👥' },
    { label: 'Active AI Agents', value: '4', change: '0%', icon: '📦' },
    { label: 'License Usage', value: '87%', change: '+5%', icon: '🔑' },
    { label: 'Subscription Status', value: 'Active', change: 'Enterprise', icon: '✅' },
  ];

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', lastActive: '2 hours ago', products: 3 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', lastActive: '1 day ago', products: 2 },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Active', lastActive: '5 minutes ago', products: 4 },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Inactive', lastActive: '1 week ago', products: 1 },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active', lastActive: '3 hours ago', products: 2 },
  ]);

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleRoleChange = (userId, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleUserDeleted = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };

  const handleInlineRoleChange = async (user, newRole) => {
    if (user.role === newRole) {
      setEditingUserId(null);
      return;
    }

    setUpdatingRole(true);
    try {
      await updateUserRole(user.id, newRole, getAccessToken);
      handleRoleChange(user.id, newRole);
      showNotification(`User role updated successfully to ${newRole}`, 'success');
      setEditingUserId(null);
    } catch (error) {
      console.error('Failed to update user role:', error);
      showNotification(error.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingRole(false);
    }
  };

  const productAssignment = [
    { product: 'AI Scribe', assigned: 45, total: 50, utilization: 90 },
    { product: 'AI DocMan', assigned: 32, total: 40, utilization: 80 },
    { product: 'AI Medical', assigned: 28, total: 35, utilization: 80 },
    { product: 'AI Receptionist', assigned: 15, total: 20, utilization: 75 },
  ];

  const licenseUtilization = [
    { month: 'Jan', used: 85, available: 15 },
    { month: 'Feb', used: 92, available: 8 },
    { month: 'Mar', used: 88, available: 12 },
    { month: 'Apr', used: 95, available: 5 },
    { month: 'May', used: 90, available: 10 },
    { month: 'Jun', used: 87, available: 13 },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Accessed AI Scribe', time: '2 hours ago', type: 'access' },
    { id: 2, user: 'Bob Johnson', action: 'Assigned license to new user', time: '5 hours ago', type: 'assignment' },
    { id: 3, user: 'Jane Smith', action: 'Completed document in AI DocMan', time: '1 day ago', type: 'activity' },
    { id: 4, user: 'Alice Williams', action: 'Revoked license', time: '2 days ago', type: 'revocation' },
    { id: 5, user: 'Charlie Brown', action: 'Accessed AI Medical', time: '3 days ago', type: 'access' },
  ];

  // Product access requests from users
  const productRequests = [
    {
      id: 1,
      requesterName: 'John Doe',
      requesterEmail: 'john@example.com',
      product: 'AI Receptionist',
      priority: 'High',
      requestedDate: '2024-06-15',
      status: 'Pending',
      reason: 'Need automated receptionist for after-hours coverage. Our current receptionist only works 9-5, but we receive many calls after hours that go unanswered. This would improve patient satisfaction and ensure we don\'t miss important appointments.',
      expectedUsage: '24/7 coverage for appointment scheduling, patient inquiries, and basic information requests. Expected to handle approximately 50-75 calls per day during off-hours.',
      businessJustification: 'Reduces staffing costs by 30% while improving service availability. Estimated savings of $2,400/month on after-hours staffing. ROI expected within 3 months.',
    },
    {
      id: 2,
      requesterName: 'Jane Smith',
      requesterEmail: 'jane@example.com',
      product: 'AI Admin Assistant',
      priority: 'Medium',
      requestedDate: '2024-06-14',
      status: 'Pending',
      reason: 'Administrative tasks are taking up too much time. Need automation for calendar management, email handling, and task scheduling to focus on patient care.',
      expectedUsage: 'Daily use for calendar management, email triage, and task automation. Expected to save 2-3 hours per day on administrative work.',
      businessJustification: 'Allows medical staff to focus on patient care instead of administrative tasks. Improves efficiency and reduces burnout. Estimated time savings worth $1,500/month in productivity gains.',
    },
    {
      id: 3,
      requesterName: 'Bob Johnson',
      requesterEmail: 'bob@example.com',
      product: 'AI Reminders',
      priority: 'Urgent',
      requestedDate: '2024-06-13',
      status: 'Approved',
      reason: 'Patient no-shows are costing us significant revenue. Need automated reminder system to reduce missed appointments.',
      expectedUsage: 'Send automated reminders via SMS and email 24 hours and 2 hours before appointments. Expected to handle 200+ reminders per day.',
      businessJustification: 'Reduces no-show rate by 40%, resulting in $5,000/month in recovered revenue. System pays for itself within first month.',
    },
    {
      id: 4,
      requesterName: 'Alice Williams',
      requesterEmail: 'alice@example.com',
      product: 'AI Receptionist',
      priority: 'Low',
      requestedDate: '2024-06-12',
      status: 'Rejected',
      reason: 'Would like to test AI Receptionist for our satellite office to reduce staffing needs.',
      expectedUsage: 'Part-time usage for satellite office with lower call volume. Expected 20-30 calls per day.',
      businessJustification: 'Could reduce satellite office staffing by one FTE, saving approximately $3,000/month.',
    },
    {
      id: 5,
      requesterName: 'Charlie Brown',
      requesterEmail: 'charlie@example.com',
      product: 'AI Admin Assistant',
      priority: 'Medium',
      requestedDate: '2024-06-11',
      status: 'Pending',
      reason: 'Need help managing multiple calendars and coordinating meetings across different departments.',
      expectedUsage: 'Daily use for calendar coordination, meeting scheduling, and email management. Expected to handle 50+ calendar events per week.',
    },
  ];

  const pendingRequestsCount = productRequests.filter(r => r.status === 'Pending').length;
  const totalRequestsCount = productRequests.length;

  const handleViewRequestDetails = (request) => {
    setSelectedRequest(request);
    setIsRequestDetailsModalOpen(true);
  };

  // Only show permission error if role is loaded and confirmed as non-ClientAdmin
  // Don't block rendering while role is loading (defaults to ClientAdmin)
  // This ensures dashboard displays immediately for ClientAdmin users
  if (!isLoadingRole && !isClientAdmin) {
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
          Client Admin Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Manage your organization's products, users, and licenses
        </p>
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

      {/* User Management Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm"
          >
            Invite User
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
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{user.email}</td>
                  <td className="py-4 px-4">
                    {editingUserId === user.id ? (
                      <select
                        value={user.role}
                        onChange={(e) => handleInlineRoleChange(user, e.target.value)}
                        onBlur={() => setEditingUserId(null)}
                        disabled={updatingRole}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800 border-purple-300'
                            : 'bg-gray-100 text-gray-800 border-gray-300'
                        }`}
                        autoFocus
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingUserId(user.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer ${
                          user.role === 'Admin'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        title="Click to change role"
                      >
                        {user.role}
                      </button>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{user.products}</td>
                  <td className="py-4 px-4 text-sm text-gray-500">{user.lastActive}</td>
                  <td className="py-4 px-4">
                    <UserManageDropdown
                      user={user}
                      onManageRole={handleOpenRoleModal}
                      onRemoveUser={handleOpenDeleteModal}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* AI Agent Assignment Overview */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Agent Assignment Overview</h2>
          <div className="space-y-4">
            {productAssignment.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{item.product}</span>
                  <span className="text-sm text-gray-600">{item.assigned} / {item.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${item.utilization}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* License Utilization */}
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

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.type === 'access' ? 'bg-cyan-500' :
                activity.type === 'assignment' ? 'bg-green-500' :
                activity.type === 'activity' ? 'bg-blue-500' :
                'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Access Requests Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">AI Agent Access Requests</h2>
            <p className="text-sm text-gray-600 mt-1">
              {pendingRequestsCount} Pending • {totalRequestsCount} Total Requests
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Requester</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">AI Agent</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Requested Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productRequests.map((request) => (
                <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{request.requesterName}</p>
                      <p className="text-xs text-gray-500">{request.requesterEmail}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{request.product}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.priority === 'Low' ? 'bg-gray-100 text-gray-800' :
                      request.priority === 'Medium' ? 'bg-blue-100 text-blue-800' :
                      request.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {new Date(request.requestedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleViewRequestDetails(request)}
                      className="text-cyan-600 hover:text-cyan-700 font-medium text-sm inline-flex items-center gap-1"
                    >
                      View Details
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200"
          >
            <h3 className="font-semibold text-gray-900 mb-1">Invite User</h3>
            <p className="text-sm text-gray-600">Invite a new user to your organization</p>
          </button>
          <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-1">Assign License</h3>
            <p className="text-sm text-gray-600">Allocate licenses to users</p>
          </button>
          <button className="bg-white rounded-lg p-4 text-left hover:shadow-md transition-shadow border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-1">View Reports</h3>
            <p className="text-sm text-gray-600">Access organization analytics</p>
          </button>
        </div>
      </div>

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh user list or show success message
          // This can be extended when real API is integrated
        }}
      />

      {/* Change User Role Modal */}
      <ChangeUserRoleModal
        isOpen={isRoleModalOpen}
        onClose={() => {
          setIsRoleModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSuccess={handleRoleChange}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setUserToDelete(null);
        }}
        user={userToDelete}
        onSuccess={handleUserDeleted}
      />

      {/* Product Request Details Modal */}
      <ProductRequestDetailsModal
        isOpen={isRequestDetailsModalOpen}
        onClose={() => {
          setIsRequestDetailsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
    </div>
  );
}

export default ClientAdminDashboard;


