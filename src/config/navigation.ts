/* eslint-disable @typescript-eslint/no-explicit-any */
// src/config/navigation.ts
import { 
    LayoutDashboard, 
    Box, 
    ClipboardList,
    Building2,
    Users,
    History,
    BarChart3,
    Settings,
    UserCircle,
    Bell,
    KeyRound
  } from 'lucide-react';
  import { RoleName } from '../types/api/types';
  
  export enum MENU_TYPE {
    NONE = "NONE",
    PROFILE = "PROFILE",
    INVENTORY = "INVENTORY",
    REQUESTS = "REQUESTS",
    MANAGEMENT = "MANAGEMENT",
    REPORTS = "REPORTS",
    SETTINGS = "SETTINGS"
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
    icon: any; // Using Lucide icons
    label: string;
    menu_type: MENU_TYPE;
    roles: RoleName[] | "all";
    subMenus: SideNavigationSubmenuInterface[];
  }
  
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
  
  export const AUTHENTICATED_MENUS: SideNavigationInterface[] = [
    // Dashboard - Available to all
    {
      icon: LayoutDashboard,
      title: "Dashboard",
      label: "Dashboard Overview",
      url: "/dashboard",
      menu_type: MENU_TYPE.NONE,
      roles: "all",
      subMenus: []
    },
  
    // Inventory Management
    {
      icon: Box,
      title: "Inventory",
      label: "Inventory Management",
      url: "/inventory",
      menu_type: MENU_TYPE.INVENTORY,
      roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER],
      subMenus: [
        {
          title: "Items List",
          label: "Manage Items",
          url: "/inventory/items",
          roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER]
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
          label: "Transfer Stock",
          url: "/inventory/transfer",
          roles: [RoleName.STOCK_KEEPER]
        }
      ]
    },
  
    // Requests Management
    {
      icon: ClipboardList,
      title: "Requests",
      label: "Request Management",
      url: "/requests",
      menu_type: MENU_TYPE.REQUESTS,
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
          url: "/requests/pending",
          roles: [RoleName.HOD, RoleName.ADMIN]
        },
        {
          title: "All Requests",
          label: "View All Requests",
          url: "/requests/all",
          roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER]
        }
      ]
    },
  
    // Department Management
    {
      icon: Building2,
      title: "Departments",
      label: "Department Management",
      url: "/departments",
      menu_type: MENU_TYPE.MANAGEMENT,
      roles: [RoleName.ADMIN],
      subMenus: []
    },
  
    // User Management
    {
      icon: Users,
      title: "Users",
      label: "User Management",
      url: "/users",
      menu_type: MENU_TYPE.MANAGEMENT,
      roles: [RoleName.ADMIN],
      subMenus: []
    },
  
    // Transaction History
    {
      icon: History,
      title: "Transactions",
      label: "Transaction History",
      url: "/transactions",
      menu_type: MENU_TYPE.REPORTS,
      roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER],
      subMenus: []
    },
  
    // Reports
    {
      icon: BarChart3,
      title: "Reports",
      label: "Reports & Analytics",
      url: "/reports",
      menu_type: MENU_TYPE.REPORTS,
      roles: [RoleName.ADMIN, RoleName.HOD, RoleName.STOCK_KEEPER],
      subMenus: [
        {
          title: "Stock Report",
          label: "Stock Level Report",
          url: "/reports/stock",
          roles: [RoleName.ADMIN, RoleName.STOCK_KEEPER]
        },
        {
          title: "Request Report",
          label: "Request Analysis",
          url: "/reports/requests",
          roles: [RoleName.ADMIN, RoleName.HOD]
        },
        {
          title: "Usage Report",
          label: "Usage Analysis",
          url: "/reports/usage",
          roles: [RoleName.ADMIN, RoleName.HOD]
        }
      ]
    },
  
    // Notifications
    {
      icon: Bell,
      title: "Notifications",
      label: "My Notifications",
      url: "/notifications",
      menu_type: MENU_TYPE.NONE,
      roles: "all",
      subMenus: []
    },
  
    // Settings - Admin Only
    {
      icon: Settings,
      title: "Settings",
      label: "System Settings",
      url: "/settings",
      menu_type: MENU_TYPE.SETTINGS,
      roles: [RoleName.ADMIN],
      subMenus: []
    },
  
    // Profile Settings - Available to all
    {
      icon: UserCircle,
      title: "Profile",
      label: "My Profile",
      url: "/profile",
      menu_type: MENU_TYPE.PROFILE,
      roles: "all",
      subMenus: []
    },
  
    // Change Password - Available to all
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
  
  export const getMenuCategories = () => [
    { key: MENU_TYPE.NONE, title: "" },
    { key: MENU_TYPE.INVENTORY, title: "Inventory Management" },
    { key: MENU_TYPE.REQUESTS, title: "Request Management" },
    { key: MENU_TYPE.MANAGEMENT, title: "System Management" },
    { key: MENU_TYPE.REPORTS, title: "Reports & Analytics" },
    { key: MENU_TYPE.SETTINGS, title: "Settings" },
    { key: MENU_TYPE.PROFILE, title: "Profile" }
  ];