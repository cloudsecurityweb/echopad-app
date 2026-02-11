import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { handleIntercomAction } from '../../utils/intercom';
import { useAuth } from '../../contexts/AuthContext';
import echopadLogo from '../../assets/images/logos/echopad-logo.svg';

function Navigation() {
  const {
    isAuthenticated,
    account,
    googleUser,
    authProvider,
    userProfile,
    logout,
    isLoading
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  const handleLogout = async () => {
    try {
      setIsDropdownOpen(false);
      await logout('popup');
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDashboardClick = () => {
    setIsDropdownOpen(false);
    navigate('/dashboard');
  };

  const scrollToSection = (e, selector) => {
    e.preventDefault();
    const headerOffset = 64;

    const scroll = () => {
      const element = document.querySelector(selector);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
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

  const handleLogoClick = (e) => {
    e.preventDefault();

    const scrollToHero = () => {
      const element = document.querySelector('#hero');
      if (element) {
        const headerOffset = 64;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isDropdownOpen]);

  const userInfo =
    authProvider === 'google'
      ? {
          name: googleUser?.name,
          email: googleUser?.email,
          picture: googleUser?.picture
        }
      : {
          name: account?.name,
          email: account?.username
        };

  const displayName =
    userProfile?.user?.displayName ||
    userInfo.name ||
    userInfo.email ||
    'User';

  return (
    <nav
      className={`fixed top-3 inset-x-3 z-50 rounded-2xl shadow-xl shadow-blue-100 opacity-90 border border-white/20 transition-colors ${
        isMobileMenuOpen ? 'bg-white' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-2 text-xl font-bold group cursor-pointer"
          >
            <img
              src={echopadLogo}
              alt="Echopad AI Logo"
              className="w-10 h-10 transition-transform group-hover:scale-110"
            />
            <span className="text-gray-900">
              Echopad <span className="text-blue-700">AI</span>
            </span>
          </a>

          <div className="flex items-center gap-2">

            {/* Mobile Toggle */}
            <button
              className="md:hidden flex flex-col gap-1 p-2"
              onClick={toggleMobileMenu}
            >
              <span className={`block w-5 h-0.5 bg-gray-900 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-900 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-900 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <>
              <a href="/" onClick={(e) => scrollToSection(e, '#agents')} className="text-gray-700 font-semibold">
                Products
              </a>
              <a href="/" onClick={(e) => scrollToSection(e, '#platform')} className="text-gray-700 font-semibold">
                Platform
              </a>
              <a href="/" onClick={(e) => scrollToSection(e, '#roi')} className="text-gray-700 font-semibold">
                ROI
              </a>
            </>

            {isAuthenticated && !isLoading ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={toggleDropdown} className="flex items-center gap-2">
                    {userInfo.picture ? (
                      <img src={userInfo.picture} alt={displayName} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden lg:inline text-sm font-semibold">{displayName}</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 glass-card rounded-xl py-2">
                      <button onClick={handleDashboardClick} className="w-full text-left px-4 py-3 text-sm">
                        Dashboard
                      </button>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm">
                        Sign out
                      </button>
                    </div>
                  )}
                </div>

                {/* ✅ Request Demo (Desktop Auth) */}
                <a
                  href="#"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  Request Demo
                </a>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-lg">
                  Sign in
                </Link>

                {/* ✅ Request Demo (Desktop Guest) */}
                <a
                  href="#"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  Request Demo
                </a>
              </>
            )}
          </div>
        </div>

        {/* ✅ Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ${isMobileMenuOpen ? 'max-h-[600px] pb-6' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 pt-6">

            <a href="/" onClick={(e) => scrollToSection(e, '#agents')} className="text-gray-700">
              Products
            </a>
            <a href="/" onClick={(e) => scrollToSection(e, '#platform')} className="text-gray-700">
              Platform
            </a>
            <a href="/" onClick={(e) => scrollToSection(e, '#roi')} className="text-gray-700">
              ROI
            </a>

            {/* ✅ Request Demo (Mobile) */}
            <a
              href="#"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg text-center"
              onClick={(e) => {
                handleIntercomClick(e, 'request-demo');
                setIsMobileMenuOpen(false);
              }}
            >
              Request Demo
            </a>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
