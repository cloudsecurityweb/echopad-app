import http from "./http";

export const fetchHelpDocs = (params = {}) =>
  http.get("/api/help-center", { params });

export const fetchHelpDocById = (docId) =>
  http.get(`/api/help-center/${docId}`);

export const createHelpDoc = payload =>
  http.post("/api/help-center", payload);

export const updateHelpDoc = (docId, payload) =>
  http.patch(`/api/help-center/${docId}`, payload);