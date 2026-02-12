import { useEffect, useState, useCallback } from "react";
import { fetchProducts } from "../api/products.api";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchProducts()
      .then(res => {
        if (isMounted) {
          setProducts(res.data.data.products);
          setError(null);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err);
          console.error("Failed to load products:", err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return { products, loading, error, refetch };
}
