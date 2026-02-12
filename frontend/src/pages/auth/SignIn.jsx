import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRole, ROLES } from '../../contexts/RoleContext';
import ElectronSignInModal from '../../components/auth/ElectronSignInModal';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import usePageTitle from '../../hooks/usePageTitle';

// Security validation function
function isValidRedirectUri(uri) {
  try {
    const url = new URL(uri);
    // Only allow localhost with http protocol
    return url.hostname === 'localhost' && url.protocol === 'http:';
  } catch {
    return false;
  }
}

function SignIn() {
  const PageTitle = usePageTitle('Sign In');
  const { login, loginWithGoogle, isAuthenticated, isLoading, account, getAccessToken, googleUser, syncUserProfile, syncGoogleUserProfile, clearGoogleAuth, signInEmailPassword } = useAuth();
  const { currentRole, isLoadingRole } = useRole();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showElectronPrompt, setShowElectronPrompt] = useState(false);
  const [redirectUri, setRedirectUri] = useState(null);

  // Handle Electron redirect
  const handleElectronRedirect = useCallback(async () => {
    if (!redirectUri) return;

    try {
      // Get access token
      const token = await getAccessToken();

      // Get user info
      let userName = 'User';
      let userEmail = '';

      if (account) {
        // Microsoft account
        userName = account.name || account.username || 'User';
        userEmail = account.username || '';
      } else if (googleUser) {
        // Google user
        userName = googleUser.name || googleUser.given_name || 'User';
        userEmail = googleUser.email || '';
      } else {
        // Try to get from sessionStorage for Google user info
        const googleUserStr = sessionStorage.getItem('google_user');
        if (googleUserStr) {
          try {
            const storedGoogleUser = JSON.parse(googleUserStr);
            userName = storedGoogleUser.name || storedGoogleUser.given_name || 'User';
            userEmail = storedGoogleUser.email || '';
          } catch (error) {
            console.warn('Failed to parse stored Google user:', error);
          }
        }
      }

      // Build redirect URL with auth data
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('token', token);
      callbackUrl.searchParams.set('name', userName);
      callbackUrl.searchParams.set('email', userEmail);

      console.log('[Electron Auth] Redirecting to:', callbackUrl.toString());

      // Redirect to Electron app
      window.location.href = callbackUrl.toString();
    } catch (error) {
      console.error('[Electron Auth] Failed to redirect:', error);

      // Redirect with error
      const callbackUrl = new URL(redirectUri);
      callbackUrl.searchParams.set('error', 'token_retrieval_failed');
      callbackUrl.searchParams.set('error_description', error.message || 'Failed to retrieve access token');
      window.location.href = callbackUrl.toString();
    }
  }, [redirectUri, getAccessToken, account, googleUser]);

  // Check for redirect_uri parameter (Electron app initiated)
  useEffect(() => {
    const uri = searchParams.get('redirect_uri');

    if (uri) {
      // Validate that it's a localhost URL (security check)
      if (!isValidRedirectUri(uri)) {
        console.error('Invalid redirect_uri: must be http://localhost');
        return;
      }

      setRedirectUri(uri);

      // If user is already authenticated, show confirmation prompt
      if (isAuthenticated && !isLoading) {
        setShowElectronPrompt(true);
      }
      // If not authenticated, proceed with normal OAuth flow
      // After OAuth success, we'll redirect (handled in auth success callback)
    }
  }, [searchParams, isAuthenticated, isLoading]);

  // Handle successful authentication - check if we need to redirect to Electron
  useEffect(() => {
    if (redirectUri && isAuthenticated && !showElectronPrompt && !isLoading) {
      // User just authenticated, redirect to Electron
      handleElectronRedirect();
    }
  }, [redirectUri, isAuthenticated, showElectronPrompt, isLoading, handleElectronRedirect]);

  // Redirect if already authenticated (only if no redirect_uri)
  // Let Dashboard component handle role-based routing to avoid conflicts
  useEffect(() => {
    if (isAuthenticated && !isLoading && !redirectUri && !isLoadingRole) {
      if (currentRole === ROLES.CLIENT_ADMIN || currentRole === ROLES.USER_ADMIN) {
        navigate('/');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectUri, isLoadingRole, currentRole]);

  // RFC 5322 inspired email validation - robust but not overly strict
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email.trim());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation: clear error when input becomes valid
    if (errors[name]) {
      if (name === 'email') {
        // Clear email error if value is now valid
        if (value.trim() && validateEmail(value)) {
          setErrors(prev => ({ ...prev, email: '' }));
        }
      } else if (name === 'password') {
        // Clear password error if value meets requirements
        if (value.length >= 6) {
          setErrors(prev => ({ ...prev, password: '' }));
        }
      } else {
        // Default: clear on any input
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  // Validate on blur for immediate feedback
  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'email' && value.trim()) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Enter a valid email address' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Reset errors
    const newErrors = {};

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle email/password sign-in
      try {
        const userProfile = await signInEmailPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

        if (userProfile) {
          // Redirect handled by useEffect based on role
          // navigate('/dashboard'); 
        }
      } catch (error) {
        console.error('Sign in error:', error);
        // Check if error is about email verification
        const errorMessage = error.message || 'Failed to sign in. Please check your credentials and try again.';
        if (errorMessage.toLowerCase().includes('email not verified') || errorMessage.toLowerCase().includes('verification')) {
          // Redirect to verification page with email
          navigate('/verify-email-sent', {
            state: {
              email: formData.email,
              message: errorMessage,
              requiresVerification: true,
            }
          });
          return;
        }
        setAuthError(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleElectronConfirm = () => {
    setShowElectronPrompt(false);
    handleElectronRedirect();
  };

  const handleElectronCancel = () => {
    setShowElectronPrompt(false);
    setRedirectUri(null);
    // Remove redirect_uri from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('redirect_uri');
    const newUrl = newSearchParams.toString()
      ? `${window.location.pathname}?${newSearchParams.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, '', newUrl);
  };

  const handleSocialLogin = async (provider) => {
    if (provider === 'Microsoft') {
      setIsMicrosoftLoading(true);
      setAuthError(null);
      try {
        await login('popup');

        // Profile sync will happen automatically in AuthContext once MSAL is ready
        // No need to sync here - it was causing timing issues and loops
        // Redirect will happen via useEffect when isAuthenticated becomes true
        // If email verification is required, Dashboard component will handle redirect
      } catch (error) {
        console.error('Microsoft login error:', error);
        // Check if error is about email verification
        if (error.requiresVerification) {
          navigate('/verify-email-sent', {
            state: {
              email: error.email || '',
              message: error.message || 'Please verify your email address to access your dashboard.',
              requiresVerification: true,
            }
          });
          return;
        }
        setAuthError(
          error.errorCode === 'user_cancelled'
            ? 'Sign in was cancelled.'
            : 'Failed to sign in with Microsoft. Please try again.'
        );
      } finally {
        setIsMicrosoftLoading(false);
      }
    } else if (provider === 'Google') {
      setIsGoogleLoading(true);
      setAuthError(null);
      try {
        await loginWithGoogle();
        // Yield so AuthContext state (googleToken, authProvider) is updated before sync
        await new Promise((r) => setTimeout(r, 0));
        await syncGoogleUserProfile(false);
        // Sync successful; redirect will happen via useEffect when isAuthenticated and userProfile are set
      } catch (error) {
        console.error('Google login error:', error);
        if (error?.code === 'USER_NOT_REGISTERED' || (error?.message && error.message.toLowerCase().includes('sign up first'))) {
          clearGoogleAuth();
          setAuthError('Account not found. Please sign up first to create your account.');
          return;
        }
        if (error.requiresVerification) {
          navigate('/verify-email-sent', {
            state: {
              email: error.email || '',
              message: error.message || 'Please verify your email address to access your dashboard.',
              requiresVerification: true,
            }
          });
          return;
        }
        setAuthError(
          error.error === 'popup_closed_by_user' || error.type === 'user_cancelled'
            ? 'Sign in was cancelled.'
            : 'Failed to sign in with Google. Please try again.'
        );
      } finally {
        setIsGoogleLoading(false);
      }
    } else {
      alert(`${provider} sign in is not yet implemented.`);
    }
  };

  return (
    <>
      {PageTitle}
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-16 md:pt-20 pb-4 overflow-hidden">
        <div className="container mx-auto px-4 py-6 md:py-8 flex items-center min-h-[calc(100vh-4rem)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto items-center w-full">
            {/* Left Side - CTA */}
            <div className="space-y-2 md:space-y-3">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Welcome to{' '}
                  <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Echopad AI
                  </span>
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-2 md:mb-3">
                  Transform your healthcare practice with AI-powered automation
                </p>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-lightning-charge-fill text-white text-base md:text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Reduce Costs by 60%</h3>
                    <p className="text-xs md:text-sm text-gray-600">Cut administrative overhead dramatically with AI automation</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-graph-up-arrow text-white text-base md:text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Increase Revenue by 20%</h3>
                    <p className="text-xs md:text-sm text-gray-600">Recover billable time and reduce no-shows</p>
                  </div>
                </div>

                <div className="flex items-start gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="bi bi-people-fill text-white text-base md:text-lg"></i>
                  </div>
                  <div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Improve Retention by 40%</h3>
                    <p className="text-xs md:text-sm text-gray-600">Reduce provider and staff burnout</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3 md:p-4 lg:p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <i className="bi bi-shield-check text-white text-lg md:text-xl"></i>
                    <p className="text-white font-semibold text-sm md:text-base">
                      Secure & Compliant
                    </p>
                  </div>
                  <p className="text-blue-100 text-xs md:text-sm">
                    HIPAA-compliant platform with enterprise-grade security. Your data is encrypted and protected.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  <div className="bg-white rounded-lg p-2 md:p-3 text-center border-2 border-blue-100 shadow">
                    <i className="bi bi-clock-history text-blue-600 text-lg md:text-xl mb-1 block"></i>
                    <p className="text-xs font-semibold text-gray-900">Save 70%</p>
                    <p className="text-xs text-gray-600">Time on Charts</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 md:p-3 text-center border-2 border-green-100 shadow">
                    <i className="bi bi-cash-stack text-green-600 text-lg md:text-xl mb-1 block"></i>
                    <p className="text-xs font-semibold text-gray-900">$200K+</p>
                    <p className="text-xs text-gray-600">Annual Savings</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 md:p-3 text-center border-2 border-purple-100 shadow">
                    <i className="bi bi-emoji-smile text-purple-600 text-lg md:text-xl mb-1 block"></i>
                    <p className="text-xs font-semibold text-gray-900">95%</p>
                    <p className="text-xs text-gray-600">Satisfaction</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-4 md:p-5 lg:p-6">
              <div className="text-center mb-3">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Sign In</h2>
                <p className="text-gray-600 text-sm md:text-base">Access your dashboard</p>
              </div>

              {/* Social Sign-in Buttons */}
              <div className="space-y-2 mb-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  disabled={isMicrosoftLoading || isGoogleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-medium text-sm md:text-base text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isMicrosoftLoading ? (
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
                        <path fill="#F25022" d="M0 0h11v11H0z" />
                        <path fill="#00A4EF" d="M12 0h11v11H12z" />
                        <path fill="#7FBA00" d="M0 12h11v11H0z" />
                        <path fill="#FFB900" d="M12 12h11v11H12z" />
                      </svg>
                      Sign in with Microsoft
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isGoogleLoading || isMicrosoftLoading || isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-medium text-sm md:text-base text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isGoogleLoading ? (
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
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-xs md:text-sm text-red-600">{authError}</p>
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    Don&apos;t have an account? <Link to="/sign-up" className="text-blue-600 hover:underline font-medium">Sign up</Link>
                  </p>
                </div>
              )}

              {/* Separator */}
              <div className="relative mb-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} noValidate className="space-y-2.5 md:space-y-3">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full pl-8 pr-3 py-2.5 md:py-3 text-sm md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'
                        }`}
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-0.5 text-xs md:text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-3 py-2.5 md:py-3 pr-8 text-sm md:text-base border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.password
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'
                        }`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-2 flex items-center"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-0.5 text-xs md:text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs md:text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 md:py-3 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all text-sm md:text-base font-medium shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Signing In...' : 'Login'}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-4 md:mt-6 text-center">
                <p className="text-gray-600 text-sm md:text-base">
                  Don't have an account?{' '}
                  <Link
                    to="/sign-up"
                    className="text-cyan-600 hover:text-cyan-700 font-semibold transition-colors"
                  >
                    Sign Up!
                  </Link>
                </p>
              </div>

              {/* Additional Info */}
              <div className="mt-3 md:mt-4 text-center">
                <p className="text-gray-600 text-xs md:text-sm">
                  By signing in, you agree to our{' '}
                  <Link to="/terms-of-service" className="text-cyan-600 hover:text-cyan-700">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy-policy" className="text-cyan-600 hover:text-cyan-700">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer - Only show on large screens */}
      <div className="hidden xl:block">
        <Footer />
      </div>

      {/* Electron Sign-In Confirmation Modal */}
      {showElectronPrompt && (
        <ElectronSignInModal
          user={account || (() => {
            const googleUserStr = sessionStorage.getItem('google_user');
            return googleUserStr ? JSON.parse(googleUserStr) : googleUser;
          })()}
          onConfirm={handleElectronConfirm}
          onCancel={handleElectronCancel}
        />
      )}
    </>
  );
}

export default SignIn;
