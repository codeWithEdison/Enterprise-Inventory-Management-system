/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DepartmentResponse, Status, UserResponse } from '@/types/api/types';
import axiosInstance from '@/lib/axios'; 

interface UserCounts {
  [key: string]: number;
}

interface PaginatedResponse<T> {
  users: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const DepartmentsListPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [userCounts, setUserCounts] = useState<UserCounts>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL');

  const calculateUserCounts = (users: UserResponse[], departments: DepartmentResponse[]) => {
    const userCounts: UserCounts = {};
    
    // Initialize counts for all departments to 0
    departments.forEach(dept => {
      userCounts[dept.id] = 0;
    });

    // Count users in each department based on their active roles
    users.forEach(user => {
      // Get all active roles for the user
      const activeRoles = user.userRoles.filter(role => 
        role.status === Status.ACTIVE && user.status === Status.ACTIVE
      );
      
      // Count unique departments for this user
      const userDepartments = new Set(activeRoles.map(role => role.departmentId));
      
      // Increment count for each department
      userDepartments.forEach(deptId => {
        if (userCounts.hasOwnProperty(deptId)) {
          userCounts[deptId]++;
        }
      });
    });

    return userCounts;
  };

  // Function to fetch all users with pagination
  const fetchAllUsers = async (): Promise<UserResponse[]> => {
    const firstPageResponse = await axiosInstance.get<PaginatedResponse<UserResponse>>('/users', {
      params: {
        page: 1,
        limit: 100,
        sortOrder: 'desc',
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
          },
        })
      );

      const responses = await Promise.all(remainingRequests);
      responses.forEach((response: { data: { users: any; }; }) => {
        allUsers = [...allUsers, ...response.data.users];
      });
    }

    return allUsers;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch departments
        const { data: departmentsData } = await axiosInstance.get<DepartmentResponse[]>('/departments', {
          params: {
            sortOrder: 'asc',
          },
        });

        // Fetch all users using pagination
        const allUsers = await fetchAllUsers();

        setDepartments(departmentsData);

        // Calculate user counts
        const counts = calculateUserCounts(allUsers, departmentsData);
        setUserCounts(counts);

      } catch (error) {
        console.error('Failed to fetch departments and users:', error);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch = 
      dept.name.toLowerCase().includes(search.toLowerCase()) ||
      dept.description?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || dept.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        subtitle="Manage departments and their settings"
      >
        <Link
          to="/admin/departments/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Department
        </Link>
      </PageHeader>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search departments..."
            className="w-96"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Status</option>
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Departments List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {department.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {department.description || '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={department.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {userCounts[department.id] || 0} users
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Link
                      to={`/admin/departments/${department.id}`}
                      className="text-primary-600 hover:text-primary-900 font-medium text-sm"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredDepartments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No departments found</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default DepartmentsListPage;