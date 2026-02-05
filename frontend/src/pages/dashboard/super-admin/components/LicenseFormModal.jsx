import { useState, useEffect, useMemo } from 'react';
import { useProducts } from '../../../../hooks/useProducts';

function LicenseFormModal({ isOpen, onClose, onSubmit, initialData = null, isEditing = false, error: submitError }) {
    const { products } = useProducts();
    const [formError, setFormError] = useState(null);

    const [formData, setFormData] = useState({
        productId: '',
        licenseType: 'seat', // seat | unlimited
        totalSeats: 10,
        startDate: '',
        expiresAt: '', // Changed from endDate
        status: 'active', // active | inactive | expired | suspended
    });

    // Initialize form with defaults or initialData
    useEffect(() => {
        if (isOpen) {
            if (initialData && isEditing) {
                // Edit mode
                setFormData({
                    productId: initialData.productId,
                    licenseType: initialData.licenseType,
                    totalSeats: initialData.totalSeats,
                    startDate: initialData.startDate,
                    expiresAt: initialData.expiresAt, // Changed
                    status: initialData.status
                });
            } else {
                // Create mode defaults
                const today = new Date();
                const oneYear = new Date();
                oneYear.setFullYear(today.getFullYear() + 1);
                const toDateInput = (d) => d.toISOString().slice(0, 10);

                setFormData({
                    productId: products?.[0]?.id || '',
                    licenseType: 'seat',
                    totalSeats: 10,
                    startDate: toDateInput(today),
                    expiresAt: toDateInput(oneYear), // Changed
                    status: 'active'
                });
            }
            setFormError(null);
        }
    }, [isOpen, initialData, isEditing, products]);

    const productOptions = useMemo(() => {
        return (products || [])
            .map((p) => ({ id: p.id, name: p.name || p.id }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [products]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        // Validation
        if (!formData.productId && !isEditing) {
            // In edit mode we might not allow changing product, or we do. 
            // If productId is not in form (hidden), we should handle that.
            // For now assuming product can be changed or is preserved.
            if (!formData.productId) {
                setFormError('Product is required.');
                return;
            }
        }

        if (formData.licenseType === 'seat') {
            const seats = Number(formData.totalSeats);
            if (!Number.isFinite(seats) || seats < 0) {
                setFormError('Total seats must be a non-negative number.');
                return;
            }
        }

        if (formData.startDate && formData.expiresAt && formData.expiresAt < formData.startDate) {
            setFormError('Expiry date must be on or after start date.');
            return;
        }

        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {isEditing ? 'Edit License' : 'Create License'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isEditing && ( // Only show product selection on create, typically license product doesn't change on edit but logic allows it
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                <select
                                    value={formData.productId}
                                    onChange={(e) => setFormData(p => ({ ...p, productId: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                                    required
                                >
                                    {productOptions.length === 0 ? (
                                        <option value="">No products found</option>
                                    ) : (
                                        productOptions.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                                <select
                                    value={formData.licenseType}
                                    onChange={(e) => setFormData(p => ({ ...p, licenseType: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                                >
                                    <option value="seat">Seat-based</option>
                                    <option value="unlimited">Unlimited</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.totalSeats}
                                    onChange={(e) => setFormData(p => ({ ...p, totalSeats: e.target.value }))}
                                    disabled={formData.licenseType !== 'seat'}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white disabled:bg-gray-100 disabled:text-gray-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData(p => ({ ...p, startDate: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData(p => ({ ...p, expiresAt: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="suspended">Suspended</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>

                        {(formError || submitError) && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm">
                                {formError || submitError}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 shadow-md transition-all font-medium text-sm"
                            >
                                {isEditing ? 'Save Changes' : 'Create License'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LicenseFormModal;
