// src/pages/dashboard/components/QuickActions.tsx
import React from 'react';
import { Card } from '@/components/common/Card';
import { RoleName } from '@/types/api/types';
import { getQuickActions } from '../utils/quickActions';
import { cn } from '@/lib/utils';

interface QuickActionProps {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  className?: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({ 
  label, 
  icon: Icon,
  onClick,
  className 
}) => (
  <button
    onClick={onClick}
    className={cn(
      "p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors",
      className
    )}
  >
    <div className="flex flex-col items-center text-center">
      <Icon className="h-6 w-6 text-gray-600" />
      <span className="mt-2 text-sm font-medium text-gray-900">
        {label}
      </span>
    </div>
  </button>
);

interface QuickActionsSectionProps {
  role: RoleName;
  className?: string;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({ 
  role,
  className 
}) => {
  const actions = getQuickActions(role);

  return (
    <Card className={cn("lg:col-span-2 p-6", className)}>
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <QuickAction 
            key={index}
            label={action.label}
            icon={action.icon}
            onClick={action.onClick}
          />
        ))}
      </div>
    </Card>
  );
};