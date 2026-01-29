import { useEffect, useState } from "react";
import { fetchProducts } from "../api/products.api";

export function useProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(res => {
      setProducts(res.data.data.products);
    });
  }, []);

  return { products };
}
