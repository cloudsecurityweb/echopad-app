import { useEffect, useState } from "react";
import { fetchSuperAdminAnalytics } from "../api/analytics.api";

export function useSuperAdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);
    fetchSuperAdminAnalytics()
      .then(res => {
        if (!isMounted) return;
        setAnalytics(res.data?.data?.analytics || null);
        setError(null);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err?.message || "Failed to load analytics");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { analytics, loading, error };
}
