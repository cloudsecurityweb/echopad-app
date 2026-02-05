import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import http from '../api/http';

/**
 * @typedef {Object} Organization
 * @property {string} id
 * @property {string} tenantId
 * @property {string} name
 * @property {string} type
 * @property {string} status
 */

/**
 * Organization hook (client admin)
 */
export function useOrganization() {
  // const { userProfile } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const orgId = userProfile?.organization?.id || userProfile?.user?.organizationId || null;
  const orgId = "org_aurora";

  // console.log('useOrganization orgId:', userProfile);
  const fetchOrganization = useCallback(async () => {
    if (!orgId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await http.get(`/api/organizations/${orgId}`);
      const data = response.data;
      setOrganization(data?.data || data?.organization || null);
    } catch (err) {
      console.warn('Failed to fetch organization:', err);
      setOrganization(userProfile?.organization || null);
      setError(err.message || 'Failed to load organization');
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  const updateOrganization = useCallback(
    async (updates) => {
      if (!orgId) return null;

      const response = await http.patch(`/api/organizations/${orgId}`, updates);
      const data = response.data;
      const updated = data?.data || data?.organization || null;
      if (updated) {
        setOrganization(updated);
      }
      return updated;
    },
    [orgId]
  );

  return {
    organization,
    orgId,
    loading,
    error,
    refresh: fetchOrganization,
    updateOrganization,
  };
}
