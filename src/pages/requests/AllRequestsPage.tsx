/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/requests/AllRequestsPage.tsx
import React, { useState } from "react";
import {
  Clock,
  CheckCircle2,
  XCircle,
  FilterX,
  Download,
  //   CalendarRange,
  Building2,
} from "lucide-react";

import {
  RequestResponse,
  RequestStatus,
  RequestFilterParams,
  DepartmentResponse,
} from "@/types/api/types";
import Modal, { ModalSize } from "@/components/common/Modal";
import { cn } from "@/lib/utils";
import Pagination from "@/components/common/Pagination";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/common/Card";
import { SearchInput } from "@/components/common/SearchInput";
import { EmptyState } from "@/components/common/EmptyState";

const PAGE_SIZE = 10;

const AllRequestsPage = () => {
  // States for filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    sortOrder: "desc",
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
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data - replace with actual data
  const allRequests: RequestResponse[] = [];
  const departments: DepartmentResponse[] = [];

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
        return "text-yellow-700 bg-yellow-50";
      case RequestStatus.APPROVED:
        return "text-blue-700 bg-blue-50";
      case RequestStatus.REJECTED:
        return "text-red-700 bg-red-50";
      case RequestStatus.FULLFILLED:
        return "text-green-700 bg-green-50";
      default:
        return "text-gray-700 bg-gray-50";
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
      console.error("Export failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (request: RequestResponse) => {
    setSelectedRequest(request);
    setIsDetailModalOpen(true);
  };

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
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg",
                "border border-gray-300 hover:bg-gray-50",
                showFilters && "bg-primary-50 border-primary-300"
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
                  value={filters.status || ""}
                  onChange={(e) =>
                    handleFilterChange("status", e.target.value || undefined)
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
                  value={filters.departmentId || ""}
                  onChange={(e) =>
                    handleFilterChange(
                      "departmentId",
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
                            {index < request.requestedItems.length - 1 && ", "}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(request.status)}
                        <span
                          className={cn(
                            "ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium",
                            getStatusColor(request.status)
                          )}
                        >
                          {request.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(request)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        View
                      </button>
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
            onPageChange={(page) => handleFilterChange("page", page)}
            pageSize={PAGE_SIZE}
            totalItems={allRequests.length}
            className="border-t"
          />
        )}
      </Card>

      {/* Request Details Modal - Same as in MyRequestsPage */}
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
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(selectedRequest.status)
                  )}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(selectedRequest.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Requester Info */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedRequest.user.firstName}{" "}
                  {selectedRequest.user.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedRequest.user.userRoles[0]?.department.name}
                </p>
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
                        <div>Requested: {item.requestedQuantity} units</div>
                        {item.approvedQuantity !== undefined && (
                          <div className="text-primary-600">
                            Approved: {item.approvedQuantity} units
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Remarks */}
            {(selectedRequest.remark || selectedRequest.approvedBy) && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Additional Information
                </h3>
                {selectedRequest.remark && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700">
                      Remark
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedRequest.remark}
                    </p>
                  </div>
                )}
                {selectedRequest.approvedBy && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">
                      Processed By
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedRequest.approvedBy}
                      <span className="text-gray-400 mx-2">•</span>
                      {new Date(selectedRequest.updatedAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Timeline */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Request Timeline
              </h3>
              <div className="flow-root">
                <ul className="-mb-8">
                  {/* Created */}
                  <li>
                    <div className="relative pb-8">
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" />
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-white" />
                          </span>
                        </div>
                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                          <div>
                            <p className="text-sm text-gray-500">
                              Request created
                            </p>
                          </div>
                          <div className="whitespace-nowrap text-right text-sm text-gray-500">
                            {new Date(
                              selectedRequest.createdAt
                            ).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>

                  {/* Approved/Rejected */}
                  {selectedRequest.approvedBy && (
                    <li>
                      <div className="relative pb-8">
                        <div className="relative flex space-x-3">
                          <div>
                            <span
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center",
                                selectedRequest.status ===
                                  RequestStatus.APPROVED
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              )}
                            >
                              {selectedRequest.status ===
                              RequestStatus.APPROVED ? (
                                <CheckCircle2 className="h-5 w-5 text-white" />
                              ) : (
                                <XCircle className="h-5 w-5 text-white" />
                              )}
                            </span>
                          </div>
                          <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                            <div>
                              <p className="text-sm text-gray-500">
                                Request {selectedRequest.status.toLowerCase()}
                              </p>
                            </div>
                            <div className="whitespace-nowrap text-right text-sm text-gray-500">
                              {new Date(
                                selectedRequest.updatedAt
                              ).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AllRequestsPage;
