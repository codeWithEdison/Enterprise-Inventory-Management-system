// src/hooks/useAppNavigation.ts
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import useAuth from './useAuth';
import { 
  AUTHENTICATED_MENUS, 
  MENU_TYPE,
  // SideNavigationInterface 
} from '../config/navigation';
// import { RoleName } from '../types/api/types';

export const useAppNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();
  const userRole = user?.userRoles?.[0]?.role.name;

  // Filter menus based on user role
  const authorizedMenus = useMemo(() => {
    if (!userRole) return [];

    return AUTHENTICATED_MENUS.filter(menu => {
      // Check main menu access
      const hasAccess = menu.roles === "all" || 
        (Array.isArray(menu.roles) && menu.roles.includes(userRole));

      if (!hasAccess) return false;

      // Filter submenus based on role
      if (menu.subMenus.length > 0) {
        menu.subMenus = menu.subMenus.filter(submenu =>
          submenu.roles === "all" || 
          (Array.isArray(submenu.roles) && submenu.roles.includes(userRole))
        );
      }

      return true;
    });
  }, [userRole]);

  // Get menus by category
  const getMenusByCategory = (type: MENU_TYPE) => 
    authorizedMenus.filter(menu => menu.menu_type === type);

  // Get active menu
  const activeMenu = useMemo(() => {
    return authorizedMenus.find(menu => {
      if (location.pathname === menu.url) return true;
      return menu.subMenus.some(sub => location.pathname === sub.url);
    });
  }, [authorizedMenus, location.pathname]);

  return {
    authorizedMenus,
    activeMenu,
    userRole,
    activityMenus: getMenusByCategory(MENU_TYPE.ACTIVITIES),
    profileMenus: getMenusByCategory(MENU_TYPE.PROFILE),
    adminMenus: getMenusByCategory(MENU_TYPE.ADMIN),
    dashboardMenus: getMenusByCategory(MENU_TYPE.NONE)
  };
};

export default useAppNavigation; 