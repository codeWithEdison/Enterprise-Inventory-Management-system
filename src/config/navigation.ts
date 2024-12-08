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
import { RoleName } from '@/types/api/types';

export enum MENU_TYPE {
  NONE = "NONE",
  PROFILE = "PROFILE",
  ACTIVITIES = "ACTIVITIES",
  ADMIN = "ADMIN"
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
  },
  {
    title: "Reset Password",
    url: "/auth/reset-password",
  },
  {
    title: "Verify Email",
    url: "/auth/verify-email",
  }
];

// Main Navigation
export const AUTHENTICATED_MENUS: SideNavigationInterface[] = [
  // Activities Section
  {
    icon: LayoutDashboard,
    title: "Dashboard",
    label: "Dashboard Overview",
    url: "/",
    menu_type: MENU_TYPE.NONE,  
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
        title: "Items List",
        label: "Manage Items",
        url: "/inventory/items", 
        roles: [RoleName.ADMIN]
      },
      {
        title: "Stock",
        label: "Manage Items",
        url: "/inventory", 
        roles: [RoleName.STOCK_KEEPER]
      },
      {
        title: "Stock In",
        label: "Stock Intake",
        url: "/inventory/stock-in",
        roles: [RoleName.STOCK_KEEPER]
      },
      {
        title: "Stock Out",
        label: "Stock Release",
        url: "/inventory/stock-out",
        roles: [RoleName.STOCK_KEEPER]
      },
      {
        title: "Stock Transfer",
        label: "Stock Transfers",
        url: "/inventory/transfer",
        roles: [RoleName.STOCK_KEEPER]
      },
      // {
      //   title: "Stock Adjustments",
      //   label: "Manage Stock Adjustments",
      //   url: "/inventory/adjustments",
      //   roles: [RoleName.STOCK_KEEPER]
      // }
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
        url: "/requests/approve",
        roles: [RoleName.HOD, RoleName.ADMIN]
      },
      {
        title: "All Requests",
        label: "View All Requests",
        url: "/requests",
        roles: [RoleName.ADMIN, RoleName.HOD, RoleName.STOCK_KEEPER] 
      }
    ]
  },
  {
    icon: BarChart3,
    title: "Reports",
    label: "Reporting",
    url: "/reports",
    menu_type: MENU_TYPE.ACTIVITIES,
    roles: "all",
    subMenus: [
      {
        title: "Stock Report",
        label: "Stock Reporting",
        url: "/reports/stock",
        roles: [RoleName.STOCK_KEEPER, RoleName.ADMIN]
      },
      {
        title: "Transaction Report",
        label: "Transaction Reporting",
        url: "/reports/transactions",
        roles: [RoleName.STOCK_KEEPER, RoleName.ADMIN]
      },
      {
        title: "Request Report",
        label: "Request Reporting",
        url: "/reports/requests",
        roles: "all"
      },
      {
        title: "User Report",
        label: "User Reporting",
        url: "/reports/users",
        roles: [RoleName.ADMIN]
      }
    ]
  },

  // Admin Section
  {
    icon: Users,
    title: "Users",
    label: "User Management",
    url: "/admin/users",
    menu_type: MENU_TYPE.ADMIN,
    roles: [RoleName.ADMIN],
    subMenus: [
      {
        title: "Users List",
        label: "Manage Users",
        url: "/admin/users",
        roles: [RoleName.ADMIN]
      },
      {
        title: "Create User",
        label: "Add New User",
        url: "/admin/users/new",
        roles: [RoleName.ADMIN]
      },
      {
        title: "Roles",
        label: "Manage Roles",
        url: "/admin/roles",
        roles: [RoleName.ADMIN]
      }
    ]
  },
  {
    icon: Building2,
    title: "Departments",
    label: "Department Management",
    url: "/admin/departments",
    menu_type: MENU_TYPE.ADMIN,
    roles: [RoleName.ADMIN],
    subMenus: [
      {
        title: "Departments List",
        label: "Manage Departments",
        url: "/admin/departments",
        roles: [RoleName.ADMIN]
      },
      {
        title: "Create Department",
        label: "Add New Department",
        url: "/admin/departments/new",
        roles: [RoleName.ADMIN]
      }
    ]
  },
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
    key: MENU_TYPE.ADMIN,
    title: "Administration"
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

// Helper function to get all admin menus
export const getAdminMenus = () => getMenusByType(MENU_TYPE.ADMIN);

// Helper function to get all profile menus
export const getProfileMenus = () => getMenusByType(MENU_TYPE.PROFILE);

// helper function to gell all noe menu

export const getDashboardMenus = () => getMenusByType(MENU_TYPE.NONE);