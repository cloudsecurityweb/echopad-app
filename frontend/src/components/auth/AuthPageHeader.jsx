import { Link } from 'react-router-dom';
import echopadLogo from '../../assets/images/logos/echopad-logo.svg';

/**
 * Header for standalone auth pages (verify-email, verify-email-sent, resend-verification, accept-invitation).
 * Matches Navigation branding: logo + "Echopad AI" + Sign In button.
 */
function AuthPageHeader() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold group cursor-pointer"
          >
            <img
              src={echopadLogo}
              alt="Echopad AI Logo"
              className="w-10 h-10 transition-transform group-hover:scale-110"
            />
            <span className="text-gray-900">
              Echopad <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">AI</span>
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default AuthPageHeader;
