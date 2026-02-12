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
    <nav className="fixed top-0 left-0 right-0 z-50 p-4">
      <div className={`container mx-auto px-4 rounded-2xl backdrop-blur-md transition-colors ${isMobileMenuOpen ? 'bg-white' : 'bg-white/95'}`}>
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
              Echopad <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">AI</span>
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
              <a href="/" onClick={(e) => scrollToSection(e, '#agents')} className="relative group text-gray-700 font-semibold">
                Products
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="/" onClick={(e) => scrollToSection(e, '#platform')} className="relative group text-gray-700 font-semibold">
                Platform
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all group-hover:w-full"></span>
              </a>
              <a href="/" onClick={(e) => scrollToSection(e, '#roi')} className="relative group text-gray-700 font-semibold">
                ROI
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 transition-all group-hover:w-full"></span>
              </a>
            </>

            {isAuthenticated && !isLoading ? (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 rounded-lg p-1 transition-all hover:bg-gray-50/50"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="true"
                    aria-label="User menu"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleDropdown();
                      }
                    }}
                  >
                    {userInfo.picture ? (
                      <img src={userInfo.picture} alt={displayName} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="hidden lg:inline text-sm font-semibold">{displayName}</span>
                    <svg className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl py-2 z-50 animate-fade-in-scale shadow-lg border border-gray-200"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {displayName}
                        </p>
                        {userInfo.email && (
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {userInfo.email}
                          </p>
                        )}
                      </div>

                      {/* Dashboard Link */}
                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors flex items-center gap-3 focus:outline-none focus:bg-gray-50/80 focus:ring-2 focus:ring-cyan-500 focus:ring-inset"
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleDashboardClick();
                          }
                        }}
                      >
                        <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        <span>Dashboard</span>
                      </button>

                      {/* Sign Out Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50/80 transition-colors flex items-center gap-3 focus:outline-none focus:bg-gray-50/80 focus:ring-2 focus:ring-cyan-500 focus:ring-inset border-t border-gray-200"
                        role="menuitem"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLogout();
                          }
                        }}
                      >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* ✅ Request Demo (Desktop Auth) */}
                <a
                  href="#"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-sm shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
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
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-semibold text-sm shadow-lg hover:shadow-cyan-500/50 hover:scale-105"
                  onClick={(e) => handleIntercomClick(e, 'request-demo')}
                >
                  Request Demo
                </a>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? 'max-h-[600px] pb-6' : 'max-h-0'}`}>
          <div className="flex flex-col gap-4 pt-6 animate-slide-in-left">
            <>
              <a
                href="/"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 border-b border-gray-200 hover:border-cyan-500"
                onClick={(e) => {
                  scrollToSection(e, '#agents');
                  setIsMobileMenuOpen(false);
                }}
              >
                Products
              </a>
              <a
                href="/"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 border-b border-gray-200 hover:border-cyan-500"
                onClick={(e) => {
                  scrollToSection(e, '#platform');
                  setIsMobileMenuOpen(false);
                }}
              >
                Platform
              </a>
              <a
                href="/"
                className="text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 border-b border-gray-200 hover:border-cyan-500"
                onClick={(e) => {
                  scrollToSection(e, '#roi');
                  setIsMobileMenuOpen(false);
                }}
              >
                ROI
              </a>
            </>
            {isAuthenticated && !isLoading ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 border-b border-gray-200 hover:border-cyan-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {userInfo.picture ? (
                    <img
                      src={userInfo.picture}
                      alt={displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{displayName}</p>
                    <p className="text-sm text-gray-500">{userInfo.email}</p>
                  </div>
                </Link>
                {/* Dashboard Button - Show for all authenticated users */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors font-medium py-2 border-b border-gray-200 hover:border-cyan-500"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium text-center w-full"
                >
                  Sign out
                </button>
                <a
                  href="#"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-center shadow-lg"
                  onClick={(e) => {
                    handleIntercomClick(e, 'request-demo');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Request Demo
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/sign-in"
                  className="border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50 transition-all font-medium text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <a
                  href="#"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-center shadow-lg"
                  onClick={(e) => {
                    handleIntercomClick(e, 'request-demo');
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Request Demo
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
