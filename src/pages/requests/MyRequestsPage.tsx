/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/requests/MyRequestsPage.tsx
import React, { useState } from 'react';
import { Filter, AlertCircle, Calendar, Clock, Eye, XCircle } from 'lucide-react';

import { RequestResponse, RequestStatus } from '@/types/api/types';
import Modal, { ModalSize } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import Pagination from '@/components/common/Pagination';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';
import { SearchInput } from '@/components/common/SearchInput';

const PAGE_SIZE = 10;

const MyRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RequestResponse | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data - replace with actual data
  const myRequests: RequestResponse[] = [];

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
        return <AlertCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const filteredRequests = myRequests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.requestedItems.some(item => 
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

  const handleViewDetails = (request: RequestResponse) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleCancelRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to cancel this request?')) return;
    
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Add success notification
    } catch (error) {
      console.error('Failed to cancel request:', error);
      // Add error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Requests"
        subtitle="View and manage your stock requests"
      />

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
                        {request.requestedItems.map((item, index) => (
                          <div key={item.id}>
                            {item.item.name}
                            {index < request.requestedItems.length - 1 && ', '}
                          </div>
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
                        <button
                          onClick={() => handleViewDetails(request)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View
                        </button>
                        {request.status === RequestStatus.PENDING && (
                          <button
                            onClick={() => handleCancelRequest(request.id)}
                            disabled={isLoading}
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
              description="No requests match your current filters."
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

      {/* Request Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title="Request Details"
          widthSizeClass={ModalSize.medium}
        >
          <div className="space-y-6">
            {/* Request Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedRequest.status)}
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-xs font-medium",
                  getStatusColor(selectedRequest.status)
                )}>
                  {selectedRequest.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Requested Items */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Requested Items
              </h3>
              <div className="border rounded-lg divide-y">
                {selectedRequest.requestedItems.map((item) => (
                  <div key={item.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.item.name}
                        </div>
                        {item.item.description && (
                          <div className="text-sm text-gray-500">
                            {item.item.description}
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Qty: {item.requestedQuantity}
                        {item.approvedQuantity !== undefined && (
                          <div className="text-primary-600">
                            Approved: {item.approvedQuantity}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            {selectedRequest.remark && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Remarks
                </h3>
                <p className="text-gray-500">
                  {selectedRequest.remark}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyRequestsPage;