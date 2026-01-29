import http from "./http";

export const fetchAssignmentsByTenant = tenantId =>
  http.get(`/license-assignments/${tenantId}`);

export const inviteUserToProduct = payload =>
  http.post(`/license-assignments/invite`, payload);

export const activateLicense = ({ tenantId, licenceId, userId, email }) =>
  http.patch(
    `/license-assignments/activate/${tenantId}/${licenceId}/${userId}/${email}`
  );

export const revokeLicense = ({ tenantId, licenceId }) =>
  http.patch(`/license-assignments/revoke/${tenantId}/${licenceId}`);