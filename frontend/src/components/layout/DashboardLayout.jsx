import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import DashboardSideNav from './DashboardSideNav';
import { useRole } from '../../contexts/RoleContext';

function DashboardLayout() {
  const { isLoadingRole } = useRole();
  const [isSideNavOpen, setIsSideNavOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false); // Default to expanded on desktop
  const [isMobile, setIsMobile] = useState(false);

  const toggleSideNav = () => {
    if (isSideNavOpen) {
      // If sidebar is open, close it (preserve collapsed state for next time)
      setIsSideNavOpen(false);
    } else {
      // If sidebar is closed, open it AND expand it (show icons + labels)
      setIsSideNavOpen(true);
      setIsCollapsed(false);
    }
  };

  const closeSideNav = () => {
    setIsSideNavOpen(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Initialize mobile state based on screen size
  useEffect(() => {
    const handleResize = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);

      if (isMobileView) {
        // On mobile, close when resizing to mobile
        setIsSideNavOpen(false);
      }
    };

    // Set initial mobile state
    const isMobileView = window.innerWidth < 768;
    setIsMobile(isMobileView);
    // Sidebar starts open on desktop, closed on mobile
    if (isMobileView) {
      setIsSideNavOpen(false);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate content margin based on sidebar state
  const getContentMargin = () => {
    if (isMobile) {
      // Mobile: no margin, sidebar pushes content
      return 'ml-0';
    }
    // Desktop: margin based on sidebar open state and collapsed state
    if (!isSideNavOpen) {
      // Sidebar is closed: no margin
      return 'ml-0';
    }
    // Sidebar is open: margin based on collapsed state
    return isCollapsed ? 'md:ml-20' : 'md:ml-72';
  };

  // Wait for role to be reliably determined before rendering layout
  // This prevents flash of wrong dashboard menus (e.g. CLIENT_ADMIN menus shown to SUPER_ADMIN)
  if (isLoadingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-cyan-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar onToggleSidebar={toggleSideNav} />

      {/* Side Navigation */}
      <DashboardSideNav
        isOpen={isSideNavOpen}
        onClose={closeSideNav}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* Main Content */}
      <main
        className={`min-h-screen bg-white pt-16 transition-all duration-300 ${getContentMargin()}`}
      >
        <div className="px-4 py-12">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default DashboardLayout;
