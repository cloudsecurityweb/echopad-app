import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createLicense, getLicensesByOrganization, updateLicense } from '../../api/licenses.api';
import { useProducts } from '../../hooks/useProducts';

function ManageOrgModal({ isOpen, onClose, organization }) {
  const { getAccessToken } = useAuth();
  const { products } = useProducts();
  const [licenses, setLicenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [createForm, setCreateForm] = useState({
    productId: '',
    licenseType: 'seat', // seat | unlimited
    totalSeats: 10,
    startDate: '',
    endDate: '',
    status: 'active', // active | inactive | expired | suspended
  });

  const [editingLicenseId, setEditingLicenseId] = useState(null);
  const [editForm, setEditForm] = useState({
    licenseType: 'seat',
    totalSeats: 10,
    startDate: '',
    endDate: '',
    status: 'active',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const fetchLicenses = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const token = await getAccessToken();
          const response = await getLicensesByOrganization(organization.tenantId, organization.id);
          setLicenses(response.data?.data || []);
        } catch (err) {
          setError('Failed to fetch licenses.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLicenses();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, organization, getAccessToken]);

  // Initialize defaults when opening modal / when product list loads
  useEffect(() => {
    if (!isOpen) return;
    const today = new Date();
    const oneYear = new Date();
    oneYear.setFullYear(today.getFullYear() + 1);

    const toDateInput = (d) => d.toISOString().slice(0, 10);

    setCreateForm((prev) => ({
      ...prev,
      productId: prev.productId || (products?.[0]?.id || ''),
      startDate: prev.startDate || toDateInput(today),
      endDate: prev.endDate || toDateInput(oneYear),
    }));
  }, [isOpen, products]);

  const productOptions = useMemo(() => {
    return (products || [])
      .map((p) => ({ id: p.id, name: p.name || p.id }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const toIsoDate = (dateInput) => {
    // date input is YYYY-MM-DD. Convert to ISO at midnight UTC to avoid tz shifts.
    if (!dateInput) return null;
    return new Date(`${dateInput}T00:00:00.000Z`).toISOString();
  };

  const generateLicenseId = () =>
    `lic_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  const normalizeLicenseForEdit = (license) => {
    const totalSeats = license.totalSeats ?? license.seats ?? 0;
    const start = license.startDate ? String(license.startDate).slice(0, 10) : '';
    const end = (license.endDate || license.expiresAt) ? String(license.endDate || license.expiresAt).slice(0, 10) : '';

    return {
      licenseType: license.licenseType || (totalSeats ? 'seat' : 'unlimited'),
      totalSeats,
      startDate: start,
      endDate: end,
      status: license.status || 'active',
    };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!createForm.productId) {
      setFormError('Product is required.');
      return;
    }
    if (!organization?.id) {
      setFormError('Organization is missing.');
      return;
    }
    if (createForm.licenseType === 'seat') {
      const seats = Number(createForm.totalSeats);
      if (!Number.isFinite(seats) || seats < 0) {
        setFormError('Total seats must be a non-negative number.');
        return;
      }
    }
    if (createForm.startDate && createForm.endDate && createForm.endDate < createForm.startDate) {
      setFormError('End date must be on or after start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await getAccessToken();
      const payload = {
        id: generateLicenseId(),
        organizationId: organization.id,
        productId: createForm.productId,
        licenseType: createForm.licenseType,
        totalSeats: createForm.licenseType === 'seat' ? Number(createForm.totalSeats) : null,
        startDate: toIsoDate(createForm.startDate),
        endDate: toIsoDate(createForm.endDate),
        status: createForm.status,
      };

      await createLicense(payload);

      // Refresh licenses list
      const refreshed = await getLicensesByOrganization(organization.tenantId, organization.id);
      setLicenses(refreshed.data?.data || []);
    } catch (err) {
      console.error(err);
      setFormError(err?.response?.data?.error || err.message || 'Failed to create license.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEditing = (license) => {
    setEditingLicenseId(license.id);
    setEditForm(normalizeLicenseForEdit(license));
    setFormError(null);
  };

  const cancelEditing = () => {
    setEditingLicenseId(null);
    setFormError(null);
  };

  const handleUpdate = async (license) => {
    setFormError(null);
    if (!license?.id) return;

    if (editForm.licenseType === 'seat') {
      const seats = Number(editForm.totalSeats);
      if (!Number.isFinite(seats) || seats < 0) {
        setFormError('Total seats must be a non-negative number.');
        return;
      }
    }
    if (editForm.startDate && editForm.endDate && editForm.endDate < editForm.startDate) {
      setFormError('End date must be on or after start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await getAccessToken();
      const payload = {
        licenseType: editForm.licenseType,
        totalSeats: editForm.licenseType === 'seat' ? Number(editForm.totalSeats) : null,
        startDate: toIsoDate(editForm.startDate),
        endDate: toIsoDate(editForm.endDate),
        status: editForm.status,
      };

      await updateLicense(license.id, payload);

      // Refresh
      const refreshed = await getLicensesByOrganization(organization.tenantId, organization.id);
      setLicenses(refreshed.data?.data || []);
      setEditingLicenseId(null);
    } catch (err) {
      console.error(err);
      setFormError(err?.response?.data?.error || err.message || 'Failed to update license.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Manage Client Organization: {organization.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Create / Assign License */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-200 mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Create & Assign License</h3>
            <p className="text-sm text-gray-700 mb-4">
              Create a product license for this organization (expiry, seats, and status).
            </p>

            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={createForm.productId}
                  onChange={(e) => setCreateForm((p) => ({ ...p, productId: e.target.value }))}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">License Type</label>
                <select
                  value={createForm.licenseType}
                  onChange={(e) => setCreateForm((p) => ({ ...p, licenseType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                >
                  <option value="seat">Seat-based</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={createForm.startDate}
                  onChange={(e) => setCreateForm((p) => ({ ...p, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={createForm.endDate}
                  onChange={(e) => setCreateForm((p) => ({ ...p, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={createForm.status}
                  onChange={(e) => setCreateForm((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                <input
                  type="number"
                  min="0"
                  value={createForm.totalSeats}
                  onChange={(e) => setCreateForm((p) => ({ ...p, totalSeats: e.target.value }))}
                  disabled={createForm.licenseType !== 'seat'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 bg-white disabled:bg-gray-100"
                />
                {createForm.licenseType !== 'seat' && (
                  <p className="mt-1 text-xs text-gray-600">Unlimited licenses don’t use seat counts.</p>
                )}
              </div>

              <div className="md:col-span-2">
                {formError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-sm mb-3">
                    {formError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || productOptions.length === 0}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating…' : 'Create License'}
                </button>
              </div>
            </form>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Assigned Licenses</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <svg className="animate-spin h-8 w-8 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : licenses.length === 0 ? (
            <div className="text-gray-500">No licenses assigned to this organization.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Total Seats</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Used Seats</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Remaining Seats</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Assigned Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Expiry Date</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {licenses.map((license) => (
                  <tr key={license.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">{license.productId}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{license.licenseType || 'seat'}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {license.licenseType === 'unlimited' ? 'Unlimited' : (license.totalSeats ?? license.seats ?? 0)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {license.usedSeats ?? (license.assignedUserIds ? license.assignedUserIds.length : 0)}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">
                      {license.licenseType === 'unlimited'
                        ? '—'
                        : (license.totalSeats ?? license.seats ?? 0) - (license.usedSeats ?? (license.assignedUserIds ? license.assignedUserIds.length : 0))}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{formatDate(license.createdAt || license.startDate)}</td>
                    <td className="py-4 px-4 text-sm text-gray-700">{formatDate(license.endDate || license.expiresAt)}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        license.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : license.status === 'suspended'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {license.status || 'active'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {editingLicenseId === license.id ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 gap-2">
                            <select
                              value={editForm.licenseType}
                              onChange={(e) => setEditForm((p) => ({ ...p, licenseType: e.target.value }))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                            >
                              <option value="seat">Seat-based</option>
                              <option value="unlimited">Unlimited</option>
                            </select>

                            <input
                              type="number"
                              min="0"
                              value={editForm.totalSeats}
                              onChange={(e) => setEditForm((p) => ({ ...p, totalSeats: e.target.value }))}
                              disabled={editForm.licenseType !== 'seat'}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white disabled:bg-gray-100"
                              placeholder="Total seats"
                            />

                            <input
                              type="date"
                              value={editForm.startDate}
                              onChange={(e) => setEditForm((p) => ({ ...p, startDate: e.target.value }))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                            />

                            <input
                              type="date"
                              value={editForm.endDate}
                              onChange={(e) => setEditForm((p) => ({ ...p, endDate: e.target.value }))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                            />

                            <select
                              value={editForm.status}
                              onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                              className="w-full px-2 py-1.5 border border-gray-300 rounded-md text-sm bg-white"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="suspended">Suspended</option>
                              <option value="expired">Expired</option>
                            </select>
                          </div>

                          {formError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-md px-2 py-1.5 text-xs">
                              {formError}
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdate(license)}
                              disabled={isSubmitting}
                              className="px-3 py-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-semibold disabled:opacity-50"
                            >
                              {isSubmitting ? 'Saving…' : 'Save'}
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(license)}
                          className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageOrgModal;
