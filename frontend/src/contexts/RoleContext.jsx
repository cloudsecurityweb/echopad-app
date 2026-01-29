import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { mapEntraRoleToFrontendRole } from '../utils/tokenDecoder';

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
  const { userProfile, tokenRoles, userOID } = useAuth();
  
  // Role is derived from backend userProfile (primary) or token roles (fallback)
  // Default to CLIENT_ADMIN (non-SuperAdmin sign-ins become ClientAdmin)
  const [currentRole, setCurrentRole] = useState(ROLES.CLIENT_ADMIN);
  const [isLoadingRole, setIsLoadingRole] = useState(true);

  // Update role when userProfile or tokenRoles change
  useEffect(() => {
    // If we have token roles, we can determine role immediately
    if (tokenRoles && tokenRoles.length > 0) {
      const newRole = getRoleFromProfile(userProfile, tokenRoles);
      if (newRole) {
        setCurrentRole(newRole);
        setIsLoadingRole(false);
        return;
      }
    }

    // If userProfile is loaded, use it
    if (userProfile !== null) {
      const newRole = getRoleFromProfile(userProfile, tokenRoles);
      setIsLoadingRole(false);
      
      if (newRole) {
        setCurrentRole(newRole);
      } else {
        // No role found, default to CLIENT_ADMIN (non-SuperAdmin sign-ins become ClientAdmin)
        if (import.meta.env.DEV) {
          console.warn('[ROLE] No role found, defaulting to client_admin (non-SuperAdmin users become ClientAdmin)');
        }
        setCurrentRole(ROLES.CLIENT_ADMIN);
      }
      return;
    }

    // If we have OID but no userProfile yet and no token roles, set default role immediately
    // This ensures ClientAdmin users can access dashboard immediately (same as SuperAdmin)
    // Don't wait for profile fetch - set default role now, update later if profile has different role
    if (userOID && !userProfile && tokenRoles.length === 0) {
      // Set default role immediately (don't wait for profile)
      setCurrentRole(ROLES.CLIENT_ADMIN);
      setIsLoadingRole(false);
      console.log('🔐 [ROLE] Setting default ClientAdmin role immediately (profile loading in background)');
      // Profile will load in background and update role if different
      // No need for timeout - role is set immediately
      return;
    }

    // If no OID and no profile, we're not authenticated yet
    if (!userOID) {
      setIsLoadingRole(false);
    }
  }, [userProfile, tokenRoles, userOID]);

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



