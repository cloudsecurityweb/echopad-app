import { useState, useMemo, useEffect } from 'react';
import { useRole } from '../../contexts/RoleContext';
import InviteUserModal from '../../components/users/InviteUserModal';
import ChangeUserRoleModal from '../../components/users/ChangeUserRoleModal';
import DeleteUserModal from '../../components/users/DeleteUserModal';
import UserManageDropdown from '../../components/users/UserManageDropdown';
import { updateUserRole } from '../../utils/user-role-service';
import { useAuth } from '../../contexts/AuthContext';
import { showNotification } from '../../utils/notifications';
import { useUsers } from '../../hooks/useUsers';
import { getPendingInvitations } from '../../utils/invitation-service';
import DashboardSectionLayout from '../../components/layout/DashboardSectionLayout';
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

/** Map API role to display label (User / Admin) */
function displayRole(role) {
  if (!role) return 'User';
  const r = String(role).toLowerCase();
  if (r === 'clientadmin' || r === 'client_admin' || r === 'superadmin' || r === 'super_admin') return 'Admin';
  return 'User';
}

/** Map API status to display label */
function displayStatus(status) {
  if (!status) return 'Active';
  const s = String(status);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function Users() {
  const { isClientAdmin } = useRole();
  const { getAccessToken } = useAuth();
  const { users: apiUsers, loading, error, refresh } = useUsers();
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
  const [pendingInvites, setPendingInvites] = useState([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  const fetchPendingInvites = useMemo(() => {
    return async () => {
      setIsLoadingPending(true);
      try {
        const invites = await getPendingInvitations(getAccessToken);
        setPendingInvites(invites || []);
      } catch (err) {
        console.error('Failed to fetch pending invites:', err);
        setPendingInvites([]);
      } finally {
        setIsLoadingPending(false);
      }
    };
  }, [getAccessToken]);

  useEffect(() => {
    if (isClientAdmin) fetchPendingInvites();
  }, [isClientAdmin, fetchPendingInvites]);

  // Map API users to table shape (name, email, role, status, products, lastActive)
  const users = useMemo(() => {
    return (apiUsers || []).map((u) => ({
      id: u.id,
      name: u.displayName || u.name || u.email?.split('@')[0] || '—',
      email: u.email || '—',
      role: displayRole(u.role),
      status: displayStatus(u.status),
      products: u.productsCount ?? '—',
      lastActive: '—',
      joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—',
      _raw: u,
    }));
  }, [apiUsers]);

  // Summary stats from real data
  const summaryStats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => (u._raw?.status || '').toLowerCase() === 'active').length;
    const inactive = total - active;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newThisMonth = users.filter((u) => {
      const createdAt = u._raw?.createdAt;
      return createdAt && new Date(createdAt) >= startOfMonth;
    }).length;
    return [
      { label: 'Total Users', value: String(total), change: '', icon: '👥' },
      { label: 'Active', value: String(active), change: '', icon: '✅' },
      { label: 'Inactive', value: String(inactive), change: '', icon: '⏸️' },
      { label: 'New This Month', value: String(newThisMonth), change: '', icon: '🆕' },
    ];
  }, [users]);

  // Role distribution for chart
  const roleDistribution = useMemo(() => {
    const userCount = users.filter((u) => u.role === 'User').length;
    const adminCount = users.filter((u) => u.role === 'Admin').length;
    return [
      { name: 'User', value: userCount, color: '#3b82f6' },
      { name: 'Admin', value: adminCount, color: '#8b5cf6' },
    ].filter((d) => d.value > 0);
  }, [users]);

  // Simple activity snapshot (active vs inactive today - we don't have per-day history)
  const activityTimeline = useMemo(() => {
    const active = users.filter((u) => (u._raw?.status || '').toLowerCase() === 'active').length;
    const inactive = users.length - active;
    return [{ date: new Date().toISOString().slice(0, 10), active, inactive }];
  }, [users]);

  const handleOpenRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleRoleChange = () => {
    refresh();
  };

  const handleUserDeleted = () => {
    refresh();
  };

  const handleInlineRoleChange = async (user, newRole) => {
    if (user.role === newRole) {
      setEditingUserId(null);
      return;
    }

    setUpdatingRole(true);
    try {
      await updateUserRole(user.id, newRole, getAccessToken);
      refresh();
      showNotification(`User role updated successfully to ${newRole}`, 'success');
      setEditingUserId(null);
    } catch (error) {
      console.error('Failed to update user role:', error);
      showNotification(error.message || 'Failed to update user role', 'error');
    } finally {
      setUpdatingRole(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

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

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 mb-4">{error}</p>
          <button
            type="button"
            onClick={() => refresh()}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardSectionLayout
      title="Users"
      description="Manage users within your organization"
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
              {stat.change ? <span className="text-sm font-semibold text-green-600">{stat.change}</span> : null}
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

      {loading ? (
        <div className="animate-pulse">
          {/* Stat Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-8 w-8 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          {/* Filter Bar Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          {/* Table Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="flex gap-4 pb-3 border-b border-gray-200">
                {[100, 160, 60, 60, 70, 80, 60].map((w, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: w }}></div>
                ))}
              </div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3">
                  {[100, 160, 60, 60, 70, 80, 60].map((w, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded" style={{ width: w }}></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          {/* Pending Invitations Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="h-6 w-44 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-gray-100">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="h-5 w-44 bg-gray-200 rounded mb-4"></div>
              <div className="h-[300px] bg-gray-100 rounded-lg"></div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="h-5 w-56 bg-gray-200 rounded mb-4"></div>
              <div className="h-[300px] bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-3xl">{stat.icon}</div>
                  {stat.change ? <span className="text-sm font-semibold text-green-600">{stat.change}</span> : null}
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
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${user.role === 'Admin'
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
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all hover:scale-105 cursor-pointer ${user.role === 'Admin'
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active'
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

      {/* Pending invitations */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pending invitations</h2>
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoadingPending && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                    Loading pending invitations...
                  </td>
                </tr>
              )}
              {!isLoadingPending && pendingInvites.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                    No pending invitations.
                  </td>
                </tr>
              )}
              {!isLoadingPending && pendingInvites.map((invite) => (
                <tr key={invite.id || invite.email} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{invite.email}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      {invite.status || 'pending'}
                    </span>
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
          {roleDistribution.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-gray-500">No data yet</div>
          ) : (
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
          )}
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
        </>
      )}

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSuccess={() => {
          refresh();
          fetchPendingInvites();
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
    </DashboardSectionLayout>
  );
}

export default Users;


