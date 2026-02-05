import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AuthPageHeader from '../../components/auth/AuthPageHeader';

function AcceptInvitation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, loginWithGoogle, signInEmailPassword, syncUserProfile, googleUser, account, getAccessToken, fetchCurrentUser, setMagicSession } = useAuth();
  const [invitation, setInvitation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authMethod, setAuthMethod] = useState(null); // 'microsoft', 'google', 'email'
  const [emailPasswordForm, setEmailPasswordForm] = useState({
    email: '',
    password: '',
  });
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const validateInvitation = async () => {
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      if (!email || !token) {
        setError('Missing email or token. Please check your invitation link.');
        setIsLoading(false);
        return;
      }

      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
        const response = await fetch(`${API_BASE_URL}/api/invites/validate?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);

        const data = await response.json();

        if (response.ok && data.success) {
          setInvitation(data.data);
          setEmailPasswordForm(prev => ({ ...prev, email: email }));
          
          // If this is a client invite (magic link), auto-accept it
          if (data.data.type === 'client') {
            await acceptMagicInvitation(email, token);
          }
        } else {
          setError(data.message || 'Invalid or expired invitation.');
        }
      } catch (error) {
        console.error('Invitation validation error:', error);
        setError('Failed to validate invitation. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    validateInvitation();
  }, [searchParams]);

  const handleOAuthSignIn = async (provider) => {
    if (!invitation) return;

    setIsSigningIn(true);
    setError(null);

    try {
      let userProfile = null;
      let accountEmail = null;

      if (provider === 'Microsoft') {
        await login('popup');
        // After Microsoft login, sync profile and accept invitation
        try {
          userProfile = await syncUserProfile(false);
          accountEmail = userProfile?.user?.email;
        } catch (syncError) {
          console.warn('Failed to sync profile:', syncError);
          setError('Failed to sync user profile. Please try again.');
          setIsSigningIn(false);
          return;
        }

        // Verify email matches invitation
        const invitationEmail = invitation.email.toLowerCase().trim();
        if (accountEmail && accountEmail.toLowerCase().trim() !== invitationEmail) {
          setError(`Email mismatch. Please sign in with ${invitationEmail}`);
          setIsSigningIn(false);
          return;
        }
        
        // Accept invitation (token should be available after syncUserProfile)
        await acceptInvitation('microsoft', userProfile);
      } else if (provider === 'Google') {
        await loginWithGoogle();
        // Wait for Google user to be available
        setTimeout(async () => {
          try {
            const invitationEmail = invitation.email.toLowerCase().trim();
            const googleEmail = googleUser?.email?.toLowerCase().trim();
            
            if (googleEmail && googleEmail !== invitationEmail) {
              setError(`Email mismatch. Please sign in with ${invitationEmail}`);
              setIsSigningIn(false);
              return;
            }
            
            await acceptInvitation('google', null);
          } catch (error) {
            setError(error.message || 'Failed to accept invitation');
            setIsSigningIn(false);
          }
        }, 1000);
      }
    } catch (error) {
      console.error(`${provider} sign in error:`, error);
      setError(error.message || `Failed to sign in with ${provider}. Please try again.`);
      setIsSigningIn(false);
    }
  };

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    if (!invitation) return;

    setIsSigningIn(true);
    setError(null);

    try {
      // Sign in with email + temporary password (inviteToken marks invite accepted on backend)
      const inviteToken = searchParams.get('token');
      const userProfile = await signInEmailPassword({
        email: emailPasswordForm.email.trim(),
        password: emailPasswordForm.password,
        ...(inviteToken ? { inviteToken } : {}),
      });

      // User was created with temp password at invite time; no need to call acceptInvitation
      const role = userProfile?.user?.role || userProfile?.backendRole;
      if (role === 'user') {
        navigate('/dashboard/user-admin');
      } else if (role === 'clientAdmin') {
        navigate('/dashboard/client-admin');
      } else if (role === 'superAdmin') {
        navigate('/dashboard/super-admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Email/password sign in error:', error);
      setError(error.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const acceptMagicInvitation = async (email, token) => {
    try {
      setIsSigningIn(true);
      setError(null);
      
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      
      const response = await fetch(`${API_BASE_URL}/api/invites/accept-magic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store magic session token
        setMagicSession(data.data.sessionToken);
        
        // Fetch user profile to get role and org info
        try {
          await fetchCurrentUser();
        } catch (fetchError) {
          console.warn('Failed to fetch user profile after magic acceptance:', fetchError);
        }
        
        // Redirect based on role
        const role = data.data.user?.role;
        if (role === 'clientAdmin') {
          navigate('/dashboard/client-admin');
        } else if (role === 'user') {
          navigate('/dashboard/user-admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        throw new Error(data.message || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Magic invitation acceptance error:', error);
      setError(error.message || 'Failed to accept invitation. Please try again.');
      setIsSigningIn(false);
    }
  };

  const acceptInvitation = async (authMethod, userProfile = null) => {
    try {
      const token = searchParams.get('token');
      const email = searchParams.get('email');
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';

      // Get user info based on auth method
      let userId = null;
      let displayName = null;
      let accessToken = null;

      if (authMethod === 'microsoft' && userProfile) {
        userId = userProfile.user?.id || account?.idTokenClaims?.oid;
        displayName = userProfile.user?.displayName || account?.name;
        // Get access token for Microsoft auth
        try {
          accessToken = await getAccessToken();
        } catch (e) {
          console.warn('Could not get access token:', e);
          throw new Error('Failed to get access token. Please sign in again.');
        }
      } else if (authMethod === 'google' && googleUser) {
        displayName = googleUser.name || googleUser.given_name;
        // Google doesn't provide a persistent user ID like Microsoft's oid
        // We'll let the backend generate one
      } else if (authMethod === 'email' && userProfile) {
        userId = userProfile.user?.id;
        displayName = userProfile.user?.displayName;
      }

      // Build headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // For Microsoft auth, add Authorization header with access token (already retrieved above)
      if (authMethod === 'microsoft' && accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/api/invites/accept`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          token,
          email,
          userId,
          displayName,
          authMethod,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh user profile after acceptance to get updated role and org
        try {
          await fetchCurrentUser();
        } catch (fetchError) {
          console.warn('Failed to refresh user profile after invitation acceptance:', fetchError);
        }
        
        // Redirect based on role
        const role = data.data.user?.role || data.data.backendRole;
        if (role === 'user') {
          navigate('/dashboard/user-admin');
        } else if (role === 'clientAdmin') {
          navigate('/dashboard/client-admin');
        } else if (role === 'superAdmin') {
          navigate('/dashboard/super-admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        // Handle specific error messages
        let errorMessage = data.message || 'Failed to accept invitation';
        if (data.error === 'Role required') {
          errorMessage = `UserAdmin role is required. ${data.message || 'Please contact your administrator to assign the UserAdmin role in Microsoft Entra ID.'}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Accept invitation error:', error);
      setError(error.message || 'Failed to accept invitation. Please try again.');
      throw error;
    }
  };

  if (isLoading || isSigningIn) {
    return (
      <div className="min-h-screen bg-white">
        <AuthPageHeader />
        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-cyan-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-gray-600">{isSigningIn ? 'Accepting invitation...' : 'Loading invitation...'}</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-white">
        <AuthPageHeader />
        <main className="flex items-center justify-center py-4 min-h-[calc(100vh-4rem)]">
          <section className="w-full max-w-md px-4">
            <div className="text-center">
              <div className="mb-4">
                <svg className="h-16 w-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Link
                to="/sign-in"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
              >
                Go to Sign In
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AuthPageHeader />
      <main className="flex items-center justify-center py-4 min-h-[calc(100vh-4rem)]">
      <section className="w-full max-w-md px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl text-gray-900 mb-2">
            You've been invited!
          </h1>
          <p className="text-sm text-gray-600">
            Sign in with the temporary password we sent to your email, or use Microsoft or Google.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* OAuth Sign-In Options */}
        <div className="space-y-2 mb-4">
          <button
            type="button"
            onClick={() => handleOAuthSignIn('Microsoft')}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-medium text-sm text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 23 23">
                  <path fill="#F25022" d="M0 0h11v11H0z"/>
                  <path fill="#00A4EF" d="M12 0h11v11H12z"/>
                  <path fill="#7FBA00" d="M0 12h11v11H0z"/>
                  <path fill="#FFB900" d="M12 12h11v11H12z"/>
                </svg>
                Sign in with Microsoft
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn('Google')}
            disabled={isSigningIn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-medium text-sm text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? (
              <>
                <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        {/* Separator */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        {/* Email/Password Sign-In Form */}
        <form onSubmit={handleEmailPasswordSignIn} className="space-y-3">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={emailPasswordForm.email}
              readOnly
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg bg-gray-50"
            />
            <p className="mt-1 text-xs text-gray-500">This email must match your invitation</p>
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
              Temporary password
            </label>
            <input
              type="password"
              id="password"
              value={emailPasswordForm.password}
              onChange={(e) => setEmailPasswordForm(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-cyan-500 focus:ring-cyan-500"
              placeholder="Enter the temporary password from your email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSigningIn}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all text-sm font-medium shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningIn ? 'Signing in...' : 'Sign in & go to dashboard'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-600">
            Use the temporary password from your invitation email. You can change it later in Profile.
          </p>
        </div>
      </section>
      </main>
    </div>
  );
}

export default AcceptInvitation;
