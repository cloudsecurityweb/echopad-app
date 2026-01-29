import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { deleteClient } from '../../utils/client-deletion-service';
import { showNotification } from '../../utils/notifications';

function DeleteClientModal({ isOpen, onClose, client, onSuccess }) {
  const { getAccessToken } = useAuth();
  const [confirmationName, setConfirmationName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
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
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = async (e) => {
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
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(client.id);
      }
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Failed to delete client:', error);
      const errorMessage = error.message || 'Failed to delete client. Please try again.';
      setErrors({ submit: errorMessage });
      showNotification(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen || !client) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-red-600">Remove Client</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-sm font-semibold text-red-800 mb-1">This action cannot be undone</p>
                  <p className="text-sm text-red-700">
                    This will permanently delete the client organization and all associated users, licenses, and data. All access will be immediately revoked.
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Client to be deleted</p>
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
          </div>

          {/* Footer with Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  );
}

export default DeleteClientModal;
