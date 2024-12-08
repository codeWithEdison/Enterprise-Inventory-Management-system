import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Lock } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import axiosInstance from '@/lib/axios';
import { UserResponse } from '@/types/api/types';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get<UserResponse>('/users/me');
        setUserData(response.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setError(error.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingScreen />;

  if (error || !userData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error || 'Failed to load profile'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        subtitle="View and manage your personal information"
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={() => navigate('/profile/edit')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </button>
          <button
            onClick={() => navigate('/change-password')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Lock className="h-4 w-4" />
            Change Password
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
                <p className="mt-1 text-sm text-gray-900">{userData.firstName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Name</label>
                <p className="mt-1 text-sm text-gray-900">{userData.lastName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{userData.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">NID</label>
                <p className="mt-1 text-sm text-gray-900">{userData.nid || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <div className="mt-1">
                  <StatusBadge status={userData.status} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Member Since</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Roles & Permissions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles & Permissions</h2>
          <div className="space-y-4">
            {userData.userRoles.map((userRole) => (
              <div key={userRole.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{userRole.role.name}</p>
                      <p className="text-sm text-gray-500">{userRole.department.name}</p>
                    </div>
                    <StatusBadge status={userRole.status} />
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Start Date: {new Date(userRole.startDate).toLocaleDateString()}</p>
                    {userRole.endDate && (
                      <p>End Date: {new Date(userRole.endDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Access & Permissions Details */}
        <Card className="lg:col-span-3 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Access & Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userData.userRoles.map((userRole) => (
              <div key={userRole.id} className="space-y-4">
                {Object.entries(userRole.role.access).map(([category, permissions]) => (
                  <div key={category} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <div className="space-y-1">
                      {Object.entries(permissions).map(([permission, allowed]) => (
                        <div key={permission} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 capitalize">
                            {permission.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={allowed ? 'text-green-600' : 'text-red-600'}>
                            {allowed ? 'Yes' : 'No'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
