// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import useNavigation from '../../hooks/useNavigation';
import useAuth from '../../hooks/useAuth';
import {getMenuCategories } from '../../config/navigation';
import { cn } from '../../lib/utils';
import NavItem from './NavItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { authorizedMenus } = useNavigation();
  const [selectedMenu, setSelectedMenu] = useState<string>('');

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out",
        "flex flex-col",
        {
          'translate-x-0': isOpen,
          '-translate-x-full': !isOpen,
          'md:translate-x-0': true
        }
      )}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="UR HG Stock"
            className="h-8 w-auto"
          />
          <span className="font-semibold text-gray-900">UR HG Stock</span>
        </Link>
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-gray-500">{user?.userRoles[0]?.role.name}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {getMenuCategories()
          .filter(category => authorizedMenus.some(menu => menu.menu_type === category.key))
          .map((category, index) => (
            <div key={index} className="mb-4">
              {/* Category Header */}
              {category.title && (
                <h3 className="px-3 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {category.title}
                </h3>
              )}
              
              {/* Category Menu Items */}
              <div className="space-y-1">
                {authorizedMenus
                  .filter(menu => menu.menu_type === category.key)
                  .map((menu, menuIndex) => (
                    <NavItem
                      key={menuIndex}
                      item={menu}
                      isSelected={selectedMenu === menu.url}
                      onSelect={() => setSelectedMenu(selectedMenu === menu.url ? '' : menu.url)}
                    />
                  ))}
              </div>
            </div>
          ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          © {new Date().getFullYear()} UR HG Stock
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;