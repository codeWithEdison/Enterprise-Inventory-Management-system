/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/roles/components/RolePermissionsForm.tsx
import React from 'react';
import { RoleAccess } from '@/types/api/types';

interface RolePermissionsFormProps {
  permissions: RoleAccess;
  onChange: (permissions: RoleAccess) => void;
}

export const RolePermissionsForm: React.FC<RolePermissionsFormProps> = ({
  permissions,
  onChange
}) => {
  const handleToggle = (category: keyof RoleAccess, permission: string, value: boolean) => {
    onChange({
      ...permissions,
      [category]: {
        ...permissions[category],
        [permission]: value
      }
    });
  };

  const handleToggleAll = (category: keyof RoleAccess, value: boolean) => {
    onChange({
      ...permissions,
      [category]: Object.keys(permissions[category]).reduce((acc, key) => ({
        ...acc,
        [key]: value
      }), {})
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(permissions).map(([category, perms]) => (
        <div key={category} className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900 capitalize">{category}</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleAll(category as keyof RoleAccess, true)}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Select All
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => handleToggleAll(category as keyof RoleAccess, false)}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            {Object.entries(perms).map(([permission, value]) => (
              <div key={permission} className="flex items-center justify-between">
                <label className="text-sm text-gray-600 capitalize">
                  {permission}
                </label>
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    onChange={(e) => handleToggle(
                      category as keyof RoleAccess,
                      permission,
                      e.target.checked
                    )}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

