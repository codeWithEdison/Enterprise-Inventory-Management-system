/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/layout/SideNavBar.tsx
import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { useLocation } from "react-router-dom";
import NavItem from "./NavItem";
import useAppNavigation from "../../hooks/useNavigation";
import { cn } from "../../lib/utils";
import { SideNavigationInterface } from "../../config/navigation";

interface SideNavBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  menus: SideNavigationInterface[];
}

const SideNavBar: React.FC<SideNavBarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  menus
}) => {
  const [selectedMenuLink, setSelectedMenuLink] = useState("");
  const { activityMenus, profileMenus, adminMenus, dashboardMenus } = useAppNavigation();
  const location = useLocation();

  // Reset selected menu when route changes
  useEffect(() => {
    const currentMenu = [...activityMenus, ...profileMenus, ...adminMenus].find(menu => 
      menu.url === location.pathname || 
      menu.subMenus.some((sub: { url: string; }) => sub.url === location.pathname)
    );
    if (currentMenu) {
      setSelectedMenuLink(currentMenu.url);
    }
  }, [location.pathname, activityMenus, profileMenus, adminMenus]);

  return (
    <aside
      className={cn(
        "fixed top-16 bottom-0 left-0 w-64 bg-white z-40",
        "transform transition-transform duration-300 ease-in-out",
        "border-r border-gray-200",
        "flex flex-col",
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'md:transform-none' // Prevent transform on desktop
      )}
    >
      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <MdClose className="h-6 w-6 text-gray-500" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4">

      {dashboardMenus.length > 0 && (
          <div className="mt-8 space-y-1 mb-2">
            <div className="px-3 mb-2">
             
            </div>
            {dashboardMenus.map((menu, index) => (
              <NavItem
                key={index}
                nav={menu}
                selectedMenuLink={selectedMenuLink}
                setSelectedMenu={(link) => setSelectedMenuLink(link)}
                openSubmenuByDefault
              />
            ))}
          </div>
        )}
         {/* Profile Section */}
         {profileMenus.length > 0 && (
          <div className="mt-8 space-y-1">
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Profile
              </h2>
            </div>
            {profileMenus.map((menu, index) => (
              <NavItem
                key={index}
                nav={menu}
                selectedMenuLink={selectedMenuLink}
                setSelectedMenu={(link) => setSelectedMenuLink(link)}
                openSubmenuByDefault
              />
            ))}
          </div>
        )}
        
        {/* Activities Section */}
        {activityMenus.length > 0 && (
          <div className="space-y-1">
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Activities
              </h2>
            </div>
            {activityMenus.map((menu, index) => (
              <NavItem
                key={index}
                nav={menu}
                selectedMenuLink={selectedMenuLink}
                setSelectedMenu={(link) => setSelectedMenuLink(link)}
                openSubmenuByDefault
              />
            ))}
          </div>
        )}

       

        {/* Administration Section */}
        {adminMenus.length > 0 && (
          <div className="mt-8 space-y-1">
            <div className="px-3 mb-2">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Administration
              </h2>
            </div>
            {adminMenus.map((menu: SideNavigationInterface, index: React.Key | null | undefined) => (
              <NavItem
                key={index}
                nav={menu}
                selectedMenuLink={selectedMenuLink}
                setSelectedMenu={(link) => setSelectedMenuLink(link)}
                openSubmenuByDefault
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default SideNavBar;