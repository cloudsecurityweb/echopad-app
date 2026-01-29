import http from "./http";

export const fetchClients = (params = {}) =>
  http.get("/clients", { params });

export const createClient = payload =>
  http.post("/clients", payload);
