import { useCallback, useEffect, useState } from 'react';
import http from '../api/http';

export function useAnalyticsClientAdmin(organizationId) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(!!organizationId);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await http.get(`/api/analytics/org-summary?orgId=${encodeURIComponent(organizationId)}`);
      const data = response.data;
      setSummary(data?.data || data?.summary || null);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refresh: fetchSummary };
}
