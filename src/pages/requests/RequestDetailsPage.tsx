/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/requests/RequestDetailsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  ClockIcon,
  Loader2,
  PackageCheck,
} from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/common/Card";
import useAuth from "@/hooks/useAuth";
import {
  RequestResponse,
  RequestStatus,
  RoleName,
  // TransactionType,
  UpdateRequestStatusInput,
  UUID,
} from "@/types/api/types";
import axiosInstance from "@/lib/axios";
import Alert, { AlertType } from "@/components/common/Alert";
import { cn } from "@/lib/utils";

const RequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [request, setRequest] = useState<RequestResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvalRemark, setApprovalRemark] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [approvedQuantities, setApprovedQuantities] = useState<
    Record<UUID, number>
  >({});

  const userRole = user?.userRoles[0]?.role.name;
  const canApproveRequest =
    userRole === RoleName.HOD; 
  const isStockKeeper = userRole === RoleName.STOCK_KEEPER;

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<RequestResponse>(
          `/requests/${id}`
        );
        setRequest(data);
        // Initialize approved quantities with requested quantities using item.id
        const initialQuantities = data.requestedItems.reduce(
          (acc, item) => ({
            ...acc,
            [item.item.id]: item.requestedQuantity, // Use item.id directly
          }),
          {}
        );
        setApprovedQuantities(initialQuantities);
      } catch (err: any) {
        setError(err.message || "Failed to load request details");
        console.error("Error fetching request:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);

  // The handler remains the same but now tracks by itemId
  const handleApprovedQuantityChange = (itemId: UUID, value: number) => {
    setApprovedQuantities((prev) => ({
      ...prev,
      [itemId]: value,
    }));
  };

  // Updated handleStatusUpdate function for RequestDetailsPage.tsx

  const handleStatusUpdate = async (newStatus: RequestStatus) => {
    if (!request || isProcessing) return;

    try {
      setIsProcessing(true);

      // Prepare the update request payload
      const updatePayload: UpdateRequestStatusInput = {
        status: newStatus,
        remark: approvalRemark || undefined,
      };

      // Only include approvedQuantities for APPROVED status
      if (newStatus === RequestStatus.APPROVED) {
        updatePayload.approvedQuantities = request.requestedItems.map(
          (requestedItem) => ({
            requestedItemId: requestedItem.item.id,
            quantity:
              approvedQuantities[requestedItem.item.id] ||
              requestedItem.requestedQuantity,
          })
        );
      }
      // For FULLFILLED status, we only need status and remark

      const { data } = await axiosInstance.patch<RequestResponse>(
        `/requests/${request.id}/status`,
        updatePayload
      );

      setRequest(data);
      setApprovalRemark("");
      setAlert({
        type: AlertType.SUCCESS,
        message: `Request ${newStatus.toLowerCase()} successfully`,
      });
    } catch (err: any) {
      console.error("Error updating request:", err);
      setAlert({
        type: AlertType.DANGER,
        message: err.message || "Failed to update request status",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    const statusStyles = {
      [RequestStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [RequestStatus.APPROVED]: "bg-green-100 text-green-800",
      [RequestStatus.REJECTED]: "bg-red-100 text-red-800",
      [RequestStatus.FULLFILLED]: "bg-blue-100 text-blue-800",
    };

    return (
      <span
        className={cn(
          "px-3 py-1 rounded-full text-sm font-medium",
          statusStyles[status]
        )}
      >
        {status}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || "Request not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {alert && (
        <Alert
          alertType={alert.type}
          title={alert.message}
          close={() => setAlert(null)}
        />
      )}

      <PageHeader title="Request Details" subtitle={`Request #${request.id}`}>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Request Information */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Request Information
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">{getStatusBadge(request.status)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Requested By
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.user.firstName} {request.user.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Department
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {request.user.userRoles[0]?.department.name}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Date Requested
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(request.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Requested Items */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Requested Items
            </h3>
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
                    {canApproveRequest &&
                      request.status === RequestStatus.PENDING && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Approved Qty
                        </th>
                      )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    {isStockKeeper &&
                      request.status === RequestStatus.APPROVED && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Actions
                        </th>
                      )}
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
                      {canApproveRequest &&
                        request.status === RequestStatus.PENDING && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={approvedQuantities[item.item.id] || 0}
                              onChange={(e) =>
                                handleApprovedQuantityChange(
                                  item.item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              min="0"
                              max={item.requestedQuantity}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </td>
                        )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.status)}
                      </td>
                      {isStockKeeper &&
                        request.status === RequestStatus.APPROVED && (
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.status !== RequestStatus.FULLFILLED ? (
                              <button
                                onClick={() => handleStatusUpdate(RequestStatus.FULLFILLED)}
                                disabled={isProcessing}
                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                              >
                                <PackageCheck className="h-4 w-4 mr-1" />
                                Mark Fulfilled
                              </button>
                            ) : (
                              <span className="text-sm text-green-600 font-medium">
                                Fulfilled
                              </span>
                            )}
                          </td>
                        )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Status Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Status Updates
            </h3>
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
                      {request.remark || "No remarks added"}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Approval Actions
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="remarkInput"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Remarks
                  </label>
                  <textarea
                    id="remarkInput"
                    value={approvalRemark}
                    onChange={(e) => setApprovalRemark(e.target.value)}
                    placeholder="Add remarks for your decision..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Show warning if any approved quantities are less than requested */}
                {Object.entries(approvedQuantities).some(
                  ([itemId, quantity]) => {
                    const requestedItem = request.requestedItems.find(
                      (item) => item.id === itemId
                    );
                    return (
                      requestedItem &&
                      quantity < requestedItem.requestedQuantity
                    );
                  }
                ) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      Some items have approved quantities less than requested.
                      Please ensure this is intended.
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusUpdate(RequestStatus.APPROVED)}
                    disabled={
                      isProcessing ||
                      Object.values(approvedQuantities).some((qty) => qty < 0)
                    }
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(RequestStatus.REJECTED)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Reject Request
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* Stock Keeper Actions */}
          {isStockKeeper && request.status === RequestStatus.APPROVED && (
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Stock Keeper Actions
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="fulfillmentRemark"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Fulfillment Remarks
                  </label>
                  <textarea
                    id="fulfillmentRemark"
                    value={approvalRemark}
                    onChange={(e) => setApprovalRemark(e.target.value)}
                    placeholder="Add remarks about the fulfillment..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Show progress of fulfillment */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Fulfillment Progress
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Items Fulfilled:</span>
                      <span>
                        {
                          request.requestedItems.filter(
                            (item) => item.status === RequestStatus.FULLFILLED
                          ).length
                        }
                        {" / "}
                        {request.requestedItems.length}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (request.requestedItems.filter(
                              (item) => item.status === RequestStatus.FULLFILLED
                            ).length /
                              request.requestedItems.length) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {request.requestedItems.every(
                  (item) => item.status === RequestStatus.FULLFILLED
                ) ? (
                  <button
                    onClick={() => handleStatusUpdate(RequestStatus.FULLFILLED)}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <PackageCheck className="h-4 w-4" />
                    )}
                    Complete Request Fulfillment
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 text-center">
                    Please fulfill all items before marking the request as
                    complete
                  </p>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsPage;
