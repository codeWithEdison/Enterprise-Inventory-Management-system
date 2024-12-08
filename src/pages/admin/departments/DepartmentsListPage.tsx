/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/admin/departments/DepartmentsListPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { DepartmentResponse, Status, UserResponse } from '@/types/api/types';
import axiosInstance from '@/lib/axios';

const DepartmentsListPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [userCounts, setUserCounts] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch departments
        const { data: departmentsData } = await axiosInstance.get<DepartmentResponse[]>('/departments', {
          params: {
            sortOrder: 'asc',
          },
        });
        setDepartments(departmentsData);

        // Fetch users
        const { data: usersData } = await axiosInstance.get<{ users: UserResponse[]; meta: any }>('/users', {
          params: {
            page: 1,
            limit: 1000,
            sortOrder: 'desc',
          },
        });

        // Calculate user counts for each department
        const userCountsByDepartment: { [key: string]: number } = {};
        departmentsData.forEach((dept) => {
          userCountsByDepartment[dept.id] = usersData.users.filter((user) =>
            user.userRoles.some((role) => role.departmentId === dept.id)
          ).length;
        });
        setUserCounts(userCountsByDepartment);
      } catch (error: any) {
        console.error('Failed to fetch departments and users:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
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
                <tr key={department.id}>
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
        </div>
      </Card>
    </div>
  );
};

export default DepartmentsListPage;