/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/users/components/UserRoleManagement.tsx
import React from 'react';
import { Plus, X } from 'lucide-react';
import { RoleName, Status, UserRoleResponse, DepartmentResponse } from '@/types/api/types';

interface UserRoleManagementProps {
  userRoles: UserRoleResponse[];
  onChange: (roles: UserRoleResponse[]) => void;
  departments: DepartmentResponse[];
  className?: string;
}

export const UserRoleManagement: React.FC<UserRoleManagementProps> = ({
  userRoles,
  onChange,
  departments,
  className
}) => {
  const handleAddRole = () => {
    if (!departments.length) return;

    const defaultDepartment = departments[0];
    const newRole: UserRoleResponse = {
      id: `temp-${Date.now()}`,
      departmentId: defaultDepartment.id,
      roleId: RoleName.NURSE,
      userId: '',
      status: Status.ACTIVE,
      startDate: new Date(),
      department: defaultDepartment,
      role: {
        id: '',
        name: RoleName.NURSE,
        access: {
          users: { view: false, create: false, update: false, delete: false, assignRoles: false },
          roles: { view: false, create: false, update: false, delete: false },
          departments: { view: true, create: false, update: false, delete: false },
          items: { view: true, create: false, update: false, delete: false, manageStock: false },
          inventory: { view: true, stockIn: false, stockOut: false, transfer: false, viewTransactions: false },
          locations: { view: true, create: false, update: false, delete: false },
          requests: { create: true, view: false, viewOwn: true, approve: false, reject: false, cancel: true },
          notifications: { view: true, manage: false },
          reports: { stockReport: false, transactionReport: false, requestReport: true, userReport: false },
          settings: { view: false, update: false }
        },
        status: Status.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onChange([...userRoles, newRole]);
  };

  const handleRemoveRole = (index: number) => {
    onChange(userRoles.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index: number, field: keyof UserRoleResponse, value: any) => {
    onChange(
      userRoles.map((role, i) => 
        i === index ? { ...role, [field]: value } : role
      )
    );
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-900">Roles & Departments</h3>
        <button
          type="button"
          onClick={handleAddRole}
          className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Role
        </button>
      </div>

      <div className="space-y-3">
        {userRoles.map((role, index) => (
          <div 
            key={role.id} 
            className="p-4 bg-gray-50 rounded-lg flex items-center gap-4"
          >
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={role.role.name}
                  onChange={(e) => handleRoleChange(index, 'role', {
                    ...role.role,
                    name: e.target.value as RoleName
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {Object.values(RoleName).map(roleName => (
                    <option key={roleName} value={roleName}>
                      {roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <select
                  value={role.departmentId}
                  onChange={(e) => {
                    const department = departments.find(d => d.id === e.target.value);
                    if (department) {
                      handleRoleChange(index, 'department', department);
                      handleRoleChange(index, 'departmentId', e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={role.status}
                  onChange={(e) => handleRoleChange(index, 'status', e.target.value as Status)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  {Object.values(Status).map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleRemoveRole(index)}
              className="p-1 text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}

        {userRoles.length === 0 && (
          <div className="text-center py-4 text-sm text-gray-500">
            No roles assigned. Click "Add Role" to assign a role.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleManagement;