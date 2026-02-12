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
    <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Account</h3>
        <p className="text-xs text-gray-600">Organization details and admins.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          name="organizationName"
          defaultValue={organization?.name || ''}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-[200px] focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Organization name"
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:from-cyan-400 hover:to-blue-500"
        >
          Save
        </button>
      </form>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">Status:</span>
        <span className="font-medium text-gray-900">{organization?.status || '—'}</span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Admins</h4>
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
          {admins.map((admin) => (
            <div key={admin.id} className="px-3 py-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{admin.displayName || admin.name || 'Admin'}</p>
                <p className="text-xs text-gray-500">{admin.email}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {admin.role}
              </span>
            </div>
          ))}
          {admins.length === 0 && (
            <div className="px-3 py-3 text-sm text-gray-500">No admin users.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AccountSettings;
