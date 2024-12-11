/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/roles/CreateRolePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { CreateRoleInput, RoleName } from '@/types/api/types';
import { RolePermissionsForm } from './components/RolePermissionsForm';
// import { mockApi } from '@/services/mockApi';
import Alert, { AlertType } from '@/components/common/Alert';
import Input from '@/components/common/Input';

const defaultPermissions = {
  users: {
    view: false,
    create: false,
    update: false,
    delete: false,
    assignRoles: false,
  },
  roles: {
    view: false,
    create: false,
    update: false,
    delete: false,
  },
  departments: {
    view: true,
    create: false,
    update: false,
    delete: false,
  },
  items: {
    view: true,
    create: false,
    update: false,
    delete: false,
    manageStock: false,
  },
  inventory: {
    view: true,
    stockIn: false,
    stockOut: false,
    transfer: false,
    viewTransactions: false,
  },
  locations: {
    view: true,
    create: false,
    update: false,
    delete: false,
  },
  requests: {
    create: true,
    view: false,
    viewOwn: true,
    approve: false,
    reject: false,
    cancel: true,
  },
  notifications: {
    view: true,
    manage: false,
  },
  reports: {
    stockReport: false,
    transactionReport: false,
    requestReport: true,
    userReport: false,
  },
  settings: {
    view: false,
    update: false,
  },
};

const CreateRolePage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateRoleInput>({
    name: RoleName.NURSE,
    access: defaultPermissions,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate('/admin/roles');
    } catch (err) {
      setError('Failed to create role. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create Role"
        subtitle="Define a new role and its permissions"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </PageHeader>

      {error && (
        <Alert
          alertType={AlertType. DANGER}
          title={error}
          close={() => setError(null)}
        />
       
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role Name
                </label> */}
                {/* <select
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    name: e.target.value as RoleName 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.values(RoleName).map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select> */}
                <Input
                 type='test'
                 title='Role Name'
                 
                 />
              </div>
            </div>
          </Card>

          {/* Permissions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
            <RolePermissionsForm
              permissions={formData.access}
              onChange={(access) => setFormData(prev => ({ ...prev, access }))}
            />
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateRolePage;