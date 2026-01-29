import { useState } from "react";
import { useLicenses } from "../../../../hooks/useLicenses";

/** Status badge (same logic as Licenses section) */
function LicenseStatusBadge({ status }) {
  const map = {
    INVITE_SENT: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-100 text-gray-700",
    REVOKED: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${
        map[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

function ClientDetailsModal({ client, onClose }) {
  const { assignments, revokeLicense, activateLicense } =
    useLicenses(client.tenantId);

  const [activatingLicense, setActivatingLicense] = useState(null);
  const [userId, setUserId] = useState("");

  const clientLicenses = assignments.filter(
    a => a.tenantId === client.tenantId
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            {client.name} — Licenses
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Licenses Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  User Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Invited At
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold">
                  Activated At
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {clientLicenses.map(lic => (
                <tr
                  key={lic.id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 text-sm font-medium">
                    {lic.productCode}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700">
                    {lic.userEmail}
                  </td>

                  <td className="px-4 py-3">
                    <LicenseStatusBadge status={lic.status} />
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {lic.invitedAt
                      ? new Date(lic.invitedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600">
                    {lic.activatedAt
                      ? new Date(lic.activatedAt).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-4 py-3 text-right space-x-2">
                    {lic.status === "INVITE_SENT" && (
                      <button
                        onClick={() => {
                          console.log("Open activate for:", lic.id);
                          setActivatingLicense(lic);
                          setUserId("");
                        }}
                        className="px-3 py-1 text-xs rounded bg-cyan-600 text-white"
                      >
                        Activate
                      </button>
                    )}

                    {lic.status !== "REVOKED" && (
                      <button
                        onClick={() => {
                          console.log("Revoke license:", lic.id);
                          revokeLicense({ licenceId: lic.id });
                        }}
                        className="px-3 py-1 text-xs rounded bg-red-100 text-red-700"
                      >
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clientLicenses.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-6">
              No licenses found for this client.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Close
          </button>
        </div>

        {/* Activate License Modal (Inline) */}
        {activatingLicense && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-60">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h4 className="text-lg font-semibold mb-3">
                Activate License
              </h4>

              <p className="text-sm text-gray-600 mb-4">
                <strong>Product:</strong> {activatingLicense.productCode}
                <br />
                <strong>Email:</strong> {activatingLicense.userEmail}
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
                  onClick={() => setActivatingLicense(null)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  disabled={!userId}
                  onClick={() => {
                    console.log("Activate license:", {
                      tenantId: client.tenantId,
                      licenceId: activatingLicense.id,
                      userId,
                      email: activatingLicense.userEmail,
                    });

                    activateLicense({
                      tenantId: client.tenantId,
                      licenceId: activatingLicense.id,
                      userId,
                      email: activatingLicense.userEmail,
                    });

                    setActivatingLicense(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50"
                >
                  Activate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClientDetailsModal;
