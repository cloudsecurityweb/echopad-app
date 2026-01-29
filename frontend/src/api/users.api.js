import http from "./http";

export const fetchUserProfile = (tenantId, userId) =>
  http.get(`/users/profile/${tenantId}/${userId}`);

export const updateUserStatus = (userId, tenantId, status) =>
  http.patch(`/users/${userId}/status`, { tenantId, status });

export const updateUser = (userId, payload) =>
  http.put(`/users/${userId}`, payload);
