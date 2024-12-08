/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  FilterX,
  Download,
  Building2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  RequestResponse,
  RequestStatus,
  RequestFilterParams,
  DepartmentResponse,
} from '@/types/api/types';
// import Modal, { ModalSize } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import Pagination from '@/components/common/Pagination';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import axiosInstance from '@/lib/axios';

const PAGE_SIZE = 10;

const AllRequestsPage = () => {
  // States for filters
  const [filters, setFilters] = useState<RequestFilterParams>({
    page: 1,
    limit: PAGE_SIZE,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: undefined,
    userId: undefined,
    departmentId: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  // UI states
  const [selectedRequest, setSelectedRequest] =
    useState<RequestResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [allRequests, setAllRequests] = useState<RequestResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);

  useEffect(() => {
    fetchAllRequests();
  }, [filters]);

  const fetchAllRequests = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get<RequestResponse[]>('/requests', {
        params: filters,
      });
      setAllRequests(response.data);
      setDepartments([...new Set(response.data.map(r => r.user.userRoles[0].department))]);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case RequestStatus.APPROVED:
        return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case RequestStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case RequestStatus.FULLFILLED:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return 'text-yellow-700 bg-yellow-50';
      case RequestStatus.APPROVED:
        return 'text-blue-700 bg-blue-50';
      case RequestStatus.REJECTED:
        return 'text-red-700 bg-red-50';
      case RequestStatus.FULLFILLED:
        return 'text-green-700 bg-green-50';
      default:
        return 'text-gray-700 bg-gray-50';
    }
  };

  // Filter Handling
  const handleFilterChange = (key: keyof RequestFilterParams, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset page when filters change
    }));
  };

  // Export functionality
  const handleExport = async () => {
    setIsLoading(true);
    try {
      // API call for export would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Download file handling
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (request: RequestResponse) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="All Requests"
        subtitle="View and manage all stock requests"
      >
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                   text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </PageHeader>

      <Card>
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search requests..."
              className="w-full sm:w-96"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg',
                'border border-gray-300 hover:bg-gray-50',
                showFilters && 'bg-primary-50 border-primary-300'
              )}
            >
              <FilterX className="h-4 w-4" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filters.status || ''}
                  onChange={(e) =>
                    handleFilterChange('status', e.target.value || undefined)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                           focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">All Status</option>
                  {Object.values(RequestStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <select
                  value={filters.departmentId || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'departmentId',
                      e.target.value || undefined
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                           focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date Range
                </label>
                <div className="mt-1 grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        startDate: e.target.value,
                      }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm
                             focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) =>
                      setDateRange((prev) => ({
                        ...prev,
                        endDate: e.target.value,
                      }))
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm
                             focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          {allRequests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.user.firstName} {request.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {request.user.userRoles[0]?.department.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.requestedItems.map((item, index) => (
                          <div key={item.id}>
                            {item.item.name} ({item.requestedQuantity} units)
                            {index < request.requestedItems.length - 1 && ', '}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span
                          className={cn(
                            'ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium',
                            getStatusColor(request.status)
                          )}
                        >
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`${request.id}`}
                        // onClick={() => handleViewDetails(request)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="No requests found"
              description="No requests match your current filters."
            />
          )}
        </div>

        {allRequests.length > 0 && (
          <Pagination
            currentPage={filters.page || 1}
            totalPages={Math.ceil(allRequests.length / PAGE_SIZE)}
            onPageChange={(page) => handleFilterChange('page', page)}
            pageSize={PAGE_SIZE}
            totalItems={allRequests.length}
            className="border-t"
          />
        )}
      </Card>
    </div>
  );
};

export default AllRequestsPage;