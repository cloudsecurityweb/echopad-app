import { useState } from "react";

function ActivateLicenseModal({ license, onClose, onActivate }) {
  const [userId, setUserId] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          Activate License
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Product: <strong>{license.productCode}</strong><br />
          Email: {license.userEmail}
        </p>

        <input
          type="text"
          placeholder="Enter User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>

          <button
            onClick={() => onActivate(userId)}
            disabled={!userId}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50"
          >
            Activate
          </button>
        </div>
      </div>
    </div>
  );
}

export default ActivateLicenseModal;
