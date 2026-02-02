import { useCallback, useEffect, useState } from 'react';
import http from '../api/http';

/**
 * @typedef {Object} UserLicense
 * @property {string} id
 * @property {string} userId
 * @property {string} licenseId
 * @property {string} productId
 * @property {string} organizationId
 */

export function useUserLicenses(organizationId) {
  const [userLicenses, setUserLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserLicenses = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await http.get(`/api/user-licenses?organizationId=${encodeURIComponent(organizationId)}`);
      const data = response.data;
      setUserLicenses(data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load user licenses');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchUserLicenses();
  }, [fetchUserLicenses]);

  const assignLicense = useCallback(
    async ({ organizationId: orgId, userId, licenseId }) => {
      const response = await http.post(`/api/user-licenses/assign`, { organizationId: orgId, userId, licenseId });
      await fetchUserLicenses();
      return response.data;
    },
    [fetchUserLicenses]
  );

  const revokeLicense = useCallback(
    async ({ userId, licenseId }) => {
      const response = await http.post(`/api/user-licenses/revoke`, { userId, licenseId });
      await fetchUserLicenses();
      return response.data;
    },
    [fetchUserLicenses]
  );

  return {
    userLicenses,
    loading,
    error,
    refresh: fetchUserLicenses,
    assignLicense,
    revokeLicense,
  };
}
