// src/components/layout/NavItem.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SideNavigationInterface } from '../../config/navigation';

interface NavItemProps {
  item: SideNavigationInterface;
  isSelected: boolean;
  onSelect: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, isSelected, onSelect }) => {
  const hasSubMenus = item.subMenus.length > 0;

  const baseClasses = cn(
    "group flex items-center w-full px-3 py-2 text-sm",
    "rounded-md transition-colors duration-150",
    "hover:bg-gray-100 hover:text-gray-900"
  );

  const activeClasses = cn(
    "bg-primary-50 text-primary-900 font-medium",
    "hover:bg-primary-100"
  );

  const inactiveClasses = cn(
    "text-gray-700",
    "hover:text-gray-900"
  );

  const IconComponent = item.icon;

  return (
    <div className="relative">
      <NavLink
        to={hasSubMenus ? '#' : item.url}
        onClick={(e) => {
          if (hasSubMenus) {
            e.preventDefault();
            onSelect();
          }
        }}
        className={({ isActive }) =>
          cn(
            baseClasses,
            isActive && !hasSubMenus ? activeClasses : inactiveClasses
          )
        }
      >
        {({ isActive }) => (
          <>
            <div className="flex items-center flex-1">
              <IconComponent 
                className={cn(
                  "h-5 w-5 mr-3",
                  isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              <span>{item.label}</span>
            </div>
            {hasSubMenus && (
              <div className="ml-auto">
                {isSelected ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </div>
            )}
          </>
        )}
      </NavLink>

      {/* Submenu */}
      {hasSubMenus && isSelected && (
        <div className="mt-1 ml-6 pl-3 border-l border-gray-200 space-y-1">
          {item.subMenus.map((submenu, index) => (
            <NavLink
              key={index}
              to={submenu.url}
              className={({ isActive }) =>
                cn(
                  "block py-2 px-3 text-sm rounded-md transition-colors duration-150",
                  isActive
                    ? "text-primary-900 bg-primary-50 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )
              }
            >
              {submenu.title}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavItem;