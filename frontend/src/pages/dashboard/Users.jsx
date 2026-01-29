import { useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import InviteUserModal from '../../components/users/InviteUserModal';
import ChangeUserRoleModal from '../../components/users/ChangeUserRoleModal';
import DeleteUserModal from '../../components/users/DeleteUserModal';
import UserManageDropdown from '../../components/users/UserManageDropdown';
import { updateUserRole } from '../../utils/user-role-service';
import { useAuth } from '../../contexts/AuthContext';
import { showNotification } from '../../utils/notifications';
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

function Users() {
  const { isClientAdmin, isSuperAdmin } = useRole();
  const { getAccessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [updatingRole, setUpdatingRole] = useState(false);

  // Only client admins can access this page (super admins manage clients, not users directly)
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
    { label: 'Total Users', value: '156', change: '+8%', icon: '👥' },
    { label: 'Active', value: '142', change: '+5%', icon: '' },
    { label: 'Inactive', value: '14', change: '-3%', icon: '⏸' },
    { label: 'New This Month', value: '12', change: '+20%', icon: '🆕' },
  ];

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active', products: 3, lastActive: '2 hours ago', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active', products: 2, lastActive: '1 day ago', joinDate: '2024-02-20' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Admin', status: 'Active', products: 4, lastActive: '5 minutes ago', joinDate: '2023-11-10' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'Inactive', products: 1, lastActive: '1 week ago', joinDate: '2024-03-01' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', status: 'Active', products: 2, lastActive: '3 hours ago', joinDate: '2024-01-28' },
    { id: 6, name: 'Diana Prince', email: 'diana@example.com', role: 'User', status: 'Active', products: 3, lastActive: '1 hour ago', joinDate: '2024-02-15' },
    { id: 7, name: 'Edward Norton', email: 'edward@example.com', role: 'User', status: 'Inactive', products: 1, lastActive: '2 weeks ago', joinDate: '2024-03-10' },
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

  const roleDistribution = [
    { name: 'User', value: 128, color: '#3b82f6' },
    { name: 'Admin', value: 28, color: '#8b5cf6' },
  ];

  const activityTimeline = [
    { date: '2024-06-15', active: 142, inactive: 14 },
    { date: '2024-06-14', active: 140, inactive: 16 },
    { date: '2024-06-13', active: 138, inactive: 18 },
    { date: '2024-06-12', active: 139, inactive: 17 },
    { date: '2024-06-11', active: 141, inactive: 15 },
    { date: '2024-06-10', active: 142, inactive: 14 },
  ];

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Users
        </h1>
        <p className="text-xl text-gray-600">
          Manage users within your organization
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
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div className="md:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button 
            onClick={() => setIsInviteModalOpen(true)}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
          >
            Invite User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Users</h2>
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
              {filteredUsers.map((user) => (
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
        {/* Role Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {roleDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">User Activity Timeline (Last 6 Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="active" stackId="a" fill="#10b981" name="Active" />
              <Bar dataKey="inactive" stackId="a" fill="#6b7280" name="Inactive" />
            </BarChart>
          </ResponsiveContainer>
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
    </div>
  );
}

export default Users;


