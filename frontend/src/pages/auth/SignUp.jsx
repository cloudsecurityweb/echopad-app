import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function SignUp() {
  const { login, signUp, loginWithGoogle, isAuthenticated, isLoading, syncUserProfile, syncGoogleUserProfile, signUpEmailPassword, authProvider, googleToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    organizationName: '',
    organizerName: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [pendingGoogleSignUp, setPendingGoogleSignUp] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading && !pendingGoogleSignUp) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate, pendingGoogleSignUp]);

  // Complete Google sign-up once auth state is ready
  useEffect(() => {
    if (!pendingGoogleSignUp) return;
    if (authProvider !== 'google' || !googleToken) return;

    const completeGoogleSignUp = async () => {
      try {
        await syncGoogleUserProfile(true);
        navigate('/dashboard');
      } catch (syncError) {
        console.error('Failed to sync Google user profile:', syncError);
        setAuthError(
          syncError.message || 'Failed to complete sign up. Please try again.'
        );
      } finally {
        setIsGoogleLoading(false);
        setPendingGoogleSignUp(false);
      }
    };

    completeGoogleSignUp();
  }, [pendingGoogleSignUp, authProvider, googleToken, syncGoogleUserProfile, navigate]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTermsChange = (e) => {
    setAcceptedTerms(e.target.checked);
    // Clear terms error when checkbox is checked
    if (e.target.checked && errors.termsAccepted) {
      setErrors(prev => ({
        ...prev,
        termsAccepted: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Reset errors
    const newErrors = {};

    // Validate organisation name
    if (!formData.organizationName) {
      newErrors.organizationName = 'Organisation name is required';
    } else if (formData.organizationName.trim().length < 2) {
      newErrors.organizationName = 'Organisation name must be at least 2 characters';
    }

    // Validate organiser name
    if (!formData.organizerName) {
      newErrors.organizerName = 'Organiser name is required';
    } else if (formData.organizerName.trim().length < 2) {
      newErrors.organizerName = 'Organiser name must be at least 2 characters';
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      newErrors.termsAccepted = 'You must accept the Terms and Conditions to sign up';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Handle email/password sign-up
      try {
        const result = await signUpEmailPassword({
          organizationName: formData.organizationName.trim(),
          organizerName: formData.organizerName.trim(),
          email: formData.email.trim(),
          password: formData.password,
        });

        if (result.success) {
          // Show success message and redirect to verification page
          setAuthError(null);
          // Redirect to a success page or show message
          navigate('/verify-email-sent', { 
            state: { 
              email: formData.email,
              message: result.message || 'Account created successfully! Please check your email to verify your account. Once verified, you can sign in immediately.'
            } 
          });
        }
      } catch (error) {
        console.error('Sign up error:', error);
        setAuthError(error.message || 'Failed to create account. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    // Check if terms are accepted
    if (!acceptedTerms) {
      setErrors(prev => ({
        ...prev,
        termsAccepted: 'You must accept the Terms and Conditions to sign up'
      }));
      setAuthError('Please accept the Terms and Conditions to continue.');
      return;
    }

    if (provider === 'Microsoft') {
      setIsMicrosoftLoading(true);
      setAuthError(null);
      try {
        await signUp('popup');
        
        // Profile sync will happen automatically in AuthContext once MSAL is ready
        // No need to sync here - it was causing timing issues and loops
        // Redirect will happen via useEffect when isAuthenticated becomes true
      } catch (error) {
        console.error('Microsoft login error:', error);
        setAuthError(
          error.errorCode === 'user_cancelled' 
            ? 'Sign up was cancelled.' 
            : 'Failed to sign up with Microsoft. Please try again.'
        );
      } finally {
        setIsMicrosoftLoading(false);
      }
    } else if (provider === 'Google') {
      setIsGoogleLoading(true);
      setAuthError(null);
      try {
        await loginWithGoogle();
        setPendingGoogleSignUp(true);
      } catch (error) {
        console.error('Google login error:', error);
        setAuthError(
          error.error === 'popup_closed_by_user' || error.type === 'user_cancelled'
            ? 'Sign up was cancelled.'
            : 'Failed to sign up with Google. Please try again.'
        );
        setPendingGoogleSignUp(false);
      } finally {
        if (!pendingGoogleSignUp) {
          setIsGoogleLoading(false);
        }
      }
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-white py-4">
        <section className="w-full max-w-md px-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-2xl text-gray-900 whitespace-nowrap">
              Sign Up for{' '}
              <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Echopad AI
              </span>
            </h1>
            <p className="mt-1 text-xs text-gray-600">
              Sign up with your Microsoft or Google account
            </p>
          </div>

          {/* Social Sign-up Buttons */}
          <div className="space-y-2 mb-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Microsoft')}
              disabled={isMicrosoftLoading || isGoogleLoading || isLoading || !acceptedTerms}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-medium text-sm text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isMicrosoftLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#F25022" d="M0 0h11v11H0z"/>
                    <path fill="#00A4EF" d="M12 0h11v11H12z"/>
                    <path fill="#7FBA00" d="M0 12h11v11H0z"/>
                    <path fill="#FFB900" d="M12 12h11v11H12z"/>
                  </svg>
                  Sign up with Microsoft
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              disabled={isGoogleLoading || isMicrosoftLoading || isLoading || !acceptedTerms}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all font-medium text-sm text-gray-700 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing up...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Google
                </>
              )}
            </button>
          </div>

          {/* Error Message */}
          {authError && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{authError}</p>
            </div>
          )}

          {/* Separator */}
          <div className="relative mb-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Organisation Name Field */}
            <div>
              <label htmlFor="organizationName" className="block text-xs font-medium text-gray-700 mb-1">
                Organisation Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.organizationName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'
                  }`}
                  placeholder="Organisation Name"
                />
              </div>
              {errors.organizationName && (
                <p className="mt-0.5 text-xs text-red-600">{errors.organizationName}</p>
              )}
            </div>

            {/* Organiser Name Field */}
            <div>
              <label htmlFor="organizerName" className="block text-xs font-medium text-gray-700 mb-1">
                Organiser Name (Head of Department)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="organizerName"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleChange}
                  className={`w-full pl-8 pr-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.organizerName
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'
                  }`}
                  placeholder="Organiser Name"
                />
              </div>
              {errors.organizerName && (
                <p className="mt-0.5 text-xs text-red-600">{errors.organizerName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
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
                  className={`w-full pl-8 pr-3 py-2 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:border-cyan-500 focus:ring-cyan-500'
                  }`}
                  placeholder="Email"
                />
              </div>
              {errors.email && (
                <p className="mt-0.5 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 pr-8 text-sm border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    errors.password
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
                <p className="mt-0.5 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div>
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="termsAccepted"
                  name="termsAccepted"
                  checked={acceptedTerms}
                  onChange={handleTermsChange}
                  className="mt-0.5 h-3 w-3 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                />
                <label htmlFor="termsAccepted" className="ml-2 text-xs text-gray-700">
                  I agree to the{' '}
                  <Link
                    to="/terms-of-service"
                    className="text-cyan-600 hover:text-cyan-700 font-medium underline"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              {errors.termsAccepted && (
                <p className="mt-0.5 text-xs text-red-600">{errors.termsAccepted}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !acceptedTerms}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all text-sm font-medium shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <p className="text-gray-600 text-xs">
              Already have an account?{' '}
              <Link
                to="/sign-in"
                className="text-cyan-600 hover:text-cyan-700 font-medium transition-colors"
              >
                Sign In!
              </Link>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}

export default SignUp;
