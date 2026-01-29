import { useEffect, useState } from "react";
import {
  fetchAssignmentsByTenant,
  revokeLicense as revokeLicenseApi,
  inviteUserToProduct,
  activateLicense as activateLicenseApi,
} from "../api/licenses.api";

/**
 * License Assignment Hook
 * - Tenant scoped
 * - SUPER_ADMIN / CLIENT_ADMIN usage
 */
export function useLicenses(tenantId) {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tenantId) return;

    setLoading(true);
    fetchAssignmentsByTenant(tenantId)
      .then(res => {
        setAssignments(res.data.data.assignments);
      })
      .finally(() => setLoading(false));
  }, [tenantId]);

  /** ACTIONS */

  const revokeLicense = async ({ licenceId }) => {
    console.log("Revoke license:", licenceId);

    await revokeLicenseApi({ tenantId, licenceId });
    setAssignments(prev =>
      prev.map(a =>
        a.id === licenceId ? { ...a, status: "REVOKED" } : a
      )
    );
  };

  const inviteUser = async payload => {
    console.log("Invite user payload:", payload);

    await inviteUserToProduct(payload);
  };

  const activateLicense = async payload => {
    console.log("Activate license:", payload);

    await activateLicenseApi(payload);
  };

  return {
    assignments,
    loading,
    revokeLicense,
    inviteUser,
    activateLicense,
  };
}
