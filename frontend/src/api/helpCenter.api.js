import http from "./http";

export const fetchHelpDocs = (params = {}) =>
  http.get("/help-center", { params });

export const createHelpDoc = payload =>
  http.post("/help-center", payload);

export const updateHelpDoc = (docId, payload) =>
  http.patch(`/help-center/${docId}`, payload);
