import http from "./http";

export const fetchProducts = () =>
  http.get("/api/products");

export const fetchProductByCode = productCode =>
  http.get(`/api/products/${productCode}`);

export const createProduct = payload =>
  http.post("/api/products", payload);

export const updateProduct = (productCode, payload) =>
  http.patch(`/api/products/${productCode}`, payload);