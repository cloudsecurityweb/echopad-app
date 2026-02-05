import { useState } from 'react';
import { sendInvitation } from '../../utils/invitation-service';

function InviteModal({
  isOpen,
  onClose,
  productCode,
  licenses,
  getAccessToken,
  onInviteSent,
}) {
  const [email, setEmail] = useState('');
  const [selectedLicense, setSelectedLicense] = useState('');
  const [inviteStatus, setInviteStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const licenseOptions = licenses.filter((license) => license.productId === productCode);

  const handleInvite = async (event) => {
    event.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setInviteStatus(null);
    try {
      await sendInvitation(email.trim(), 'User', selectedLicense, getAccessToken);
      setInviteStatus({ type: 'success', message: 'Invitation sent successfully.' });
      setEmail('');
      setSelectedLicense('');
      onInviteSent();
      onClose();
    } catch (error) {
      setInviteStatus({ type: 'error', message: error.message || 'Failed to send invitation.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">Send Invitation</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <form onSubmit={handleInvite} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="User email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="license" className="text-sm font-medium text-gray-700">License</label>
            <select
              id="license"
              value={selectedLicense}
              onChange={(event) => setSelectedLicense(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
            >
              <option value="">Select license</option>
              {licenseOptions.map((license) => (
                <option key={license.id} value={license.id}>
                  {license.productId || 'Unspecified'} · {license.totalSeats ?? license.seats ?? 'Unlimited'} seats
                </option>
              ))}
            </select>
          </div>

          {inviteStatus && (
            <div className={`text-sm px-4 py-3 rounded-lg ${
              inviteStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {inviteStatus.message}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteModal;
