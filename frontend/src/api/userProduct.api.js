import http from "./http";

export const fetchUserProducts = () =>
  http.get(`/api/user-products`);
