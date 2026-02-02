import { useEffect, useState } from "react";
import { fetchHelpDocById } from "../api/helpCenter.api";

export function useHelpCenterDoc(docId) {
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetchHelpDocById(docId)
      .then(res => {
        if (!isMounted) return;
        setDoc(res.data?.data?.doc || null);
        setError(null);
      })
      .catch(err => {
        if (!isMounted) return;
        setError(err?.message || "Failed to load help doc");
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [docId]);

  return {
    doc,
    loading,
    error,
  };
}
