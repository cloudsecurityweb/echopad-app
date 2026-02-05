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

  // Handle hash navigation from non-home pages
  const handleHashNavigation = (e, hash) => {
    e.preventDefault();
    if (isHomePage) {
      // On home page, just scroll to the section
      const element = document.querySelector(hash);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      // Navigate to home page, then set hash and scroll
      navigate('/');
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        window.history.replaceState(null, '', hash);
        const element = document.querySelector(hash);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  };

  // Handle navigation to pages that should start at top
  const handlePageNavigation = (e, path) => {
    e.preventDefault();
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src={echopadLogo}
                alt="Echopad AI Logo"
                className="w-10 h-10 opacity-90"
              />
              <span className="text-xl font-bold">
                Echopad <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AI</span>
              </span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Healthcare AI platform that reduces provider burnout, cuts costs, and improves patient satisfaction.
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
            <h4 className="text-sm font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={isHomePage ? "#agents" : "/#agents"}
                  onClick={(e) => !isHomePage && handleHashNavigation(e, '#agents')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  Products
                </a>
              </li>
              <li>
                <a
                  href={isHomePage ? "#platform" : "/#platform"}
                  onClick={(e) => !isHomePage && handleHashNavigation(e, '#platform')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  Platform
                </a>
              </li>
              <li>
                <a
                  href={isHomePage ? "#roi" : "/#roi"}
                  onClick={(e) => !isHomePage && handleHashNavigation(e, '#roi')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  ROI Calculator
                </a>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  onClick={(e) => handlePageNavigation(e, '/privacy-policy')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms-of-service" 
                  onClick={(e) => handlePageNavigation(e, '/terms-of-service')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-sm font-semibold mb-4 text-white">Products</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/ai-scribe" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  AI Scribe
                </Link>
              </li>
              <li>
                <Link to="/benchmark" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  Benchmark
                </Link>
              </li>
              <li>
                <Link to="/aperio" className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  Aperio
                </Link>
              </li>
              <li>
                <a
                  href={isHomePage ? "#agents" : "/#agents"}
                  onClick={(e) => !isHomePage && handleHashNavigation(e, '#agents')}
                  className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 transition-all group-hover:w-4"></span>
                  View All Products
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            <strong className="text-gray-400">Disclaimer:</strong> Performance metrics are based on industry estimates and aggregated data. Actual results vary by organization size, specialty, workflows, and EHR system. Metrics are not guarantees. We recommend a personalized consultation to assess your specific use case. Epic, Cerner, Athena, MEDITECH, and all other product and company names mentioned are trademarks or registered trademarks of their respective owners. Echopad AI is not affiliated with, endorsed by, or sponsored by these companies.
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
