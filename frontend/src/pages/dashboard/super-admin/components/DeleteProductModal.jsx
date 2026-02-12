import { useState, useEffect } from 'react';

function DeleteProductModal({ isOpen, onClose, onDelete, product }) {
    const [confirmationName, setConfirmationName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Reset form when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setConfirmationName('');
            setError(null);
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

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await onDelete(product.productCode);
            onClose();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || 'Failed to delete product');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    if (!isOpen || !product) return null;

    const isConfirmed = confirmationName.trim().toLowerCase() === product.name.toLowerCase();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-red-600">Delete Product</h2>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Close modal"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-6">
                        {/* Warning Message */}
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start gap-3">
                            <div className="p-2 bg-white rounded-full shadow-sm flex-shrink-0">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-red-900 mb-1">Permanent Deletion</h3>
                                <p className="text-sm text-red-700 leading-relaxed">
                                    This action cannot be undone. This will permanently remove <span className="font-semibold">{product.name}</span> from the catalog and may affect existing subscriptions.
                                </p>
                            </div>
                        </div>

                        {/* Product Details Card */}
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Product to delete</span>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {product.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg">
                                    {product.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="text-base font-bold text-gray-900">{product.name}</h4>
                                    <p className="text-xs text-gray-500 font-mono">{product.productCode}</p>
                                </div>
                            </div>
                        </div>

                        {/* Confirmation Input */}
                        <div>
                            <label htmlFor="confirmProductName" className="block text-sm font-medium text-gray-700 mb-2">
                                Type <span className="font-bold text-gray-900">{product.name}</span> to confirm
                            </label>
                            <input
                                type="text"
                                id="confirmProductName"
                                value={confirmationName}
                                onChange={(e) => {
                                    setConfirmationName(e.target.value);
                                    if (error) setError(null);
                                }}
                                placeholder={product.name}
                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm shadow-sm ${error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                disabled={isLoading}
                                autoFocus
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-fadeIn">
                                <svg className="w-4 h-4 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || !isConfirmed}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Product
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeleteProductModal;
