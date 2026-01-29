import LicenseStatusBadge from "./LicenseStatusBadge";

function LicensesTable({ licenses, onActivate, onRevoke }) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">Product</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">User Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Invited At</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Activated At</th>
            <th className="px-4 py-3 text-right text-sm font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {licenses.map(lic => (
            <tr
              key={lic.id}
              className="border-b last:border-0 hover:bg-gray-50"
            >
              <td className="px-4 py-4 text-sm font-medium">
                {lic.productCode}
              </td>

              <td className="px-4 py-4 text-sm text-gray-700">
                {lic.userEmail}
              </td>

              <td className="px-4 py-4">
                <LicenseStatusBadge status={lic.status} />
              </td>

              <td className="px-4 py-4 text-sm text-gray-600">
                {lic.invitedAt
                  ? new Date(lic.invitedAt).toLocaleString()
                  : "-"}
              </td>

              <td className="px-4 py-4 text-sm text-gray-600">
                {lic.activatedAt
                  ? new Date(lic.activatedAt).toLocaleString()
                  : "-"}
              </td>

              <td className="px-4 py-4 text-right space-x-2">
                {lic.status === "INVITE_SENT" && (
                  <button
                    onClick={() => onActivate(lic)}
                    className="px-3 py-1 text-xs rounded bg-cyan-600 text-white"
                  >
                    Activate
                  </button>
                )}

                {lic.status !== "REVOKED" && (
                  <button
                    onClick={() => onRevoke(lic)}
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
    </div>
  );
}

export default LicensesTable;
