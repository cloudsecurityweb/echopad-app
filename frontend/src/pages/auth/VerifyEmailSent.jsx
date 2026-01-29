import { Link, useLocation } from 'react-router-dom';

function VerifyEmailSent() {
  const location = useLocation();
  const email = location.state?.email || '';
  const message = location.state?.message || 'Please check your email to verify your account.';

  return (
    <main className="min-h-screen flex items-center justify-center bg-white py-4">
      <section className="w-full max-w-md px-4">
        <div className="text-center">
          <div className="mb-4">
            <svg className="h-16 w-16 text-cyan-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-600 mb-2">{message}</p>
          {email && (
            <p className="text-sm text-gray-500 mb-6">
              We sent a verification link to <strong>{email}</strong>
            </p>
          )}
          <p className="text-sm text-gray-600 mb-4">
            Once you verify your email, your account will be activated immediately and you can sign in.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or{' '}
              <Link to="/resend-verification" className="text-cyan-600 hover:text-cyan-700 font-medium">
                resend verification email
              </Link>
            </p>
            <Link
              to="/sign-in"
              className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
            >
              Go to Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default VerifyEmailSent;
