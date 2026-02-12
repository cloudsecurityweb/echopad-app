import { useState } from 'react';
import { useRole } from '../../../contexts/RoleContext';
import { useAuth } from '../../../contexts/AuthContext';
import { useOrganization } from '../../../hooks/useOrganization';
import AccountSettings from '../../../components/settings/AccountSettings';
import ThemeSettings from '../../../components/settings/ThemeSettings';
import ChangePasswordModal from '../../../components/ui/ChangePasswordModal';
import DashboardSectionLayout from '../../../components/layout/DashboardSectionLayout';

function SettingsPage() {
  const { isClientAdmin, isUserAdmin } = useRole();
  const { authProvider } = useAuth();
  const { organization, loading, error, updateOrganization } = useOrganization();
  const [status, setStatus] = useState(null);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleSave = async (updates) => {
    setStatus(null);
    try {
      await updateOrganization(updates);
      setStatus({ type: 'success', message: 'Organization updated.' });
    } catch (saveError) {
      setStatus({ type: 'error', message: saveError.message || 'Update failed.' });
    }
  };

  if (!isClientAdmin && !isUserAdmin) {
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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Settings</h1>
        <p className="text-xl text-gray-600">Manage organization settings and preferences.</p>
      </div>

      {(loading) && (
        <div className="animate-pulse space-y-6">
          {/* Settings Cards Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Settings Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="h-6 w-40 bg-gray-200 rounded"></div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>
              ))}
              <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            </div>
            {/* Theme Settings Skeleton */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div className="h-6 w-36 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
          {/* Security Section Skeleton */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                <div className="h-3 w-56 bg-gray-200 rounded"></div>
              </div>
              <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      )}

      {(error ) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error}
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

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AccountSettings organization={organization} onSave={handleSave} />
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
