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
