// src/components/layout/NavItem.tsx
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { NavLink, useLocation } from "react-router-dom";
import { SideNavigationInterface } from "../../config/navigation";
import { cn } from "../../lib/utils";

interface NavItemProps {
  nav: SideNavigationInterface;
  selectedMenuLink: string;
  setSelectedMenu: (link: string) => void;
}

const NavItem: React.FC<NavItemProps> = ({
  nav,
  selectedMenuLink,
  setSelectedMenu,
}) => {
  const location = useLocation();
  const hasSubmenu = nav.subMenus.length > 0;
  const isMainMenuActive = nav.subMenus.some(submenu => location.pathname === submenu.url);

  return (
    <div className="mb-1">
      <div className={cn(
        "relative flex flex-col",
        isMainMenuActive && "bg-gray-50 rounded-md"
      )}>
        <NavLink
          to={hasSubmenu ? '#' : nav.url}
          onClick={(e) => {
            if (hasSubmenu) {
              e.preventDefault();
              setSelectedMenu(selectedMenuLink === nav.url ? "" : nav.url);
            } else {
              setSelectedMenu(nav.url);
            }
          }}
          className={({ isActive }) => cn(
            "flex items-center justify-between px-4 py-2 text-sm rounded-md transition-all",
            "hover:bg-gray-100",
            !hasSubmenu && isActive && "bg-primary-50 text-primary-700 font-medium",
            hasSubmenu && isMainMenuActive && "text-primary-700 font-medium"
          )}
        >
          <div className="flex items-center gap-3">
            <nav.icon className="h-5 w-5" />
            <span>{nav.title}</span>
          </div>
          {hasSubmenu && (
            <div className="text-gray-400">
              {selectedMenuLink === nav.url ? (
                <IoIosArrowUp className="h-4 w-4" />
              ) : (
                <IoIosArrowDown className="h-4 w-4" />
              )}
            </div>
          )}
        </NavLink>

        {/* Submenu */}
        {hasSubmenu && selectedMenuLink === nav.url && (
          <div className="mt-1 ml-3 pl-4 border-l border-gray-200 space-y-1">
            {nav.subMenus.map((subMenu, index) => (
              <NavLink
                key={index}
                to={subMenu.url}
                className={({ isActive }) => cn(
                  "block px-3 py-2 text-sm rounded-md transition-all",
                  "hover:bg-gray-100",
                  isActive 
                    ? "bg-primary-50 text-primary-700 font-medium" 
                    : "text-gray-600"
                )}
              >
                {subMenu.title}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavItem;