import { useMemo, useState } from 'react';
import { useRole } from '../../../contexts/RoleContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useUsers } from '../../../hooks/useUsers';
import AccountSettings from '../../../components/settings/AccountSettings';
import ThemeSettings from '../../../components/settings/ThemeSettings';
import ChangePasswordModal from '../../../components/ui/ChangePasswordModal';
import DashboardSectionLayout from '../../../components/layout/DashboardSectionLayout';

function SettingsPage() {
  const { isClientAdmin } = useRole();
  const { authProvider } = useAuth();
  const { organization, loading, error, updateOrganization } = useOrganization();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [status, setStatus] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const admins = useMemo(() => {
    if (!organization?.id) return [];
    return users.filter(
      (user) => user.organizationId === organization.id && user.role === 'clientAdmin'
    );
  }, [users, organization?.id]);

  const handleSave = async (updates) => {
    setStatus(null);
    try {
      await updateOrganization(updates);
      setStatus({ type: 'success', message: 'Organization updated.' });
    } catch (saveError) {
      setStatus({ type: 'error', message: saveError.message || 'Update failed.' });
    }
  };

  if (!isClientAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardSectionLayout
      title="Settings"
      description="Manage organization settings and preferences."
    >
    <div className="max-w-6xl mx-auto space-y-8">
      {(loading || usersLoading) && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-gray-600">
          Loading settings...
        </div>
      )}

      {(error || usersError) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error || usersError}
        </div>
      )}

      {status && (
        <div className={`rounded-xl border p-4 ${status.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
          }`}>
          {status.message}
        </div>
      )}

      {!loading && !usersLoading && !error && !usersError && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountSettings organization={organization} admins={admins} onSave={handleSave} />
            <ThemeSettings />
          </div>

          {/* Security Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Security</h2>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-600">
                  {authProvider === 'email'
                    ? 'Change your account password'
                    : 'Password change is not available for social login accounts'}
                </p>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                disabled={authProvider !== 'email'}
                className={`px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition-colors cursor-pointer ${authProvider !== 'email' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Change Password
              </button>
            </div>
          </div>
        </>
      )}

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </div>
    </DashboardSectionLayout>
  );
}

export default SettingsPage;
