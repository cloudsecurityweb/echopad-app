import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import AuthPageHeader from '../../components/auth/AuthPageHeader';

function VerifyEmailSent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, isAuthenticated } = useAuth();
  const email = location.state?.email || userProfile?.user?.email || '';
  const message = location.state?.message || 'Please check your email to verify your account.';
  const requiresVerification = location.state?.requiresVerification || false;
  const emailSent = location.state?.emailSent !== false; // Default to true if not specified
  const emailError = location.state?.emailError;

  // If user is authenticated and email is verified, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated && userProfile?.user?.emailVerified && userProfile?.user?.status === 'active') {
      console.log('✅ [VERIFY-EMAIL-SENT] Email verified, redirecting to dashboard');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, userProfile, navigate]);

  return (
    <div className="min-h-screen bg-white">
      <AuthPageHeader />
      <main className="flex items-center justify-center py-4 min-h-[calc(100vh-4rem)]">
      <section className="w-full max-w-md px-4">
        <div className="text-center">
          <div className="mb-4">
            <svg className="h-16 w-16 text-cyan-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {emailSent ? 'Check Your Email' : 'Email Sending Failed'}
          </h1>
          <p className="text-gray-600 mb-2">{message}</p>
          {email && (
            <p className="text-sm text-gray-500 mb-6">
              {emailSent ? (
                <>We sent a verification link to <strong>{email}</strong></>
              ) : (
                <>We were unable to send a verification email to <strong>{email}</strong></>
              )}
            </p>
          )}
          
          {!emailSent && emailError && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Email Error:</strong> {emailError}
              </p>
            </div>
          )}
          
          {emailSent && (
            <p className="text-sm text-gray-600 mb-4">
              Once you verify your email, your account will be activated immediately and you can sign in.
            </p>
          )}
          
          {!emailSent && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-800 mb-2">
                <strong>What to do:</strong>
              </p>
              <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Check your spam/junk folder</li>
                <li>Use the "Resend verification email" button below</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or{' '}
              <Link 
                to={`/resend-verification${email ? `?email=${encodeURIComponent(email)}` : ''}`} 
                className="text-cyan-600 hover:text-cyan-700 font-medium"
              >
                resend verification email
              </Link>
            </p>
            {!requiresVerification && (
              <Link
                to="/sign-in"
                className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
              >
                Go to Sign In
              </Link>
            )}
            {requiresVerification && (
              <p className="text-sm text-gray-500">
                Once you verify your email, you'll be automatically redirected to your dashboard.
              </p>
            )}
          </div>
        </div>
      </section>
      </main>
    </div>
  );
}

export default VerifyEmailSent;
