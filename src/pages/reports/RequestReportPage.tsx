/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { FileDown, Filter, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { RequestResponse, RequestStatus, RequestFilterParams, DepartmentResponse } from '@/types/api/types';
import axiosInstance from '@/lib/axios';

const RequestReportPage = () => {
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<RequestFilterParams>({
    startDate: undefined,
    endDate: undefined,
    status: undefined,
    departmentId: undefined,
  });

  // Fetch requests and departments
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [requestsResponse, departmentsResponse] = await Promise.all([
          axiosInstance.get<RequestResponse[]>('/requests'),
          axiosInstance.get<DepartmentResponse[]>('/departments'),
        ]);
        setRequests(requestsResponse.data);
        setDepartments(departmentsResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to load requests and departments data');
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate statistics
  const calculateStats = (requests: RequestResponse[]) => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(req => req.status === RequestStatus.PENDING).length;
    const approvedRequests = requests.filter(req => req.status === RequestStatus.APPROVED).length;
    const rejectedRequests = requests.filter(req => req.status === RequestStatus.REJECTED).length;
    const fulfilledRequests = requests.filter(req => req.status === RequestStatus.FULLFILLED).length;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      fulfilledRequests,
    };
  };

  const stats = calculateStats(requests.filter(request => {
    const matchesStartDate = filters.startDate ? new Date(request.createdAt) >= new Date(filters.startDate) : true;
    const matchesEndDate = filters.endDate ? new Date(request.createdAt) <= new Date(filters.endDate) : true;
    const matchesStatus = filters.status ? request.status === filters.status : true;
    const matchesDepartment = filters.departmentId ? request.user.userRoles[0].departmentId === filters.departmentId : true;

    return matchesStartDate && matchesEndDate && matchesStatus && matchesDepartment;
  }));

  const getStatusBadge = (status: RequestStatus) => {
    const styles = {
      [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [RequestStatus.APPROVED]: 'bg-green-100 text-green-800',
      [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
      [RequestStatus.FULLFILLED]: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const handleFilterChange = (key: keyof RequestFilterParams, value: RequestFilterParams[typeof key]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Report"
        subtitle="Overview of request statistics and history"
      >
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <FileDown className="h-4 w-4" />
          Export Report
        </button>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.pendingRequests}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Approved</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">{stats.approvedRequests}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">{stats.rejectedRequests}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters</span>
          </div>
          <input
          disabled ={true} 
            type="date"
            value={filters.startDate?.toDateString() || ''}
            onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <span className="text-gray-500">to</span>
          <input
          disabled ={true} 
            type="date"
            value={filters.endDate?.toDateString() || ''}
            onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <select
          
            value={filters.status || 'all'}
            onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? undefined : e.target.value as RequestStatus)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value={RequestStatus.PENDING}>Pending</option>
            <option value={RequestStatus.APPROVED}>Approved</option>
            <option value={RequestStatus.REJECTED}>Rejected</option>
            <option value={RequestStatus.FULLFILLED}>Fulfilled</option>
          </select>
          {/* <select
            value={filters.departmentId || 'all'}
            onChange={(e) => handleFilterChange('departmentId', e.target.value === 'all' ? undefined : e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Departments</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select> */}
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requester
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests
                .filter((request) =>
                  filters.startDate ? new Date(request.createdAt) >= new Date(filters.startDate) : true
                )
                .filter((request) =>
                  filters.endDate ? new Date(request.createdAt) <= new Date(filters.endDate) : true
                )
                .filter((request) =>
                  filters.status ? request.status === filters.status : true
                )
                .filter((request) =>
                  filters.departmentId ? request.user.userRoles[0].departmentId === filters.departmentId : true
                )
                .map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {request.user.firstName} {request.user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.user.userRoles[0]?.department.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.requestedItems.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.remark || '-'}
                      </div>
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

export default RequestReportPage;