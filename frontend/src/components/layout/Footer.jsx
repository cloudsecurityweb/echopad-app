import { Link, useLocation, useNavigate } from 'react-router-dom';
import { handleIntercomAction } from '../../utils/intercom';
import echopadLogo from '../../assets/images/logos/echopad-logo.svg';

function Footer() {
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  // Scroll to hero section (same behavior as navbar logo)
  const handleLogoClick = (e) => {
    e.preventDefault();

    const scrollToHero = () => {
      const element = document.querySelector('#hero');
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    };

    if (isHomePage) {
      scrollToHero();
    } else {
      navigate('/');
      setTimeout(scrollToHero, 100);
    }
  };

  // Handle section navigation with smooth scroll
  const handleSectionNavigation = (e, selector) => {
    e.preventDefault();
    const headerOffset = 80;

    const scroll = () => {
      const element = document.querySelector(selector);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    };

    if (isHomePage) {
      scroll();
    } else {
      navigate('/');
      setTimeout(scroll, 100);
    }
  };

  // Handle page navigation
  const handlePageNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2 mb-4 cursor-pointer group"
            >
              <img
                src={echopadLogo}
                alt="Echopad AI Logo"
                className="w-10 h-10 opacity-90 transition-transform group-hover:scale-110"
              />
              <span className="text-xl font-bold">
                Echopad{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  AI
                </span>
              </span>
            </a>

            <p className="text-gray-400 mb-4 leading-relaxed">
              Reduce burnout, cut admin, and get notes done before the patient leaves.
            </p>

            <p className="text-sm text-gray-500">
              Part of{' '}
              <a
                href="https://cloudsecurityweb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Cloud Security Web LLC
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="/"
                  onClick={(e) =>
                    handleSectionNavigation(e, '#platform')
                  }
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  Platform
                </a>
              </li>
              <li>
                <Link
                  to="/privacy-policy"
                  onClick={(e) =>
                    handlePageNavigation(e, '/privacy-policy')
                  }
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  onClick={(e) =>
                    handlePageNavigation(e, '/terms-of-service')
                  }
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">
              Products
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/ai-scribe"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  AI Scribe
                </Link>
              </li>
              <li>
                <Link
                  to="/echopad-insights"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  to="/aperio"
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  Aperio
                </Link>
              </li>
              <li>
                <a
                  href="/"
                  onClick={(e) =>
                    handleSectionNavigation(e, '#agents')
                  }
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4" />
                  View All Products
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            <strong className="text-gray-400">Disclaimer:</strong> Performance
            metrics are based on industry estimates and aggregated data. Actual
            results vary by organization size, specialty, workflows, and EHR
            system. Metrics are not guarantees.
          </p>
          <p className="text-xs text-gray-500 text-center">
            &copy; 2026 Echopad AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
