/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/requests/PendingApprovalsPage.tsx
import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';

import { 
  RequestResponse, 
  RequestStatus, 
  UpdateRequestStatusInput 
} from '@/types/api/types';
import Modal, { ModalSize } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import Pagination from '@/components/common/Pagination';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { mockRequests } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

const PAGE_SIZE = 10;

const PendingApprovalsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<RequestResponse | null>(null);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalData, setApprovalData] = useState<UpdateRequestStatusInput>({
    status: RequestStatus.PENDING,
    approvedQuantities: [],
    remark: ''
  });

  // Mock data - replace with actual data
  const pendingRequests: RequestResponse[] = mockRequests.filter(req =>req.status === RequestStatus.PENDING);

  const filteredRequests = pendingRequests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedItems.some(item => 
        item.item.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      request.remark?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch && request.status === RequestStatus.PENDING;
  });

  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openApprovalModal = (request: RequestResponse) => {
    setSelectedRequest(request);
    setApprovalData({
      status: RequestStatus.PENDING,
      approvedQuantities: request.requestedItems.map(item => ({
        requestedItemId: item.id,
        quantity: item.requestedQuantity
      })),
      remark: ''
    });
    setIsApprovalModalOpen(true);
  };

  const handleUpdateQuantity = (requestedItemId: string, quantity: number) => {
    setApprovalData(prev => ({
      ...prev,
      approvedQuantities: prev.approvedQuantities?.map(item => 
        item.requestedItemId === requestedItemId 
          ? { ...item, quantity }
          : item
      ) || []
    }));
  };

  const handleApproveRequest = async (approved: boolean) => {
    if (!selectedRequest) return;

    setIsLoading(true);
    try {
      const statusData: UpdateRequestStatusInput = {
        status: approved ? RequestStatus.APPROVED : RequestStatus.REJECTED,
        approvedQuantities: approved ? approvalData.approvedQuantities : undefined,
        remark: approvalData.remark
      };

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsApprovalModalOpen(false);
      setSelectedRequest(null);
      // Add success notification
    } catch (error) {
      console.error('Failed to update request:', error);
      // Add error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pending Approvals"
        subtitle="Review and process pending stock requests"
      />

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

        {/* Requests List */}
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
                        // onClick={() => openApprovalModal(request)}
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

      {/* Approval Modal */}
      {selectedRequest && (
        <Modal
          isOpen={isApprovalModalOpen}
          onClose={() => !isLoading && setIsApprovalModalOpen(false)}
          title="Review Request"
          widthSizeClass={ModalSize.large}
        >
          <div className="space-y-6">
            {/* Requester Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRequest.user.firstName} {selectedRequest.user.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRequest.user.userRoles[0]?.department.name}
                </p>
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
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-500">
                          Requested: {item.requestedQuantity}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Approve Quantity
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={item.requestedQuantity}
                            value={approvalData.approvedQuantities?.find(
                              aq => aq.requestedItemId === item.id
                            )?.quantity || 0}
                            onChange={(e) => handleUpdateQuantity(
                              item.id,
                              parseInt(e.target.value) || 0
                            )}
                            className="mt-1 block w-24 rounded-md border-gray-300
                                   focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remark
              </label>
              <textarea
                value={approvalData.remark || ''}
                onChange={(e) => setApprovalData(prev => ({ 
                  ...prev, 
                  remark: e.target.value 
                }))}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300
                         focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="Add any notes or comments..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => handleApproveRequest(false)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600
                        rounded-md hover:bg-red-700 focus:outline-none focus:ring-2
                        focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => handleApproveRequest(true)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600
                        rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2
                        focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Approve'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PendingApprovalsPage;