import { useMemo, useState, useEffect } from 'react';
import { getPendingInvitations } from '../../utils/invitation-service';
import InviteModal from './InviteModal';

function InvitesSection({
  users,
  licenses,
  userLicenses,
  productCode,
  onAssignLicense,
  onRevokeLicense,
  getAccessToken,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [isLoadingPending, setIsLoadingPending] = useState(false);

  useEffect(() => {
    fetchPendingInvites();
  }, [getAccessToken]);

  const fetchPendingInvites = async () => {
    setIsLoadingPending(true);
    try {
      const invites = await getPendingInvitations(getAccessToken);
      setPendingInvites(invites);
    } catch (error) {
      console.error("Failed to fetch pending invites:", error);
    } finally {
      setIsLoadingPending(false);
    }
  };

  const userLicenseMap = useMemo(() => {
    const map = new Map();
    userLicenses.forEach((entry) => {
      if (!map.has(entry.userId)) {
        map.set(entry.userId, []);
      }
      map.get(entry.userId).push(entry);
    });
    return map;
  }, [userLicenses]);

  const handleAssign = async (userId, licenseId) => {
    if (!licenseId) return;
    await onAssignLicense({ userId, licenseId });
  };

  const handleRevoke = async (userId, licenseId) => {
    await onRevokeLicense({ userId, licenseId });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Users</h3>
          <p className="text-sm text-gray-600">Manage users and assign product licenses.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-cyan-400 hover:to-blue-500 transition-all"
        >
          Send Invite
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">User</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              {/* <th className="text-left px-4 py-3 font-medium">Assigned Products</th> */}
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => {
              const assignments = userLicenseMap.get(user.id) || [];
              const assignedProducts = assignments.map((entry) => entry.productId);
              const activeLicense = assignments.find((entry) => entry.productId === productCode);

              return (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-900">{user.displayName || user.name || 'Unnamed'}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE' || user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </td>
                  {/* <td className="px-4 py-3">
                    {assignedProducts.length === 0 ? (
                      <span className="text-gray-500">None</span>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {assignedProducts.map((prod) => (
                          <span key={prod} className="px-2 py-1 rounded-full text-xs bg-cyan-50 text-cyan-700 border border-cyan-200">
                            {prod}
                          </span>
                        ))}
                      </div>
                    )}
                  </td> */}
                  <td className="px-4 py-3">
                    {activeLicense ? (
                      <button
                        type="button"
                        onClick={() => handleRevoke(user.id, activeLicense.licenseId)}
                        className="text-xs font-medium text-red-600 hover:text-red-700"
                      >
                        Revoke
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <select
                          className="border border-gray-300 rounded-lg px-2 py-1 text-xs"
                          defaultValue=""
                          onChange={(event) => handleAssign(user.id, event.target.value)}
                        >
                          <option value="">Assign license</option>
                          {licenses.filter(l => l.productId === productCode).map((license) => (
                            <option key={license.id} value={license.id}>
                              {license.licenseType || 'seat'} · {license.totalSeats ?? license.seats ?? 'Unlimited'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                  No users found for this organization.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 p-6">Pending Invitations</h3>
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoadingPending && (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  Loading pending invitations...
                </td>
              </tr>
            )}
            {!isLoadingPending && pendingInvites.map((invite) => (
              <tr key={invite.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{invite.email}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                    {invite.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      className="text-xs font-medium text-cyan-600 hover:text-cyan-700"
                    >
                      Resend
                    </button>
                    <button
                      type="button"
                      className="text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!isLoadingPending && pendingInvites.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No pending invitations.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productCode={productCode}
        licenses={licenses}
        getAccessToken={getAccessToken}
        onInviteSent={fetchPendingInvites}
      />
    </div>
  );
}

export default InvitesSection;
