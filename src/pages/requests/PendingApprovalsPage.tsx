/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/requests/PendingApprovalsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { 
  RequestResponse, 
  RequestStatus,
  UpdateRequestStatusInput 
} from '@/types/api/types';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import { LoadingSpinner } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import axiosInstance from '@/lib/axios';

const PAGE_SIZE = 10;

const PendingApprovalsPage = () => {
  const [requests, setRequests] = useState<RequestResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await axiosInstance.get(`/requests`, {
        params: {
          status: RequestStatus.PENDING
        }
      });
      
      setRequests(response.data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch pending requests';
      setError(errorMessage);
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      request.user.firstName.toLowerCase().includes(searchTerm) ||
      request.user.lastName.toLowerCase().includes(searchTerm) ||
      request.requestedItems.some(item => 
        item.item.name.toLowerCase().includes(searchTerm)
      ) ||
      request.remark?.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleUpdateRequest = async (requestId: string, data: UpdateRequestStatusInput) => {
    try {
      await axiosInstance.patch(`/requests/${requestId}`, data);
      await fetchPendingRequests(); // Refresh the list after update
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update request';
      setError(errorMessage);
      setAlertVisible(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Approvals"
        subtitle="Review and process pending stock requests"
      />

      {/* Error Alert */}
      {error && alertVisible && (
        <Alert
          alertType={AlertType.DANGER}
          title="Error"
          description={error}
          close={() => setAlertVisible(false)}
        />
      )}

      <Card>
        {/* Filters */}
        <div className="p-4 border-b border-gray-200">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by requester, items..."
            className="w-full sm:w-96"
          />
        </div>

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Requests List */}
        {!isLoading && (
          <div className="overflow-x-auto">
            {paginatedRequests.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
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
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="font-medium text-gray-600">
                              {request.user.firstName[0]}{request.user.lastName[0]}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {request.user.firstName} {request.user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {request.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
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
                          {request.requestedItems.map((item, index) => (
                            <div key={item.id}>
                              {item.item.name} ({item.requestedQuantity} units)
                              {index < request.requestedItems.length - 1 && ', '}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.user.userRoles[0]?.department.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/requests/${request.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState
                title="No pending requests"
                description="There are no requests waiting for your approval."
              />
            )}
          </div>
        )}

        {!isLoading && paginatedRequests.length > 0 && (
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

export default PendingApprovalsPage;