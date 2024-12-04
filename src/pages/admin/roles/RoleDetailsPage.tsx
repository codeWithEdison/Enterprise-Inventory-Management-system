/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { RoleResponse } from '@/types/api/types';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { RolePermissionsView } from './components/RolePermissionsView';
import { mockRoles } from '@/lib/mock-data';

const RoleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock data - replace with API call
        const mockRole = mockRoles.find(r => r.id === id);
        setRole(mockRole || null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
  }, [id]);

  if (isLoading) return <LoadingScreen />;

  if (!role) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Role not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Role: ${role.name}`}
        subtitle="View and manage role details"
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <Link
            to={`/admin/roles/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit Role
          </Link>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this role?')) {
                // Handle delete
                navigate('/admin/roles');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Role
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-sm text-gray-900">{role.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={role.status} />
              </div>
            </div>
          </div>
        </Card>

        {/* Permissions */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Permissions</h2>
            <RolePermissionsView permissions={role.access} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoleDetailsPage;