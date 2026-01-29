import { useEffect, useState } from "react";
import { USE_MOCK_DATA } from "../config/featureFlags";
import {
  fetchUserProfile,
  updateUserStatus as updateUserStatusApi,
  updateUser as updateUserApi,
} from "../api/users.api";

/**
 * User Profile Hook
 * - Works for SUPER_ADMIN, CLIENT_ADMIN, USER
 */
export function useUserProfile({ tenantId, userId }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tenantId || !userId) return;

    if (USE_MOCK_DATA) {
      setProfile({
        tenantId,
        userId,
        email: "admin@csw.ai",
        role: "SUPER_ADMIN",
        status: "ACTIVE",
      });
      return;
    }

    setLoading(true);
    fetchUserProfile(tenantId, userId)
      .then(res => {
        setProfile(res.data.data);
      })
      .finally(() => setLoading(false));
  }, [tenantId, userId]);

  const updateStatus = async status => {
    console.log("Update user status:", status);

    if (USE_MOCK_DATA) {
      setProfile(prev => ({ ...prev, status }));
      return;
    }

    const res = await updateUserStatusApi(userId, tenantId, status);
    setProfile(res.data.data);
  };

  const updateProfile = async updates => {
    if (!profile) return;

    if (USE_MOCK_DATA) {
      setProfile(prev => ({ ...prev, ...updates }));
      return;
    }

    const payload = {
      ...profile,
      ...updates,
      email: profile.email,
      tenantId: profile.tenantId || tenantId,
      id: profile.id || userId,
    };

    const res = await updateUserApi(userId, payload);
    setProfile(res.data.data);
  };

  return {
    profile,
    loading,
    updateStatus,
    updateProfile,
  };
}
