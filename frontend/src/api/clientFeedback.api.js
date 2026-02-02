import http from "./http";

export const fetchClientFeedback = (params = {}) =>
  http.get("/api/client-feedback", { params });

export const createClientFeedback = payload =>
  http.post("/api/client-feedback", payload);