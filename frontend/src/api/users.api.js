import http from "./http";

export const fetchUserProfile = (tenantId, userId) =>
  http.get(`/api/users/profile/${tenantId}/${userId}`);

export const updateUserStatus = (userId, tenantId, status) =>
  http.patch(`/api/users/${userId}/status`, { tenantId, status });

export const updateUser = (userId, payload) =>
  http.put(`/api/users/${userId}`, payload);

export const fetchUserProducts = (userId) =>
  http.get(`/api/users/${userId}/products`);
