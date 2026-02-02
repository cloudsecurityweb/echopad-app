import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { listOrganizationsDetails } from '../../../api/organizations.api';
import { createLicense, getLicensesByOrganization, updateLicense } from '../../../api/licenses.api';
import LicenseFormModal from './components/LicenseFormModal';

function ClientManagementPage() {
    const { tenantId, id } = useParams(); // id is organizationId
    const navigate = useNavigate();
    const { getAccessToken } = useAuth();

    const [organization, setOrganization] = useState(null);
    const [licenses, setLicenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Modals state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingLicense, setEditingLicense] = useState(null); // If null, create mode. If set, edit mode.
    const [modalError, setModalError] = useState(null);

    // Fetch client and licenses
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                await getAccessToken();

                // 1. Fetch Organization Details
                // Since we don't have fetchClientById, we fetch all and find. 
                // Note: listOrganizationsDetails returns all organizations.
                const orgRes = await listOrganizationsDetails();
                const clients = orgRes.data?.data || [];
                const org = clients.find(c => c.id === id);

                if (!org) {
                    setError('Organization not found.');
                    setIsLoading(false);
                    return;
                }
                setOrganization(org);

                // 2. Fetch Licenses using tenantId from params
                const licenseRes = await getLicensesByOrganization(tenantId, id);
                setLicenses(licenseRes.data?.data || []);

            } catch (err) {
                console.error(err);
                setError('Failed to load data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, tenantId, getAccessToken]);

    // Helpers
    const generateLicenseId = () => `lic_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const toIsoDate = (dateInput) => {
        if (!dateInput) return null;
        return new Date(`${dateInput}T00:00:00.000Z`).toISOString();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Handlers
    const handleCreateLicense = async (formData) => {
        try {
            setIsSubmitting(true);
            setModalError(null);
            await getAccessToken();

            const payload = {
                id: generateLicenseId(),
                organizationId: organization.id,
                tenantId: tenantId, // Make sure tenantId is included if API creates expectation
                productId: formData.productId,
                licenseType: formData.licenseType,
                totalSeats: formData.licenseType === 'seat' ? Number(formData.totalSeats) : null,
                startDate: toIsoDate(formData.startDate),
                expiresAt: toIsoDate(formData.expiresAt), // Updated field name
                status: formData.status,
            };

            await createLicense(payload);

            // Refresh
            const refreshed = await getLicensesByOrganization(tenantId, id);
            setLicenses(refreshed.data?.data || []);
            setIsCreateModalOpen(false);
        } catch (err) {
            console.error(err);
            setModalError(err?.response?.data?.error || err.message || 'Failed to create license.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateLicense = async (formData) => {
        if (!editingLicense) return;
        try {
            setIsSubmitting(true);
            setModalError(null);
            await getAccessToken();

            const payload = {
                licenseType: formData.licenseType,
                totalSeats: formData.licenseType === 'seat' ? Number(formData.totalSeats) : null,
                startDate: toIsoDate(formData.startDate),
                expiresAt: toIsoDate(formData.expiresAt), // Updated field name
                status: formData.status,
                tenantId: tenantId, // Include tenantId for backend context
            };

            await updateLicense(editingLicense.id, payload);

            // Refresh
            const refreshed = await getLicensesByOrganization(tenantId, id);
            setLicenses(refreshed.data?.data || []);
            setEditingLicense(null);
        } catch (err) {
            console.error(err);
            setModalError(err?.response?.data?.error || err.message || 'Failed to update license.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            </div>
        );
    }

    if (error || !organization) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-700">
                    {error || 'Organization not found.'}
                    <br />
                    <button onClick={() => navigate('/dashboard/clients')} className="mt-4 text-sm font-medium underline">
                        Back to Clients
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto relative">
            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white p-4 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-100 border-t-cyan-600"></div>
                        <p className="text-sm font-medium text-gray-600">Processing...</p>
                    </div>
                </div>
            )}

            {/* Header with Back Button */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/dashboard/clients')}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
                    aria-label="Back"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{organization.name}</h1>
                    <p className="text-gray-500">Manage licenses and settings</p>
                </div>
            </div>

            {/* Licenses Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-8">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50/50">
                    <h2 className="text-xl font-semibold text-gray-900">Licenses</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow hover:from-cyan-400 hover:to-blue-500 transition"
                    >
                        <i className="bi bi-plus-lg"></i>
                        Create License
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Product</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Type</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Seats</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Used</th>

                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Assigned On</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Expires On</th>
                                <th className="text-left py-3 px-6 text-sm font-semibold text-gray-700">Status</th>
                                <th className="text-right py-3 px-6 text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {licenses.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                        No licenses found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                licenses.map((license) => {
                                    const totalSeats = license.totalSeats ?? license.seats ?? 0;
                                    const usedSeats = license.usedSeats ?? (license.assignedUserIds ? license.assignedUserIds.length : 0);
                                    const isUnlimited = license.licenseType === 'unlimited';

                                    return (
                                        <tr key={license.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{license.productId}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 capitalize">{license.licenseType || 'seat'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {isUnlimited ? 'Unlimited' : totalSeats}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {usedSeats}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(license.startDate)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {formatDate(license.expiresAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${license.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : license.status === 'suspended'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {license.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => setEditingLicense(license)}
                                                    className="text-cyan-600 hover:text-cyan-700 font-medium text-sm transition-colors"
                                                >
                                                    Update
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            <LicenseFormModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setModalError(null);
                }}
                onSubmit={handleCreateLicense}
                error={modalError}
            />

            {/* Edit Modal */}
            {editingLicense && (
                <LicenseFormModal
                    isOpen={!!editingLicense}
                    onClose={() => {
                        setEditingLicense(null);
                        setModalError(null);
                    }}
                    onSubmit={handleUpdateLicense}
                    initialData={{
                        ...editingLicense,
                        startDate: editingLicense.startDate ? String(editingLicense.startDate).slice(0, 10) : '',
                        expiresAt: (editingLicense.expiresAt || editingLicense.endDate) ? String(editingLicense.expiresAt || editingLicense.endDate).slice(0, 10) : ''
                    }}
                    isEditing={true}
                    error={modalError}
                />
            )}
        </div>
    );
}

export default ClientManagementPage;
