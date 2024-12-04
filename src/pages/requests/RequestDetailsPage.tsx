// src/pages/requests/RequestDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, ClockIcon, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { mockApi } from '@/services/mockApi';
import useAuth from '@/hooks/useAuth';
import { RequestResponse, RequestStatus, RoleName } from '@/types/api/types';

const RequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<RequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalRemark, setApprovalRemark] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const userRole = user?.userRoles[0]?.role.name;
  const canApproveRequest = userRole === RoleName.HOD || userRole === RoleName.ADMIN;
//   const isOwnRequest = request?.userId === user?.id;

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        // Implement this in your mock API
        const data = await mockApi.requests.getRequestById(id || '');
        setRequest(data);
      } catch (err) {
        setError('Failed to load request details');
        console.error('Error fetching request:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!request || isProcessing) return;

    try {
      setIsProcessing(true);
      const updatedRequest = await mockApi.requests.updateRequestStatus(
        request.id,
        newStatus,
        approvalRemark
      );
      setRequest(updatedRequest);
      setApprovalRemark('');
    } catch (err) {
      console.error('Error updating request:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || 'Request not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: RequestStatus) => {
    const styles = {
      [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [RequestStatus.APPROVED]: 'bg-green-100 text-green-800',
      [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
      [RequestStatus.FULLFILLED]: 'bg-blue-100 text-blue-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Request Details"
        subtitle={`Request #${request.id}`}
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Request Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Information</h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{getStatusBadge(request.status)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Requested By</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.user.firstName} {request.user.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Department</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.user.userRoles[0]?.department.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Date Requested</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Requested Items */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Requested Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Requested Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Approved Qty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {request.requestedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.requestedQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.approvedQuantity || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Approval Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status Updates</h3>
            <div className="space-y-6">
              {request.status !== RequestStatus.PENDING && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {request.status === RequestStatus.APPROVED ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Request {request.status.toLowerCase()}
                    </p>
                    <p className="text-sm text-gray-500">
                      {request.remark || 'No remarks added'}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(request.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Request created
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {new Date(request.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Approval Actions */}
          {canApproveRequest && request.status === RequestStatus.PENDING && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Action</h3>
              <div className="space-y-4">
                <textarea
                  value={approvalRemark}
                  onChange={(e) => setApprovalRemark(e.target.value)}
                  placeholder="Add remarks..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(RequestStatus.APPROVED)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(RequestStatus.REJECTED)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;