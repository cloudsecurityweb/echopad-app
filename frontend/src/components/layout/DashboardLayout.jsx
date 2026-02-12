import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from './DashboardNavbar';
import DashboardSideNav from './DashboardSideNav';

function DashboardLayout() {
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

  // Content margin = sidebar left margin (left-4) + sidebar width, minimal gap
  const getContentMargin = () => {
    if (isMobile) {
      return 'ml-0';
    }
    if (!isSideNavOpen) {
      return 'ml-0';
    }
    return isCollapsed ? 'md:ml-24' : 'md:ml-[19rem]'; // right after sidebar (1rem + w-20 or w-72)
  };

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

      {/* Main Content - pt matches navbar height (p-4 + h-16 + p-4) */}
      <main
        className={`min-h-screen min-h-[100dvh] bg-white pt-24 transition-all duration-300 ${getContentMargin()}`}
      >
        <div className="px-4 py-6 min-h-[calc(100vh-6rem)] flex flex-col">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default DashboardLayout;
