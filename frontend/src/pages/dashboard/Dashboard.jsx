import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRole, ROLES } from '../../contexts/RoleContext';
import { getRolesFromToken } from '../../utils/tokenDecoder';

function Dashboard() {
  const { isAuthenticated, isLoading, isAuthReady, tokenRoles, userProfile, userOID } = useAuth();
  const { currentRole, isLoadingRole } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role-specific dashboard
    // Only redirect if authenticated, auth is ready, and not loading
    if (!isLoading && isAuthReady && isAuthenticated && !isLoadingRole) {
      const currentPath = window.location.pathname;

      // Check if already on a role-specific route - if yes, don't redirect
      if (currentPath === '/dashboard/super-admin' ||
        currentPath === '/dashboard/client-admin' ||
        currentPath === '/dashboard/user-admin') {
        // Already on role-specific route, no need to redirect
        return;
      }

      // Determine role to use (prefer currentRole from context, which comes from userProfile)
      let roleToUse = currentRole;

      // Debug logging
      console.log('🔍 [DASHBOARD] Role detection:', {
        currentRole,
        userProfileRole: userProfile?.user?.role,
        userEmail: userProfile?.user?.email,
        tokenRoles,
        userProfile: userProfile?.user,
      });

      // If we have userProfile, use its role (most reliable)
      if (userProfile?.user?.role) {
        const backendRole = userProfile.user.role;
        console.log(`🔍 [DASHBOARD] Backend role from userProfile: ${backendRole}`);
        if (backendRole === 'superAdmin') {
          roleToUse = ROLES.SUPER_ADMIN;
          console.log('✅ [DASHBOARD] Setting role to SUPER_ADMIN');
        } else if (backendRole === 'clientAdmin') {
          roleToUse = ROLES.CLIENT_ADMIN;
          console.log('✅ [DASHBOARD] Setting role to CLIENT_ADMIN');
        } else if (backendRole === 'user') {
          roleToUse = ROLES.USER_ADMIN;
          console.log('✅ [DASHBOARD] Setting role to USER_ADMIN');
        }
      }

      // Fallback to token roles if userProfile doesn't have role (immediate for SuperAdmin)
      if ((!roleToUse || roleToUse === ROLES.USER_ADMIN) && tokenRoles && tokenRoles.length > 0) {
        if (tokenRoles.includes('SuperAdmin')) {
          roleToUse = ROLES.SUPER_ADMIN;
        } else if (tokenRoles.includes('ClientAdmin')) {
          roleToUse = ROLES.CLIENT_ADMIN;
        } else if (tokenRoles.includes('UserAdmin')) {
          roleToUse = ROLES.USER_ADMIN;
        }
      }

      // If we have a role from context, use it (even if userProfile not loaded yet)
      // This ensures smooth redirect for all users, not just superadmin
      if (!roleToUse && currentRole && currentRole !== ROLES.USER_ADMIN) {
        roleToUse = currentRole;
      }

      // Default to CLIENT_ADMIN for new users (non-SuperAdmin sign-ins become ClientAdmin)
      // This matches backend behavior: new sign-ins default to ClientAdmin role
      // Redirect immediately - don't wait for profile fetch
      if (!roleToUse) {
        roleToUse = ROLES.CLIENT_ADMIN;
      }

      try {
        let targetRoute = '/dashboard/client-admin'; // Default to client-admin (not user-admin)

        if (roleToUse === ROLES.SUPER_ADMIN) {
          targetRoute = '/dashboard/super-admin';
        } else if (roleToUse === ROLES.CLIENT_ADMIN) {
          targetRoute = '/dashboard/client-admin';
        } else if (roleToUse === ROLES.USER_ADMIN) {
          targetRoute = '/dashboard/user-admin';
        }

        // Navigate immediately (replace: true to avoid back button issues)
        console.log('🚀 [DASHBOARD] Redirecting to:', targetRoute, '| Role:', roleToUse);
        navigate(targetRoute, { replace: true });
      } catch (error) {
        console.error('Error navigating to role-specific dashboard:', error);
        navigate('/dashboard/client-admin', { replace: true });
      }
    }
  }, [isLoading, isAuthReady, isAuthenticated, currentRole, navigate, tokenRoles, userProfile, userOID, isLoadingRole]);

  if (isLoading || !isAuthReady || isLoadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-cyan-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600">No account found. Please sign in.</p>
        </div>
      </div>
    );
  }

  // Check if already on a role-specific route - if yes, return null (let that route render)
  const currentPath = window.location.pathname;
  if (currentPath === '/dashboard/super-admin' ||
    currentPath === '/dashboard/client-admin' ||
    currentPath === '/dashboard/user-admin') {
    return null; // Already on role-specific route, let it render
  }

  // This component will redirect immediately, so return null (redirect happens in useEffect)
  // Don't show loader - redirect is instant
  return null;
}

export default Dashboard;

