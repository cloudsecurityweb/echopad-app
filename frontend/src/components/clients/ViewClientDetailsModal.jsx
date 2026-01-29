import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteClient } from '../../utils/client-deletion-service';
import { showNotification } from '../../utils/notifications';

function ViewClientDetailsModal({ isOpen, onClose, client, onRemove }) {
  const { getAccessToken } = useAuth();
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setShowRemoveConfirmation(false);
      setConfirmationName('');
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showRemoveConfirmation) {
          setShowRemoveConfirmation(false);
          setConfirmationName('');
          setErrors({});
        } else {
          onClose();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, showRemoveConfirmation]);

  const handleRemove = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});

    // Validate confirmation name
    if (!confirmationName.trim()) {
      setErrors({ confirmationName: 'Please enter the client name to confirm' });
      return;
    }

    // Validate that confirmation name matches client name
    if (confirmationName.trim().toLowerCase() !== client?.name.toLowerCase()) {
      setErrors({ confirmationName: 'Name does not match. Please type the client name exactly.' });
      return;
    }

    setIsLoading(true);

    try {
      await deleteClient(client.id, getAccessToken);
      showNotification(`Client ${client.name} has been permanently removed`, 'success');
      
      // Call onRemove callback if provided
      if (onRemove) {
        onRemove(client.id);
      }
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
        setShowRemoveConfirmation(false);
      }, 500);
    } catch (error) {
      console.error('Failed to remove client:', error);
      const errorMessage = error.message || 'Failed to remove client. Please try again.';
      setErrors({ submit: errorMessage });
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      if (showRemoveConfirmation) {
        setShowRemoveConfirmation(false);
        setConfirmationName('');
        setErrors({});
      } else {
        onClose();
      }
    }
  };

  if (!isOpen || !client) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-900">Client Details</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showRemoveConfirmation ? (
            <>
              {/* Client Information */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Client Name</p>
                      <p className="text-base font-medium text-gray-900">{client.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : client.status === 'Trial'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Subscription</p>
                      <p className="text-base font-medium text-gray-900">{client.subscription}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Auto-Pay</p>
                      {client.autoPay ? (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          ✓ Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Disabled
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">AI Agents</p>
                      <p className="text-base font-medium text-gray-900">{client.products}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Licenses</p>
                      <p className="text-base font-medium text-gray-900">{client.licenses}</p>
                    </div>
                    {client.lastActive && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Last Active</p>
                        <p className="text-base font-medium text-gray-900">{client.lastActive}</p>
                      </div>
                    )}
                    {client.joinDate && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Join Date</p>
                        <p className="text-base font-medium text-gray-900">{client.joinDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowRemoveConfirmation(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Client
                </button>
              </div>
            </>
          ) : (
            /* Remove Confirmation */
            <form onSubmit={handleRemove} className="space-y-6">
              {/* Warning Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-red-800 mb-1">This action cannot be undone</p>
                    <p className="text-sm text-red-700">
                      This will permanently remove the client organization and all associated users, licenses, and data. All access will be immediately revoked.
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Client to be removed</p>
                <p className="text-lg font-semibold text-gray-900">{client.name}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>Status: {client.status}</p>
                  <p>Subscription: {client.subscription}</p>
                  <p>Licenses: {client.licenses}</p>
                  <p>AI Agents: {client.products}</p>
                </div>
              </div>

              {/* Confirmation Name Input */}
              <div>
                <label htmlFor="confirmationName" className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-semibold text-gray-900">{client.name}</span> to confirm
                </label>
                <input
                  type="text"
                  id="confirmationName"
                  value={confirmationName}
                  onChange={(e) => {
                    setConfirmationName(e.target.value);
                    if (errors.confirmationName) {
                      setErrors({ ...errors, confirmationName: null });
                    }
                    if (errors.submit) {
                      setErrors({ ...errors, submit: null });
                    }
                  }}
                  placeholder={client.name}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors ${
                    errors.confirmationName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                  autoFocus
                />
                {errors.confirmationName && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmationName}</p>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              {/* Footer with Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowRemoveConfirmation(false);
                    setConfirmationName('');
                    setErrors({});
                  }}
                  disabled={isLoading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || confirmationName.trim().toLowerCase() !== client.name.toLowerCase()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Removing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Client
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewClientDetailsModal;
