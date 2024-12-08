/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/users/UserDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { UserResponse } from '@/types/api/types';
import axiosInstance from '@/lib/axios';

const UserDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<UserResponse>(`/users/${id}`);
        setUser(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (isLoading) return <LoadingScreen />;

  if (error || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'User not found'}</p>
        <button
          onClick={() => navigate('/admin/users')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Users List
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      navigate('/admin/users');
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Details"
        subtitle="View and manage user information"
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
            to={`/admin/users/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit User
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete User
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Information */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">First Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{user.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">NID</label>
                <p className="mt-1 text-sm text-gray-900">{user.nid || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={user.status} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Roles & Permissions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles & Permissions</h2>
          <div className="space-y-4">
            {user.userRoles.map((userRole) => (
              <div key={userRole.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{userRole.role.name}</p>
                    <p className="text-sm text-gray-500">{userRole.department.name}</p>
                  </div>
                  <StatusBadge status={userRole.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {/* Add activity items here */}
            <div className="text-sm text-gray-500 text-center py-4">
              No recent activity found
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDetailsPage;