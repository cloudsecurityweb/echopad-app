import { useCallback, useEffect, useState } from 'react';
import http from '../api/http';

/**
 * @typedef {Object} License
 * @property {string} id
 * @property {string} productId
 * @property {string} organizationId
 * @property {string} licenseType
 * @property {number} totalSeats
 * @property {number} usedSeats
 * @property {string} status
 * @property {string} startDate
 * @property {string} endDate
 */

export function useOrgLicenses(organizationId) {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLicenses = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await http.get(`/api/licenses?organizationId=${encodeURIComponent(organizationId)}`);
      const data = response.data;
      setLicenses(data?.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load licenses');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  return { licenses, loading, error, refresh: fetchLicenses };
}
