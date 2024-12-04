/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/admin/departments/EditDepartmentPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { UpdateDepartmentInput, Status, DepartmentResponse } from '@/types/api/types';
import Alert, { AlertType } from '@/components/common/Alert';
import { mockDepartments } from '@/lib/mock-data';

const EditDepartmentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [department, setDepartment] = useState<DepartmentResponse | null>(null);
  const [formData, setFormData] = useState<UpdateDepartmentInput>({
    name: department?.name || '',
    description: department?.description || '',
    status: department?.status || Status.ACTIVE,
  });

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setIsLoading(true);
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dept = mockDepartments.find(d => d.id === id);
        
        if (dept) {
          setDepartment(dept);
          setFormData({
            name: dept.name,
            description: dept.description || '',
            status: dept.status,
          });
        }
      } catch (error) {
        setError('Failed to fetch department details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      setError('Department name is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate(`/admin/departments/${id}`);
    } catch (err) {
      setError('Failed to update department. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!department) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Department not found</p>
        <button
          onClick={() => navigate('/admin/departments')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Departments
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Department"
        subtitle="Update department information"
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
          alertType={AlertType.DANGER}
          title={error}
          close={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <Input
                  title="Department Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={error && !formData.name?.trim() ? 'Department name is required' : undefined}
                  onCloseError={() => setError(null)}
                  className="bg-gray-50 focus:bg-white"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      status: e.target.value as Status 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                             bg-gray-50 focus:bg-white"
                  >
                    {Object.values(Status).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                  <StatusBadge status={department.status} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
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
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDepartmentPage;