function AccountSettings({ organization, onSave }) {
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
    </div>
  );
}

export default AccountSettings;
