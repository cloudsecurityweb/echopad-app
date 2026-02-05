import http from "./http";

export const fetchClients = (params = {}) =>
  http.get("/api/clients", { params });

export const createClient = payload =>
  http.post("/api/clients", payload);