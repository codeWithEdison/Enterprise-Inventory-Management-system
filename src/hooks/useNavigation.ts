// src/hooks/useNavigation.ts
import { useMemo } from 'react';
import useAuth from './useAuth';
import { AUTHENTICATED_MENUS } from '../config/navigation';
import { RoleName } from '../types/api/types';

const useNavigation = () => {
  const { user } = useAuth();

  const userRoles = useMemo(() => {
    if (!user) return [];
    return user.userRoles.map(role => role.role.name);
  }, [user]);

  const hasAccess = (allowedRoles: RoleName[] | "all") => {
    if (allowedRoles === "all") return true;
    if (!user) return false;
    return userRoles.some(role => allowedRoles.includes(role));
  };

  const authorizedMenus = useMemo(() => {
    return AUTHENTICATED_MENUS.filter(menu => {
      // Check if user has access to main menu
      if (!hasAccess(menu.roles)) return false;

      // Filter submenus based on user roles
      const authorizedSubMenus = menu.subMenus.filter(
        submenu => hasAccess(submenu.roles)
      );

      // Return menu with filtered submenus
      return {
        ...menu,
        subMenus: authorizedSubMenus
      };
    });
  }, [user]);

  const getAuthorizedMenusByType = (menuType: string) => {
    return authorizedMenus.filter(menu => menu.menu_type === menuType);
  };

  return {
    authorizedMenus,
    getAuthorizedMenusByType,
    hasAccess
  };
};

export default useNavigation;

