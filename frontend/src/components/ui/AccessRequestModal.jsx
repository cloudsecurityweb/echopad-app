import { useState, useEffect } from 'react';
import { showNotification } from '../../utils/notifications';

function AccessRequestModal({ isOpen, onClose, onSuccess, preselectedProduct = null }) {
  const [product, setProduct] = useState(preselectedProduct || '');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [expectedUsage, setExpectedUsage] = useState('');
  const [businessJustification, setBusinessJustification] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Available products for request
  const availableProducts = [
    'AI Receptionist',
    'AI Admin Assistant',
    'AI Reminders',
    'AI Scribe',
    'AI DocMan',
    'AI Medical Assistant',
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setProduct(preselectedProduct || '');
      setReason('');
      setPriority('Medium');
      setExpectedUsage('');
      setBusinessJustification('');
      setErrors({});
      setIsLoading(false);
    } else if (preselectedProduct) {
      setProduct(preselectedProduct);
    }
  }, [isOpen, preselectedProduct]);

  // Update product when preselectedProduct changes
  useEffect(() => {
    if (preselectedProduct && isOpen) {
      setProduct(preselectedProduct);
    }
  }, [preselectedProduct, isOpen]);

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

    // Validate product
    if (!product) {
      setErrors({ product: 'Please select a product' });
      return;
    }

    // Validate reason/justification
    if (!reason.trim()) {
      setErrors({ reason: 'Reason/Justification is required' });
      return;
    }

    if (reason.trim().length < 20) {
      setErrors({ reason: 'Reason/Justification must be at least 20 characters' });
      return;
    }

    if (reason.trim().length > 1000) {
      setErrors({ reason: 'Reason/Justification must be less than 1000 characters' });
      return;
    }

    // Validate priority
    if (!priority) {
      setErrors({ priority: 'Please select a priority' });
      return;
    }

    // Validate expected usage (optional but recommended)
    if (expectedUsage.trim() && expectedUsage.trim().length < 10) {
      setErrors({ expectedUsage: 'Expected Usage must be at least 10 characters if provided' });
      return;
    }

    if (expectedUsage.trim().length > 500) {
      setErrors({ expectedUsage: 'Expected Usage must be less than 500 characters' });
      return;
    }

    // Validate business justification (optional but recommended)
    if (businessJustification.trim() && businessJustification.trim().length < 20) {
      setErrors({ businessJustification: 'Business Justification must be at least 20 characters if provided' });
      return;
    }

    if (businessJustification.trim().length > 1000) {
      setErrors({ businessJustification: 'Business Justification must be less than 1000 characters' });
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call when backend is ready
      
      // Simulate success
      showNotification(`Access request for ${product} submitted successfully. Your request is pending approval.`, 'success');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal after short delay to show success message
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Failed to submit access request:', error);
      const errorMessage = error.message || 'Failed to submit access request. Please try again.';
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-semibold text-gray-900">Request AI Agent Access</h2>
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

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="p-6 overflow-y-auto flex-1">
            <div className="space-y-6">
            {/* Product Selection */}
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">
                AI Agent <span className="text-red-500">*</span>
              </label>
              <select
                id="product"
                value={product}
                onChange={(e) => {
                  setProduct(e.target.value);
                  if (errors.product) {
                    setErrors({ ...errors, product: null });
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  errors.product ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading || !!preselectedProduct}
              >
                <option value="">Select a product</option>
                {availableProducts.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
              {errors.product && (
                <p className="mt-1 text-sm text-red-600">{errors.product}</p>
              )}
              {preselectedProduct && (
                <p className="mt-1 text-xs text-gray-500">
                  AI Agent pre-selected from your request
                </p>
              )}
            </div>

            {/* Priority Selection */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  if (errors.priority) {
                    setErrors({ ...errors, priority: null });
                  }
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${
                  errors.priority ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
              )}
            </div>

            {/* Reason/Justification */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason/Justification <span className="text-red-500">*</span>
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (errors.reason) {
                    setErrors({ ...errors, reason: null });
                  }
                }}
                placeholder="Please explain why you need access to this product..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none overflow-y-auto max-h-[200px] ${
                  errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
                maxLength={1000}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {reason.length}/1000 characters
              </p>
            </div>

            {/* Expected Usage */}
            <div>
              <label htmlFor="expectedUsage" className="block text-sm font-medium text-gray-700 mb-2">
                Expected Usage <span className="text-gray-500 text-xs">(Optional but recommended)</span>
              </label>
              <textarea
                id="expectedUsage"
                value={expectedUsage}
                onChange={(e) => {
                  setExpectedUsage(e.target.value);
                  if (errors.expectedUsage) {
                    setErrors({ ...errors, expectedUsage: null });
                  }
                }}
                placeholder="Describe how you plan to use this product..."
                rows={3}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none overflow-y-auto max-h-[150px] ${
                  errors.expectedUsage ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
                maxLength={500}
              />
              {errors.expectedUsage && (
                <p className="mt-1 text-sm text-red-600">{errors.expectedUsage}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {expectedUsage.length}/500 characters
              </p>
            </div>

            {/* Business Justification */}
            <div>
              <label htmlFor="businessJustification" className="block text-sm font-medium text-gray-700 mb-2">
                Business Justification <span className="text-gray-500 text-xs">(Optional but recommended)</span>
              </label>
              <textarea
                id="businessJustification"
                value={businessJustification}
                onChange={(e) => {
                  setBusinessJustification(e.target.value);
                  if (errors.businessJustification) {
                    setErrors({ ...errors, businessJustification: null });
                  }
                }}
                placeholder="Provide business case or justification for this access request..."
                rows={4}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors resize-none overflow-y-auto max-h-[200px] ${
                  errors.businessJustification ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                disabled={isLoading}
                maxLength={1000}
              />
              {errors.businessJustification && (
                <p className="mt-1 text-sm text-red-600">{errors.businessJustification}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {businessJustification.length}/1000 characters
              </p>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-gray-200 flex-shrink-0">
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
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submit Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AccessRequestModal;
