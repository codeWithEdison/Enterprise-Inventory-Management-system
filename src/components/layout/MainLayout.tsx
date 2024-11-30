// src/components/layout/MainLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Navbar";
import SideNavBar from "./Sidebar";
import useAuth from "../../hooks/useAuth";
import useAppNavigation from "../../hooks/useNavigation";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Get initial state from localStorage or default to true
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const { user } = useAuth();
  const { authorizedMenus } = useAppNavigation();

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NavBar */}
      <NavBar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Sidebar */}
      <SideNavBar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menus={authorizedMenus}
      />

      {/* Main Content */}
      <main
        className={`
          pt-16 min-h-screen
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'md:pl-64' : 'md:pl-0'}
        `}
      >
        <div className="p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;