import { useMemo, useState } from 'react';
import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useUsers } from '../../../hooks/useUsers';
import AccountSettings from '../../../components/settings/AccountSettings';
import ThemeSettings from '../../../components/settings/ThemeSettings';

function SettingsPage() {
  const { isClientAdmin } = useRole();
  const { organization, loading, error, updateOrganization } = useOrganization();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [status, setStatus] = useState(null);

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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Settings</h1>
        <p className="text-xl text-gray-600">Manage organization settings and preferences.</p>
      </div>

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
        <div className={`rounded-xl border p-4 ${
          status.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {status.message}
        </div>
      )}

      {!loading && !usersLoading && !error && !usersError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AccountSettings organization={organization} admins={admins} onSave={handleSave} />
          <ThemeSettings />
        </div>
      )}
    </div>
  );
}

export default SettingsPage;
