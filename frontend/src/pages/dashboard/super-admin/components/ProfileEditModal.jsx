import { useEffect, useState } from "react";

export default function ProfileEditModal({ profile, onClose, onSave, isSaving }) {
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setDisplayName(profile?.displayName || "");
  }, [profile]);

  const handleSave = () => {
    onSave({ displayName: displayName.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs text-gray-500">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Full name"
              className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Email (read-only)</label>
            <input
              value={profile?.email || ""}
              disabled
              className="mt-1 w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500">Role</label>
              <input
                value={profile?.role || ""}
                disabled
                className="mt-1 w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Status</label>
              <input
                value={profile?.status || ""}
                disabled
                className="mt-1 w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2 text-sm text-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !displayName.trim()}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
