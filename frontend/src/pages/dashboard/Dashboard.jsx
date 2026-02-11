import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRole, ROLES } from '../../contexts/RoleContext';
import { getRolesFromToken, getUserInfoFromToken } from '../../utils/tokenDecoder';
import { useMsal } from '@azure/msal-react';

function Dashboard() {
  const { isAuthenticated, isLoading, isAuthReady, tokenRoles, userProfile, userOID, accessToken, authProvider } = useAuth();
  const { currentRole, isLoadingRole } = useRole();
  const { account } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to role-specific dashboard
    // Only redirect if authenticated, auth is ready, and not loading
    if (!isLoading && isAuthReady && isAuthenticated && !isLoadingRole) {
      const currentPath = window.location.pathname;

      // Check if already on a role-specific route - if yes, don't redirect
      if (currentPath === '/dashboard/profile' ||
        currentPath === '/dashboard/client-admin' ||
        currentPath === '/dashboard/subscriptions') {
        // Already on role-specific route, no need to redirect
        return;
      }

      // CRITICAL: Check email verification status before routing
      // If email is not verified or status is PENDING, redirect to verification page
      const emailVerified = userProfile?.user?.emailVerified;
      const userStatus = userProfile?.user?.status;

      if (emailVerified === false || userStatus === 'pending') {
        console.log('❌ [DASHBOARD] Email not verified or account pending:', {
          emailVerified,
          userStatus,
          email: userProfile?.user?.email,
        });
        // Redirect to verification holding page
        navigate('/verify-email-sent', {
          replace: true,
          state: {
            email: userProfile?.user?.email || '',
            message: 'Please verify your email address to access your dashboard. Check your inbox for the verification link.',
            requiresVerification: true,
          }
        });
        return;
      }

      // Use role from RoleContext - it handles priority order:
      // 1. Token roles (Entra ID - source of truth when present)
      // 2. Backend userProfile role (database)
      // 3. Email domain check (@cloudsecurityweb.com = SuperAdmin)
      // 4. Default to CLIENT_ADMIN
      // RoleContext already implements this logic, so we just use currentRole
      const roleToUse = currentRole || ROLES.CLIENT_ADMIN;

      // Debug logging
      console.log('🔍 [DASHBOARD] Role detection:', {
        roleToUse,
        currentRole,
        userProfileRole: userProfile?.user?.role,
        userEmail: userProfile?.user?.email || account?.username,
        emailVerified: emailVerified,
        userStatus: userStatus,
        tokenRoles,
        source: tokenRoles?.length > 0 ? 'token' :
          userProfile?.user?.role ? 'profile' :
            'default',
      });

      try {
        // Default landing for all roles is profile page
        let targetRoute = '/dashboard/profile';

        if (roleToUse === ROLES.SUPER_ADMIN) {
          targetRoute = '/dashboard/profile';
        } else if (roleToUse === ROLES.CLIENT_ADMIN) {
          targetRoute = '/dashboard/profile';
        } else if (roleToUse === ROLES.USER_ADMIN) {
          targetRoute = '/dashboard/profile';
        }

        // Avoid redundant navigation if we're already there
        if (currentPath === targetRoute) return;

        // Navigate immediately (replace: true to avoid back button issues)
        console.log('🚀 [DASHBOARD] Redirecting to:', targetRoute, '| Role:', roleToUse);
        navigate(targetRoute, { replace: true });
      } catch (error) {
        console.error('Error navigating to role-specific dashboard:', error);
        navigate('/dashboard/profile', { replace: true });
      }
    }
  }, [isLoading, isAuthReady, isAuthenticated, currentRole, navigate, tokenRoles, userProfile, userOID, isLoadingRole, accessToken, authProvider, account]);

  if (isLoading || !isAuthReady || isLoadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  if (currentPath === '/dashboard/profile' ||
    currentPath === '/dashboard/client-admin' ||
    currentPath === '/dashboard/subscriptions') {
    return null; // Already on role-specific route, let it render
  }

  // This component will redirect immediately, so return null (redirect happens in useEffect)
  // Don't show loader - redirect is instant
  return null;
}

export default Dashboard;

