import http from "./http";

export const fetchClientFeedback = (params = {}) =>
  http.get("/client-feedback", { params });

export const createClientFeedback = payload =>
  http.post("/client-feedback", payload);

export const updateClientFeedback = (feedbackId, payload) =>
  http.patch(`/client-feedback/${feedbackId}`, payload);
