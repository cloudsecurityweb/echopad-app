import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mapEntraRoleToFrontendRole, getUserInfoFromToken } from '../utils/tokenDecoder';
import { useMsal } from '@azure/msal-react';

const RoleContext = createContext(null);

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CLIENT_ADMIN: 'client_admin',
  USER_ADMIN: 'user_admin',
};

/**
 * Get role from user profile (backend) - PRIMARY source of truth
 * Falls back to token roles if profile not available yet
 * @param {Object} userProfile - User profile from backend
 * @param {Array<string>} tokenRoles - Roles from Entra ID token
 * @returns {string|null} Mapped role or null
 */
function getRoleFromProfile(userProfile, tokenRoles = []) {
  // First, try to get role from backend profile (most reliable)
  if (userProfile && userProfile.user) {
    const backendRole = userProfile.user.role;

    // Map backend roles to app roles
    if (backendRole === 'superAdmin') {
      return ROLES.SUPER_ADMIN;
    }
    if (backendRole === 'clientAdmin') {
      return ROLES.CLIENT_ADMIN;
    }
    if (backendRole === 'user') {
      return ROLES.USER_ADMIN;
    }
  }

  // Fallback: Use token roles if profile not available yet
  // This helps with immediate role detection before backend responds
  if (tokenRoles && tokenRoles.length > 0) {
    console.log('🔐 [ROLE] Using token roles as fallback:', tokenRoles);

    // Check for SuperAdmin first (highest privilege)
    if (tokenRoles.includes('SuperAdmin')) {
      return ROLES.SUPER_ADMIN;
    }
    if (tokenRoles.includes('ClientAdmin')) {
      return ROLES.CLIENT_ADMIN;
    }
    if (tokenRoles.includes('UserAdmin')) {
      return ROLES.USER_ADMIN;
    }
  }

  // Default to CLIENT_ADMIN for new users (non-SuperAdmin sign-ins become ClientAdmin)
  // UserAdmin users are invited by ClientAdmin after they sign up
  return ROLES.CLIENT_ADMIN; // Default for non-SuperAdmin users
}

export function RoleProvider({ children }) {
  const { userProfile, tokenRoles, userOID, accessToken, authProvider, isLoading: isAuthLoading, isAuthenticated } = useAuth();
  const { account } = useMsal();

  // Role is derived from backend userProfile (primary) or token roles (fallback)
  // Default to CLIENT_ADMIN (non-SuperAdmin sign-ins become ClientAdmin)
  const [currentRole, setCurrentRole] = useState(ROLES.CLIENT_ADMIN);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  // Helper to get user email from various sources
  const getUserEmail = () => {
    if (userProfile?.user?.email) return userProfile.user.email;
    if (account?.username) return account.username;
    if (accessToken && authProvider === 'microsoft') {
      const userInfo = getUserInfoFromToken(accessToken);
      return userInfo?.email;
    }
    return null;
  };

  // Check if user is SuperAdmin based on email domain
  const isSuperAdminEmail = (email) => {
    return email && email.toLowerCase().endsWith('@cloudsecurityweb.com');
  };

  // Update role when userProfile or tokenRoles change
  // Priority order: Token roles > Backend profile > Email domain > Default
  // CRITICAL: Keep isLoadingRole=true until we have a RELIABLE role source
  // to prevent flash of wrong dashboard (e.g. CLIENT_ADMIN menus shown to SUPER_ADMIN)
  useEffect(() => {
    const userEmail = getUserEmail();
    const isSuperAdmin = isSuperAdminEmail(userEmail);
    let newRole = null;
    let roleIsReliable = false; // Track whether role came from a reliable source

    // PRIORITY 1: Token roles (Entra ID - source of truth when present)
    if (tokenRoles && tokenRoles.length > 0) {
      if (tokenRoles.includes('SuperAdmin')) {
        newRole = ROLES.SUPER_ADMIN;
        console.log('✅ [ROLE] Role from token: SUPER_ADMIN');
      } else if (tokenRoles.includes('ClientAdmin')) {
        newRole = ROLES.CLIENT_ADMIN;
        console.log('✅ [ROLE] Role from token: CLIENT_ADMIN');
      } else if (tokenRoles.includes('UserAdmin')) {
        newRole = ROLES.USER_ADMIN;
        console.log('✅ [ROLE] Role from token: USER_ADMIN');
      }
      if (newRole) roleIsReliable = true;
    }

    // PRIORITY 2: Backend userProfile role (database - reliable when available)
    if (!newRole && userProfile !== null) {
      const profileRole = getRoleFromProfile(userProfile, tokenRoles);
      if (profileRole) {
        newRole = profileRole;
        roleIsReliable = true;
        console.log(`✅ [ROLE] Role from profile: ${profileRole}`);
      }
    }

    // PRIORITY 3: Email domain check (@cloudsecurityweb.com = SuperAdmin)
    // This matches backend logic that upgrades these users to SUPER_ADMIN
    if (!newRole && isSuperAdmin) {
      newRole = ROLES.SUPER_ADMIN;
      roleIsReliable = true;
      console.log('🔐 [ROLE] Detected @cloudsecurityweb.com email - treating as SuperAdmin:', userEmail);
    }

    // PRIORITY 4: Default to CLIENT_ADMIN for new users (non-SuperAdmin sign-ins become ClientAdmin)
    if (!newRole) {
      newRole = ROLES.CLIENT_ADMIN;
      if (import.meta.env.DEV && userOID) {
        console.log('[ROLE] Defaulting to CLIENT_ADMIN (new user or role not found)');
      }
    }

    // Update role state
    setCurrentRole(newRole);

    // CRITICAL: Only mark role as loaded when:
    // 1. Role came from a reliable source (token, profile, or email domain), OR
    // 2. Auth is FULLY done loading AND user is not authenticated (truly no user), OR
    // 3. Auth is FULLY done loading AND we got profile data (even if role defaulted)
    // We ALWAYS require !isAuthLoading for cases 2 & 3 to avoid premature false
    // during MSAL cache initialization when isAuthenticated flickers.
    if (roleIsReliable || (!isAuthLoading && !isAuthenticated) || (!isAuthLoading && userProfile !== null)) {
      setIsLoadingRole(false);
    }
    // If still loading auth or waiting for profile, keep isLoadingRole=true
    // to prevent flash of wrong dashboard

    // Log final role determination
    if (import.meta.env.DEV) {
      console.log('🔍 [ROLE] Final role determination:', {
        role: newRole,
        roleIsReliable,
        isLoadingRole: !(roleIsReliable || !isAuthenticated || (!isAuthLoading && userProfile !== null)),
        source: tokenRoles?.length > 0 ? 'token' :
          userProfile?.user?.role ? 'profile' :
            isSuperAdmin ? 'email-domain' : 'default',
        tokenRoles,
        profileRole: userProfile?.user?.role,
        userEmail,
      });
    }
  }, [userProfile, tokenRoles, userOID, accessToken, authProvider, account, isAuthLoading, isAuthenticated]);

  const isSuperAdmin = currentRole === ROLES.SUPER_ADMIN;
  const isClientAdmin = currentRole === ROLES.CLIENT_ADMIN;
  const isUserAdmin = currentRole === ROLES.USER_ADMIN;

  const value = {
    currentRole,
    isLoadingRole, // Expose loading state so components can wait
    // Removed setCurrentRole - role can only be set by backend
    isSuperAdmin,
    isClientAdmin,
    isUserAdmin,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}



