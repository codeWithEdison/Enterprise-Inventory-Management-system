/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/users/EditUserPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { mockApi } from '@/services/mockApi';
import { UpdateUserInput, UserResponse, Status } from '@/types/api/types';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const EditUserPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState<UpdateUserInput>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nid: '',
    status: Status.ACTIVE
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateUserInput, string>>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await mockApi.users.getCurrentUser(); // Replace with getUserById
        setUser(data);
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          nid: data.nid || '',
          status: data.status
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
        navigate('/admin/users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UpdateUserInput, string>> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      navigate(`/admin/users/${id}`);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">User not found</p>
        <button
          onClick={() => navigate('/admin/users')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Users List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit User"
        subtitle="Update user information"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </PageHeader>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <Input
                title="First Name"
                type="text"
                value={formData.firstName}
                onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                error={errors.firstName}
              />
              <Input
                title="Last Name"
                type="text"
                value={formData.lastName}
                onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                error={errors.lastName}
              />
              <Input
                title="Email"
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                error={errors.email}
              />
              <Input
                title="Phone"
                type="tel"
                value={formData.phone || ''}
                onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
              <Input
                title="NID"
                type="text"
                value={formData.nid || ''}
                onChange={e => setFormData(prev => ({ ...prev, nid: e.target.value }))}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as Status }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {Object.values(Status).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Roles & Departments</h2>
            <div className="space-y-4">
              {user.userRoles.map((userRole, index) => (
                <div 
                  key={userRole.id} 
                  className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{userRole.role.name}</p>
                    <p className="text-sm text-gray-500">{userRole.department.name}</p>
                  </div>
                  <select
                    value={userRole.status}
                    onChange={() => {}} // Add role status update logic
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {Object.values(Status).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </Card>

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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;