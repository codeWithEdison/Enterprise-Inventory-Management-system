/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/StockOutPage.tsx
import React, { useState, useEffect } from 'react';

import { 
  ItemResponse, 
  LocationResponse,
  CreateTransactionInput,
  TransactionType,
  StockResponse, 
  TransactionResponse
} from '@/types/api/types';
import { Plus, AlertTriangle } from 'lucide-react';
import Modal, { ModalSize } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import Pagination from '@/components/common/Pagination';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import TransactionsTable from './TransactionsTable';
import { mockTransactions } from '@/lib/mock-data';

interface StockOutFormData {
  itemId: string;
  locationId: string;
  quantity: number;
  reason?: string;
}

const StockOutPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItemStock, setSelectedItemStock] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [formData, setFormData] = useState<StockOutFormData>({
    itemId: '',
    locationId: '',
    quantity: 0
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StockOutFormData, string>>>({});

  // Mock data - replace with actual data
  const items: ItemResponse[] = [];
  const locations: LocationResponse[] = [];
  const stocks: StockResponse[] = [];

  const PAGE_SIZE = 10;

  const validateForm = () => {
    const newErrors: Partial<Record<keyof StockOutFormData, string>> = {};
    
    if (!formData.itemId) {
      newErrors.itemId = 'Please select an item';
    }
    
    if (!formData.locationId) {
      newErrors.locationId = 'Please select location';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (selectedItemStock !== null && formData.quantity > selectedItemStock) {
      newErrors.quantity = 'Release quantity cannot exceed available stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const transactionData: CreateTransactionInput = {
        itemId: formData.itemId,
        locationId: formData.locationId,
        quantity: formData.quantity,
        transactionType: TransactionType.OUT,
        reason: formData.reason
      };

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsModalOpen(false);
      // Add success notification
    } catch (error) {
      console.error('Failed to create stock out transaction:', error);
      // Add error notification
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (locationId: string) => {
    setFormData(prev => ({ ...prev, locationId, quantity: 0 }));
    const stock = stocks.find(s => 
      s.itemId === formData.itemId && 
      s.locationId === locationId
    );
    setSelectedItemStock(stock?.balance || 0);
    if (errors.locationId) {
      setErrors(prev => ({ ...prev, locationId: undefined }));
    }
  };

  const [filterStatus, setFilterStatus] = useState<'all' | TransactionType>('all');

// Filter transactions
const filteredTransactions = mockTransactions
  .filter(transaction => {
    const matchesSearch = !searchQuery || 
      transaction.item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reason?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.location.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterStatus === 'all' || 
      transaction.transactionType === filterStatus;
    
    return matchesSearch && matchesType;
  })
  .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

const handleViewDetails = (transaction: TransactionResponse) => {
  // Implement view details modal here
  console.log('View transaction details:', transaction);
};

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Out"
        subtitle="Record stock releases and inventory reductions"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
                   flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Record Stock Out
        </button>
      </PageHeader>

      {/* Stock Out Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title="Record Stock Out"
        widthSizeClass={ModalSize.medium}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Item Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Item
            </label>
            <select
              value={formData.itemId}
              onChange={(e) => {
                setFormData(prev => ({ 
                  ...prev, 
                  itemId: e.target.value,
                  locationId: '',
                  quantity: 0
                }));
                setSelectedItemStock(null);
                if (errors.itemId) setErrors(prev => ({ ...prev, itemId: undefined }));
              }}
              className={cn(
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.itemId && "border-red-300"
              )}
              disabled={isLoading}
            >
              <option value="">Select an item...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            {errors.itemId && (
              <p className="mt-1 text-sm text-red-600">{errors.itemId}</p>
            )}
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Location
            </label>
            <select
              value={formData.locationId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className={cn(
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.locationId && "border-red-300"
              )}
              disabled={isLoading || !formData.itemId}
            >
              <option value="">Select location...</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>
            )}
            {selectedItemStock !== null && (
              <p className="mt-1 text-sm text-gray-500">
                Available stock: {selectedItemStock} units
              </p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity to Release
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                min="1"
                max={selectedItemStock || undefined}
                value={formData.quantity}
                onChange={(e) => {
                  setFormData(prev => ({ 
                    ...prev, 
                    quantity: parseInt(e.target.value) || 0 
                  }));
                  if (errors.quantity) {
                    setErrors(prev => ({ ...prev, quantity: undefined }));
                  }
                }}
                className={cn(
                  "block w-full rounded-md sm:text-sm",
                  "border-gray-300 focus:ring-primary-500 focus:border-primary-500",
                  errors.quantity && "border-red-300"
                )}
                disabled={isLoading || !formData.locationId}
              />
              {selectedItemStock !== null && formData.quantity > selectedItemStock && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
              )}
            </div>
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

          {/* Reason/Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reason/Notes
            </label>
            <textarea
              value={formData.reason || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm
                       focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
              disabled={isLoading}
              placeholder="Enter reason for stock out..."
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium
                       text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium
                       hover:bg-primary-700 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Record Stock Out'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Recent Stock Out Transactions */}
      <Card>
        <div className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Stock Out Transactions
            </h2>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search transactions..."
                className="w-full sm:w-64"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | TransactionType)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Types</option>
                {Object.values(TransactionType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <TransactionsTable
              transactions={filteredTransactions}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />
          </div>

          {/* Only show pagination if we have items */}
          {filteredTransactions.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(filteredTransactions.length / PAGE_SIZE)}
              onPageChange={setCurrentPage}
              pageSize={PAGE_SIZE}
              totalItems={filteredTransactions.length}
              className="mt-4"
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default StockOutPage;