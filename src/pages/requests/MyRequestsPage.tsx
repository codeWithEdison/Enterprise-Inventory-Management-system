/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Eye, XCircle, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RequestResponse, RequestStatus } from '@/types/api/types';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchInput } from '@/components/common/SearchInput';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Pagination from '@/components/common/Pagination';
import { cn } from '@/lib/utils';
import axiosInstance from '@/lib/axios';

const PAGE_SIZE = 10;

const MyRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [requests, setRequests] = useState<RequestResponse[]>([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<RequestResponse[]>('/requests/my');
        setRequests(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load requests');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

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

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case RequestStatus.APPROVED:
        return <Eye className="h-5 w-5 text-blue-500" />;
      case RequestStatus.REJECTED:
        return <XCircle className="h-5 w-5 text-red-500" />;
      case RequestStatus.FULLFILLED:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    try {
      await axiosInstance.patch(`/requests/${requestId}/cancel`);
      
      // Update request status in the list
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: RequestStatus.REJECTED }
            : request
        )
      );
    } catch (error: any) {
      setError(error.message || 'Failed to cancel request');
    }
  };

  // Filter and paginate requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.requestedItems.some((item: { item: { name: string; }; }) => 
        item.item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      request.remark?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Requests"
        subtitle="View and manage your stock requests"
      >
        <Link
          to="/requests/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          New Request
        </Link>
      </PageHeader>

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <Card>
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search requests..."
              className="w-full sm:w-96"
            />
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as RequestStatus | 'all')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                {Object.values(RequestStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="overflow-x-auto">
          {paginatedRequests.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remark
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.requestedItems.map((item: { id: React.Key | null | undefined; item: { name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }; }, index: number) => (
                          <span key={item.id}>
                            {item.item.name}
                            {index < request.requestedItems.length - 1 && ', '}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        {request.requestedItems.length} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span className={cn(
                          "ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                          getStatusColor(request.status)
                        )}>
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {request.remark || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/requests/${request.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </Link>
                        {request.status === RequestStatus.PENDING && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="No requests found"
              description={
                searchQuery || filterStatus !== 'all'
                  ? "No requests match your current filters."
                  : "You haven't made any requests yet."
              }
            />
          )}
        </div>

        {paginatedRequests.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRequests.length / PAGE_SIZE)}
            onPageChange={setCurrentPage}
            pageSize={PAGE_SIZE}
            totalItems={filteredRequests.length}
            className="border-t"
          />
        )}
      </Card>
    </div>
  );
};

export default MyRequestsPage;