import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import usePageTitle from '../../hooks/usePageTitle';
import { DESKTOP_REDIRECT_KEY } from '../../utils/auth';

function isValidRedirectUri(uri) {
  try {
    const url = new URL(uri);
    return url.hostname === 'localhost' && url.protocol === 'http:';
  } catch {
    return false;
  }
}

function LoginComplete() {
  const PageTitle = usePageTitle('Login Complete');
  const navigate = useNavigate();
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem(DESKTOP_REDIRECT_KEY);
    if (!raw) {
      setError('No redirect data found. Please sign in again from the EchoPad app.');
      return;
    }
    try {
      const data = JSON.parse(raw);
      if (!data.redirectUri || !isValidRedirectUri(data.redirectUri)) {
        setError('Invalid redirect. Please sign in again from the EchoPad app.');
        sessionStorage.removeItem(DESKTOP_REDIRECT_KEY);
        return;
      }
      if (data.error) {
        setError(data.error_description || data.error);
        sessionStorage.removeItem(DESKTOP_REDIRECT_KEY);
        return;
      }
      setPayload(data);
    } catch {
      setError('Invalid session. Please sign in again from the EchoPad app.');
      sessionStorage.removeItem(DESKTOP_REDIRECT_KEY);
    }
  }, []);

  const buildCallbackUrl = (data) => {
    const url = new URL(data.redirectUri);
    if (data.token) url.searchParams.set('token', data.token);
    if (data.name) url.searchParams.set('name', data.name);
    if (data.email) url.searchParams.set('email', data.email);
    const displayName = data.display_name ?? data.displayName;
    if (displayName) url.searchParams.set('display_name', displayName);
    return url;
  };

  const doRedirect = () => {
    if (!payload) return;
    sessionStorage.removeItem(DESKTOP_REDIRECT_KEY);
    window.location.href = buildCallbackUrl(payload).toString();
  };

  useEffect(() => {
    if (!payload) return;
    const t = setTimeout(() => {
      sessionStorage.removeItem(DESKTOP_REDIRECT_KEY);
      window.location.href = buildCallbackUrl(payload).toString();
    }, 2000);
    return () => clearTimeout(t);
  }, [payload]);

  return (
    <>
      {PageTitle}
      <Navigation />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-16 md:pt-20 pb-4 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-2 border-blue-100 p-6 md:p-8 text-center">
            {error ? (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                <p className="text-gray-600 text-sm mb-6">{error}</p>
                <button
                  type="button"
                  onClick={() => navigate('/sign-in')}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium"
                >
                  Back to Sign In
                </button>
              </>
            ) : payload ? (
              <>
                <h1 className="text-xl font-bold text-gray-900 mb-2">All set!</h1>
                <p className="text-gray-600 text-sm mb-6">Feel free to return to EchoPad.</p>
                <p className="text-xs text-gray-500 mb-4">
                  For any issues, reach out at{' '}
                  <a href="mailto:hi@echopad.ai" className="text-cyan-600 hover:underline">
                    hi@echopad.ai
                  </a>
                </p>
                <button
                  type="button"
                  onClick={doRedirect}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 font-medium"
                >
                  Return to EchoPad
                </button>
                <p className="text-xs text-gray-400 mt-3">Redirecting automatically in a moment...</p>
              </>
            ) : (
              <p className="text-gray-600">Loading...</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default LoginComplete;
