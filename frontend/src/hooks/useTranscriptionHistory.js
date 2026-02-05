import { useCallback, useEffect, useState } from 'react';
import http from '../api/http';

/**
 * Fetches the current user's transcription history from GET /api/transcription-history.
 * @param {Object} options
 * @param {number} [options.limit=20] - Max items per page
 * @param {boolean} [options.enabled=true] - If false, skips fetching
 * @returns {{ items: Array, loading: boolean, error: string | null, refresh: function, continuationToken: string | undefined }}
 */
export function useTranscriptionHistory({ limit = 20, enabled = true } = {}) {
  const [items, setItems] = useState([]);
  const [continuationToken, setContinuationToken] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async (token) => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const params = { limit };
      if (token) params.token = token;
      const response = await http.get('/api/transcription-history', { params });
      const payload = response.data?.data ?? response.data;
      const list = payload?.items ?? [];
      const nextToken = payload?.continuationToken;
      setItems((prev) => (token ? [...prev, ...list] : list));
      setContinuationToken(nextToken);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load transcription history');
      setItems((prev) => (token ? prev : []));
      setContinuationToken(undefined);
    } finally {
      setLoading(false);
    }
  }, [limit, enabled]);

  useEffect(() => {
    if (enabled) fetchHistory();
  }, [enabled, fetchHistory]);

  const loadMore = useCallback(() => {
    if (continuationToken && !loading) fetchHistory(continuationToken);
  }, [continuationToken, loading, fetchHistory]);

  const refresh = useCallback(() => fetchHistory(), [fetchHistory]);

  return { items, loading, error, continuationToken, loadMore, refresh };
}
