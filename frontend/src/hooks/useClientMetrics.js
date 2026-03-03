import { useCallback, useEffect, useState } from 'react';
import { fetchClientMetrics } from '../api/metrics.api';

/**
 * Fetches aggregated transcription metrics for the client organization.
 * @param {Object} options
 * @param {{ from?: string, to?: string }} [options.dateRange] - Optional ISO date range
 * @param {boolean} [options.enabled=true] - Skip fetching when false
 * @returns {{ data: Object|null, loading: boolean, error: string|null, refresh: function }}
 */
export function useClientMetrics({ dateRange, enabled = true } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetch = useCallback(async () => {
        if (!enabled) return;
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (dateRange?.from) params.from = dateRange.from;
            if (dateRange?.to) params.to = dateRange.to;
            const response = await fetchClientMetrics(params);
            const payload = response.data?.data ?? response.data;
            setData(payload);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to load metrics');
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [enabled, dateRange?.from, dateRange?.to]);

    useEffect(() => {
        if (enabled) fetch();
    }, [enabled, fetch]);

    const refresh = useCallback(() => fetch(), [fetch]);

    return { data, loading, error, refresh };
}
