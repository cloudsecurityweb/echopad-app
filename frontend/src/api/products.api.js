import http from "./http";

export const fetchProducts = () =>
  http.get("/products");

export const fetchProductByCode = productCode =>
  http.get(`/products/${productCode}`);

export const createProduct = payload =>
  http.post("/products", payload);

export const updateProduct = (productCode, payload) =>
  http.patch(`/products/${productCode}`, payload);
