import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../contexts/RoleContext';
import echopadLogo from '../../assets/images/logos/echopad-logo.svg';

function DashboardNavbar({ onToggleSidebar }) {
  const { account, googleUser, authProvider, logout, isLoading, isAuthenticated, tokenRoles, userProfile } = useAuth();
  const { currentRole, isSuperAdmin, isClientAdmin, isUserAdmin } = useRole();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get role label for display
  const getRoleLabel = () => {
    if (isSuperAdmin) return 'Super Admin';
    if (isClientAdmin) return 'Client Admin';
    if (isUserAdmin) return 'User';
    return 'User';
  };
  
  const getRoleColor = () => {
    if (isSuperAdmin) return 'bg-purple-100 text-purple-700';
    if (isClientAdmin) return 'bg-blue-100 text-blue-700';
    return 'bg-cyan-100 text-cyan-700';
  };

  const handleLogout = async () => {
    try {
      await logout('popup');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handle logo click - navigate to home and scroll to hero section
  const handleLogoClick = (e) => {
    e.preventDefault();
    const isHomePage = location.pathname === '/';
    
    if (isHomePage) {
      // On home page, just scroll to the hero section
      const element = document.querySelector('#hero');
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
      // Navigate to home page, then scroll to hero section
      navigate('/');
      // Use setTimeout to ensure navigation completes before scrolling
      setTimeout(() => {
        const element = document.querySelector('#hero');
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

  // Get user info based on provider and backend profile
  // Priority: Backend profile > Auth provider info
  const userInfo = {
    name: userProfile?.user?.displayName || 
          (authProvider === 'google' ? googleUser?.name : account?.name) || 
          'User',
    email: userProfile?.user?.email || 
           (authProvider === 'google' ? googleUser?.email : account?.username) || 
           '',
    picture: authProvider === 'google' ? googleUser?.picture : null,
    organizationName: userProfile?.organization?.name || null,
  };

  // Determine what to display in navbar
  // For ClientAdmin: Show organization name if available, otherwise user displayName
  // For others: Show user displayName
  const displayName = isClientAdmin && userInfo.organizationName 
    ? userInfo.organizationName 
    : userInfo.name;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-md">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Matrix Icon + Brand Name */}
          <div className="flex items-center gap-4">
            {/* Matrix Icon Button */}
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>

            {/* Brand Name */}
            <a 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-2 cursor-pointer"
            >
              <img 
                src={echopadLogo} 
                alt="Echopad AI Logo" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-gray-900">
                Echopad <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">AI</span>
              </span>
            </a>
          </div>

          {/* Right Section: Desktop - User Profile + Name + Sign Out */}
          {!isLoading && (
            <>
              {/* Desktop View */}
              <div className="hidden md:flex items-center gap-4">
                {/* User Profile Picture */}
                {userInfo.picture ? (
                  <img 
                    src={userInfo.picture} 
                    alt={userInfo.name || 'User'} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200">
                    {(userInfo.name || userInfo.email || 'U').charAt(0).toUpperCase()}
                  </div>
                )}

                {/* User/Organization Name */}
                <span className="text-gray-700 font-medium">
                  {displayName || userInfo.email || 'User'}
                </span>

                {/* Role Badge */}
                {isAuthenticated && (
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor()}`}>
                    {getRoleLabel()}
                  </span>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm"
                >
                  Sign Out
                </button>
              </div>

              {/* Mobile View - Burger Menu */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={isMobileMenuOpen 
                        ? "M6 18L18 6M6 6l12 12" 
                        : "M4 6h16M4 12h16M4 18h16"
                      }
                    />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {!isLoading && isMobileMenuOpen && (
            <div className="border-t border-gray-200 bg-white">
              <div className="px-4 py-4 space-y-4">
              {/* Profile Section */}
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                    {/* User Profile Picture */}
                    {userInfo.picture ? (
                      <img 
                        src={userInfo.picture} 
                        alt={userInfo.name || 'User'} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold border-2 border-gray-200">
                        {(userInfo.name || userInfo.email || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{displayName || 'User'}</p>
                      {isClientAdmin && userInfo.organizationName && (
                        <p className="text-xs text-gray-500">{userInfo.name}</p>
                      )}
                      <p className="text-sm text-gray-600">{userInfo.email}</p>
                      {isAuthenticated && (
                        <p className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full font-semibold ${getRoleColor()}`}>
                          {getRoleLabel()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Sign Out Button */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-center"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/sign-in"
                    className="block w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </div>
              )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;



