import { useEffect, useMemo, useState } from "react";
import { fetchHelpDocs } from "../api/helpCenter.api";

export function useHelpCenterDocs(params = {}) {
  const [docs, setDocs] = useState([]);
  const [continuationToken, setContinuationToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { refreshKey, ...queryParams } = params;
  const queryKey = useMemo(() => JSON.stringify(params), [params]);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetchHelpDocs(queryParams)
      .then(res => {
        if (!isMounted) return;
        const payload = res.data?.data?.docs || {};
        setDocs(payload.items || []);
        setContinuationToken(payload.continuationToken || null);
        setError(null);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err?.message || "Failed to load help docs");
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
    docs,
    continuationToken,
    loading,
    error,
  };
}
