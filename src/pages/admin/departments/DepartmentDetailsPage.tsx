/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Users } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { DepartmentResponse, Status, UserResponse } from '@/types/api/types';
import axiosInstance from '@/lib/axios';
import { ConfirmationModal } from '@/components/modals/ConfirmationModal';

interface PaginatedResponse<T> {
  users: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const DepartmentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<DepartmentResponse | null>(null);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch all users with pagination
  const fetchAllUsers = async (departmentId: string): Promise<UserResponse[]> => {
    const firstPageResponse = await axiosInstance.get<PaginatedResponse<UserResponse>>('/users', {
      params: {
        page: 1,
        limit: 100,
        sortOrder: 'desc',
        departmentId,
      },
    });

    const { total, limit } = firstPageResponse.data.meta;
    const totalPages = Math.ceil(total / limit);
    let allUsers = [...firstPageResponse.data.users];

    // If there are more pages, fetch them
    if (totalPages > 1) {
      const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
      const remainingRequests = remainingPages.map(page =>
        axiosInstance.get<PaginatedResponse<UserResponse>>('/users', {
          params: {
            page,
            limit: 100,
            sortOrder: 'desc',
            departmentId,
          },
        })
      );

      const responses = await Promise.all(remainingRequests);
      responses.forEach((response: { data: { users: any; }; }) => {
        allUsers = [...allUsers, ...response.data.users];
      });
    }

    // Filter to only include active users
    return allUsers.filter(user => 
      user.status === Status.ACTIVE && 
      user.userRoles.some((role: { departmentId: string; status: Status; }) => 
        role.departmentId === departmentId && 
        role.status === Status.ACTIVE
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch department
        const { data: departmentData } = await axiosInstance.get<DepartmentResponse>(`/departments/${id}`);
        setDepartment(departmentData);

        if (id) {
          // Fetch all users using pagination
          const allUsers = await fetchAllUsers(id);
          setUsers(allUsers);
        }
      } catch (error: any) {
        console.error('Failed to fetch department and users:', error);
        setError(error.response?.data?.message || 'Failed to load department details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/departments/${id}`);
      navigate('/admin/departments');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Failed to delete department:', error);
      setError(error.response?.data?.message || 'Failed to delete department');
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/admin/departments')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Departments
        </button>
      </div>
    );
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

  const activeUsers = users.filter(user => 
    user.status === Status.ACTIVE && 
    user.userRoles.some(role => 
      role.departmentId === id && 
      role.status === Status.ACTIVE
    )
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={department.name}
        subtitle="Department details and settings"
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
            to={`/admin/departments/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Edit2 className="h-4 w-4" />
            Edit Department
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete Department
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
              <p className="mt-1 text-sm text-gray-900">{department.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="mt-1 text-sm text-gray-900">{department.description || '-'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <StatusBadge status={department.status} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Created At</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(department.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        {/* Users Summary */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Users Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Users</p>
                  <p className="text-sm text-gray-500">Active members in department</p>
                </div>
              </div>
              <span className="text-2xl font-semibold text-gray-900">{activeUsers.length}</span>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="text-sm text-gray-500 text-center py-4">
              No recent activity found
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Department"
        message="Are you sure you want to delete this department? This action cannot be undone."
        confirmLabel={isDeleting ? "Deleting..." : "Delete Department"}
        type="danger"
      />
    </div>
  );
};

export default DepartmentDetailsPage;