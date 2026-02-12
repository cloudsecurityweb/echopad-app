import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useRole } from '../../../contexts/RoleContext';
import http from '../../../api/http';
import DashboardSectionLayout from '../../../components/layout/DashboardSectionLayout';


const REQUESTED_STATUS = 'requested';
const ACTIVE_STATUS = 'active';
const DENIED_STATUS = 'denied';

export default function LicenseRequests() {
    const { isSuperAdmin } = useRole();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { getAccessToken } = useAuth();
    const [actionLoading, setActionLoading] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        type: null, // 'approve' | 'deny'
        licenseId: null,
        tenantId: null
    });

    // SVGs matching the app's style (Heroicons outline usually)
    const Icons = {
        Check: () => (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        X: () => (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        Clock: () => (
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        AlertCircle: () => (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    };

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const response = await http.get(`/api/licenses?status=${REQUESTED_STATUS}`);
            setRequests(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch license requests:', err);
            setError('Failed to load license requests');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isSuperAdmin) {
            fetchRequests();
        }
    }, [fetchRequests, isSuperAdmin]);

    if (!isSuperAdmin) {
        return (
            <div className="max-w-6xl mx-auto mt-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-700 font-medium">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    // Move this hook up to avoid conditional hook execution error

    const openConfirmation = (licenseId, type, tenantId) => {
        setConfirmationModal({ isOpen: true, type, licenseId, tenantId });
    };

    const closeConfirmation = () => {
        setConfirmationModal({ isOpen: false, type: null, licenseId: null });
    };

    const handleConfirmAction = async () => {
        const { licenseId, type, tenantId } = confirmationModal;
        if (!licenseId || !type) return;

        setActionLoading(licenseId);
        closeConfirmation(); // Close immediately or wait? Better to close and show loading on the list item or global? 
        // Logic says: set loading on the item, close modal.

        try {
            const newStatus = type === 'approve' ? ACTIVE_STATUS : DENIED_STATUS;
            await http.patch(`/api/licenses/${licenseId}`, {
                status: newStatus,
                tenantId: tenantId
            });

            // Refresh list
            await fetchRequests();
            // Optional: Success toast here if we had toast imported (we don't in this file yet, but maybe standard is fine or alert removed)
        } catch (err) {
            console.error(`Failed to ${type} license:`, err);
            // Revert loading state if error happens (since we closed modal)
            alert(`Failed to ${type} license`);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <DashboardSectionLayout
            title="License Requests"
            description="Review and manage pending license requests from Clients."
        >
        <div className="max-w-7xl mx-auto space-y-8">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                    <Icons.AlertCircle />
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            )}

            {loading ? (
                <div className="animate-pulse space-y-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <div className="p-6 space-y-4">
                                {/* Table Header */}
                                <div className="flex gap-6 pb-3 border-b border-gray-200">
                                    {[140, 120, 60, 80, 100].map((w, i) => (
                                        <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: w }}></div>
                                    ))}
                                </div>
                                {/* Table Rows */}
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-6 py-4 border-b border-gray-100">
                                        <div className="space-y-2" style={{ width: 140 }}>
                                            <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                            <div className="h-3 w-20 bg-gray-200 rounded"></div>
                                        </div>
                                        <div className="h-4 w-28 bg-gray-200 rounded" style={{ width: 120 }}></div>
                                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                                        <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                        <div className="flex gap-2">
                                            <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
                                            <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Clock />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">No pending requests</h3>
                    <p className="mt-2 text-gray-500">There are no license requests waiting for approval.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Organization
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Seats
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Requested
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {requests?.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-900">
                                                {request.organizationName || request.ownerOrgId}
                                            </div>
                                            {request.organizationName && (
                                                <div className="text-xs text-gray-400 font-mono mt-0.5">ID: {request.ownerOrgId}</div>
                                            )}

                                            {(request.organizerName || request.organizerEmail) && (
                                                <div className="mt-2 space-y-0.5">
                                                    {request.organizerName && (
                                                        <div className="text-xs text-gray-600 flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                            {request.organizerName}
                                                        </div>
                                                    )}
                                                    {request.organizerEmail && (
                                                        <div className="text-xs text-gray-500 flex items-center gap-1">
                                                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                            {request.organizerEmail}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                                                Tenant: {request.tenantId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{request.productName || request.productId}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                                {request.totalSeats} Seats
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(request.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-3">
                                                <button
                                                    onClick={() => openConfirmation(request.id, 'approve', request.tenantId)}
                                                    disabled={actionLoading === request.id}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    <Icons.Check />
                                                    <span className="ml-1.5">Approve</span>
                                                </button>
                                                <button
                                                    onClick={() => openConfirmation(request.id, 'deny', request.tenantId)}
                                                    disabled={actionLoading === request.id}
                                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 cursor-pointer"
                                                >
                                                    <Icons.X />
                                                    <span className="ml-1.5">Deny</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Custom Confirmation Modal */}
            {confirmationModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmationModal.type === 'approve' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {confirmationModal.type === 'approve' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                ) : (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                )}
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                                {confirmationModal.type === 'approve' ? 'Approve Request' : 'Deny Request'}
                            </h3>

                            <p className="text-gray-500 mb-6">
                                Are you sure you want to <strong>{confirmationModal.type}</strong> this license request?
                                {confirmationModal.type === 'approve' && " This will generate active licenses for the organization."}
                                {confirmationModal.type === 'deny' && " The organization will be notified of the rejection."}
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={closeConfirmation}
                                    className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmAction}
                                    className={`flex-1 px-4 py-2 text-white font-medium rounded-lg transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer ${confirmationModal.type === 'approve'
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20'
                                        : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-400 hover:to-pink-500 shadow-red-500/20'
                                        }`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </DashboardSectionLayout>
    );
}
