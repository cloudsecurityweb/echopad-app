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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-400/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <AuthPageHeader />

      <main className="flex items-center justify-center py-12 px-4 relative z-10 min-h-[calc(100vh-4rem)]">
        <section className="w-full max-w-2xl">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl p-8 text-center transition-all duration-500">

            {/* Animated Icon */}
            <div className="mb-6 relative inline-flex items-center justify-center">
              <div className="absolute inset-0 bg-cyan-100 rounded-full animate-ping opacity-25" />
              <div className="relative bg-gradient-to-br from-cyan-50 to-blue-50 p-5 rounded-full border border-cyan-100 shadow-inner">
                <svg className="h-10 w-10 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {emailSent && (
                  <div className="absolute -right-1 -bottom-1 bg-green-500 text-white p-1 rounded-full border-2 border-white shadow-sm">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-4 tracking-tight">
              {emailSent ? 'Verify Your Account' : 'Sending Failed'}
            </h1>

            {/* Simple Structured Text */}
            {emailSent ? (
              <div className="space-y-4 mb-8">
                <p className="text-base text-slate-700 font-medium">
                  Account created successfully.
                </p>

                <div className="text-slate-600">
                  <p className="mb-1 text-sm">We've sent a verification link to:</p>
                  <div className="inline-block px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-900 font-medium font-mono text-sm">
                    {email}
                  </div>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed max-w-sm mx-auto">
                  Please check your inbox and click the link to verify your account.
                  Once verified, you can sign in to access your dashboard.
                </p>
              </div>
            ) : (
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                {message}
              </p>
            )}

            {/* Error Message */}
            {!emailSent && emailError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <div>
                    <h3 className="text-sm font-semibold text-red-800">Delivery Error</h3>
                    <p className="text-sm text-red-600 mt-1">{emailError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer / Actions */}
            <div className="space-y-6 pt-2">
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Link
                  to={`/resend-verification${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="w-full sm:w-auto min-w-[160px] inline-flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5"
                >
                  Resend Email
                </Link>

                {!requiresVerification && (
                  <Link
                    to="/sign-in"
                    className="w-full sm:w-auto min-w-[160px] inline-flex justify-center items-center px-5 py-2.5 border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-200 shadow-sm transition-all duration-200"
                  >
                    Return to Sign In
                  </Link>
                )}
              </div>

              {requiresVerification && (
                <div className="flex items-center justify-center gap-2 text-slate-400 text-sm mt-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Waiting for verification...
                </div>
              )}

              <p className="text-xs text-slate-400 mt-4">
                Didn't receive it? Check your Spam folder or contact support.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-400">
              Need help? <a href="mailto:support@echopad.com" className="text-slate-500 hover:text-slate-700 font-medium transition-colors">Contact Support</a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default VerifyEmailSent;
