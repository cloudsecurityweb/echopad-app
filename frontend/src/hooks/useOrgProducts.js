import { useCallback, useEffect, useState } from 'react';
import http from '../api/http'; // Import the http client

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; // Keep for base URL reference, though http client handles it

/**
 * @typedef {Object} OrgProduct
 * @property {string} id
 * @property {string} organizationId
 * @property {string} productId
 * @property {string} productSku
 * @property {string} status
 */

export function useOrgProducts(organizationId) {
  // const { getAccessToken } = useAuth(); // No longer needed
  const [orgProducts, setOrgProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrgProducts = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      // Use the http client instead of authenticatedApiCall
      const response = await http.get(`/api/org-products?organizationId=${encodeURIComponent(organizationId)}`);
      setOrgProducts(response.data?.data || []); // axios puts response in .data
    } catch (err) {
      setError(err.message || 'Failed to load organization products');
    } finally {
      setLoading(false);
    }
  }, [organizationId]); // getAccessToken is removed from dependencies

  useEffect(() => {
    fetchOrgProducts();
  }, [fetchOrgProducts]);

  return { orgProducts, loading, error, refresh: fetchOrgProducts };
}
