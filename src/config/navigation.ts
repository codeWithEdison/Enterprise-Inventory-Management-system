/* eslint-disable @typescript-eslint/no-unused-vars */
// src/config/navigation.ts
import { 
  LayoutDashboard, 
  Box, 
  ClipboardList,
  Building2,
  Users,
  History,
  BarChart3,
  UserCircle,
  Bell,
  KeyRound
} from 'lucide-react';
import { RoleName } from '../types/api/types';

export enum MENU_TYPE {
  NONE = "NONE",
  PROFILE = "PROFILE",
  ACTIVITIES = "ACTIVITIES"
}

export interface NavigationInterface {
  title: string;
  url: string;
}

export interface SideNavigationSubmenuInterface {
  title: string;
  url: string;
  label: string;
  roles: RoleName[] | "all";
}

export interface SideNavigationInterface {
  title: string;
  url: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any; // Using Lucide icons
  label: string;
  menu_type: MENU_TYPE;
  roles: RoleName[] | "all";
  subMenus: SideNavigationSubmenuInterface[];
}

// Auth Routes
export const PUBLIC_ROUTES: NavigationInterface[] = [
  {
    title: "Login",
    url: "/auth/login",
  },
  {
    title: "Forgot Password",
    url: "/auth/forgot-password",
  }
];

// Main Navigation
export const AUTHENTICATED_MENUS: SideNavigationInterface[] = [
  // Activities Section
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    label: "Dashboard Overview",
    url: "/dashboard",
    menu_type: MENU_TYPE.ACTIVITIES, 
    roles: "all",
    subMenus: []
  },
  {
    icon: Box,
    title: "Inventory",
    label: "Inventory Management",
    url: "/inventory",
    menu_type: MENU_TYPE.ACTIVITIES,
    roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER],
    subMenus: [
      {
        title: "Stock In",
        label: "Stock Intake",
        url: "/inventory/stock-in",
        roles: [RoleName.STOCK_KEEPER]
      },
      {
        title: "Items List",
        label: "Manage Items",
        url: "/inventory/stock-out", 
        roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER]
      },
      {
        title: "Stock Out",
        label: "Stock Release",
        url: "/inventory/stock-out",
        roles: [RoleName.STOCK_KEEPER]
      }
    ]
  },
  {
    icon: ClipboardList,
    title: "Requests",
    label: "Request Management",
    url: "/requests",
    menu_type: MENU_TYPE.ACTIVITIES,
    roles: "all",
    subMenus: [
      {
        title: "New Request",
        label: "Create New Request",
        url: "/requests/new",
        roles: [RoleName.NURSE, RoleName.HOD]
      },
      {
        title: "My Requests",
        label: "View My Requests",
        url: "/requests/my-requests",
        roles: [RoleName.NURSE, RoleName.HOD]
      },
      {
        title: "Pending Approvals",
        label: "Requests Pending Approval",
        url: "/requests/my-requests",
        roles: [RoleName.HOD, RoleName.ADMIN]
      }
    ]
  },

  // Profile Section
  {
    icon: UserCircle,
    title: "Profile",
    label: "My Profile",
    url: "/profile",
    menu_type: MENU_TYPE.PROFILE,
    roles: "all",
    subMenus: []
  },
  {
    icon: KeyRound,
    title: "Change Password",
    label: "Change Password",
    url: "/change-password",
    menu_type: MENU_TYPE.PROFILE,
    roles: "all",
    subMenus: []
  }
];

// Menu categories
export const getMenuCategories = () => [
  {
    key: MENU_TYPE.ACTIVITIES,
    title: "Activities"
  },
  {
    key: MENU_TYPE.PROFILE,
    title: "Profile"
  }
];

// Helper function to get menus by category
export const getMenusByType = (type: MENU_TYPE) => 
  AUTHENTICATED_MENUS.filter(menu => menu.menu_type === type);

// Helper function to filter menus by role
export const getMenusByRole = (role: RoleName) => 
  AUTHENTICATED_MENUS.filter(menu => 
    menu.roles === "all" || 
    (Array.isArray(menu.roles) && menu.roles.includes(role))
  );

// Helper function to get all activity menus
export const getActivityMenus = () => getMenusByType(MENU_TYPE.ACTIVITIES);

// Helper function to get all profile menus
export const getProfileMenus = () => getMenusByType(MENU_TYPE.PROFILE);

