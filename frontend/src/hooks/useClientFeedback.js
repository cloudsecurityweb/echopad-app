import { useEffect, useMemo, useState } from "react";
import { fetchClientFeedback } from "../api/clientFeedback.api";

export function useClientFeedback(params = {}) {
  const [feedback, setFeedback] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { refreshKey, ...queryParams } = params;
  const queryKey = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetchClientFeedback(queryParams)
      .then(res => {
        if (!isMounted) return;
        const payload = res.data?.data?.feedback || {};
        setFeedback(payload.items || []);
        setContinuationToken(payload.continuationToken || null);
        setError(null);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err?.message || "Failed to load client feedback");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [queryKey]);

  return {
    feedback,
    continuationToken,
    loading,
    error,
  };
}
