import { useCallback, useEffect, useState } from 'react';
import http from '../api/http';

export function useProductUsage({ organizationId, productCode }) {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsage = useCallback(async () => {
    if (!organizationId || !productCode) return;

    setLoading(true);
    setError(null);
    try {
      const response = await http.get(`/api/analytics/usage?orgId=${encodeURIComponent(organizationId)}&productCode=${encodeURIComponent(productCode)}`);
      const data = response.data;
      setUsage(data?.data || null);
    } catch (err) {
      setError(err.message || 'Failed to load usage data');
    } finally {
      setLoading(false);
    }
  }, [organizationId, productCode]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  return { usage, loading, error, refresh: fetchUsage };
}
