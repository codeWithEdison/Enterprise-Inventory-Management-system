// src/pages/dashboard/utils/quickActions.ts
import { RoleName } from '@/types/api/types';
import { 
  Users, 
  BarChart2, 
  Package, 
  Settings,
  TrendingUp,
  Clock,
  PackageSearch
} from 'lucide-react';

interface QuickActionItem {
  label: string;
  icon: React.ComponentType;
  onClick: () => void;
}

export const getQuickActions = (role: RoleName): QuickActionItem[] => {
  const actions: Record<RoleName, QuickActionItem[]> = {
    [RoleName.ADMIN]: [
      { label: 'Add User', icon: Users, onClick: () => {} },
      { label: 'View Reports', icon: BarChart2, onClick: () => {} },
      { label: 'Manage Items', icon: Package, onClick: () => {} },
      { label: 'System Settings', icon: Settings, onClick: () => {} },
    ],
    [RoleName.STOCK_KEEPER]: [
      { label: 'Add Item', icon: Package, onClick: () => {} },
      { label: 'Stock In', icon: TrendingUp, onClick: () => {} },
      { label: 'Process Requests', icon: Clock, onClick: () => {} },
      { label: 'View Reports', icon: BarChart2, onClick: () => {} },
    ],
    [RoleName.HOD]: [
      { label: 'Approve Requests', icon: Clock, onClick: () => {} },
      { label: 'New Request', icon: Package, onClick: () => {} },
      { label: 'View Reports', icon: BarChart2, onClick: () => {} },
      { label: 'View Stock', icon: PackageSearch, onClick: () => {} },
    ],
    [RoleName.NURSE]: [
      { label: 'New Request', icon: Package, onClick: () => {} },
      { label: 'My Requests', icon: Clock, onClick: () => {} },
      { label: 'View Stock', icon: PackageSearch, onClick: () => {} },
      { label: 'View Reports', icon: BarChart2, onClick: () => {} },
    ],
  };

  return actions[role] || [];
};