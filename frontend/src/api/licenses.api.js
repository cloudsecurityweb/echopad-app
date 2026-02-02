import http from "./http";

export const fetchAssignmentsByTenant = tenantId =>
  http.get(`/api/license-assignments/${tenantId}`);

export const inviteUserToProduct = payload =>
  http.post(`/api/license-assignments/invite`, payload);

export const activateLicense = ({ tenantId, licenceId, userId, email }) =>
  http.patch(
    `/api/license-assignments/activate/${tenantId}/${licenceId}/${userId}/${email}`
  );

export const revokeLicense = ({ tenantId, licenceId }) =>
  http.patch(`/api/license-assignments/revoke/${tenantId}/${licenceId}`);

export const getLicensesByOrganization = (tenantId, organizationId) =>
  http.get(`/api/licenses?tenantId=${tenantId}&organizationId=${organizationId}`);

// License records (Cosmos "licenses" container)
export const createLicense = payload =>
  http.post("/api/licenses", payload);

export const updateLicense = (licenseId, payload) =>
  http.patch(`/api/licenses/${encodeURIComponent(licenseId)}`, payload);