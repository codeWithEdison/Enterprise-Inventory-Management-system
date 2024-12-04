
import React from 'react';
import { RoleAccess } from '@/types/api/types';
import { Check, X } from 'lucide-react';

interface RolePermissionsViewProps {
  permissions: RoleAccess;
}

export const RolePermissionsView: React.FC<RolePermissionsViewProps> = ({ permissions }) => {
  const renderPermission = (value: unknown) => (
    value === true ? 
      <Check className="h-4 w-4 text-green-500" /> : 
      <X className="h-4 w-4 text-red-500" />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(permissions).map(([category, perms]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 capitalize">{category}</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {Object.entries(perms as Record<string, boolean>).map(([action, value]) => (
              <div key={action} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{action}</span>
                {renderPermission(value)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};