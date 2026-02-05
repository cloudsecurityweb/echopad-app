import http from "./http";

export const listOrganizations = (token) =>
  http.get(`/api/organizations`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


export const listOrganizationsDetails = (token) =>
  http.get(`/api/organizations/details`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getOrganization = (orgId, token) =>
  http.get(`/api/organizations/${orgId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateOrganization = (orgId, data, token) =>
  http.patch(`/api/organizations/${orgId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
