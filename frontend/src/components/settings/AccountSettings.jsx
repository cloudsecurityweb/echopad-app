function AccountSettings({ organization, admins, onSave }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('organizationName');
    if (name && onSave) {
      onSave({ name });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Account Management</h3>
        <p className="text-sm text-gray-600">Manage your organization details and admins.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[2fr_auto] gap-3">
        <input
          type="text"
          name="organizationName"
          defaultValue={organization?.name || ''}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Organization name"
        />
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-500"
        >
          Save
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Organization Status</p>
          <p className="text-lg font-semibold text-gray-900">{organization?.status || '—'}</p>
        </div>
        <div className="rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">Organization ID</p>
          <p className="text-sm font-medium text-gray-900">{organization?.id || '—'}</p>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Admin Users</h4>
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {admins.map((admin) => (
            <div key={admin.id} className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{admin.displayName || admin.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {admin.role}
              </span>
            </div>
          ))}
          {admins.length === 0 && (
            <div className="px-4 py-4 text-sm text-gray-500">No admin users found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
