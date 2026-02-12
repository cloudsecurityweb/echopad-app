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
        className={`min-h-screen min-h-[100dvh] bg-white pt-16 transition-all duration-300 ${getContentMargin()}`}
      >
        <div className="px-4 py-6 min-h-[calc(100vh-4rem)] flex flex-col">
          <Outlet />
        </div>
      </main>
    </>
  );
}

export default DashboardLayout;
