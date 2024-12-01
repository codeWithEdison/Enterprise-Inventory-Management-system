/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/StockTransferPage.tsx
import React, { useState } from 'react';
import { 
  ItemResponse, 
  LocationResponse,
  CreateTransactionInput,
  TransactionType,
  StockResponse 
} from '@/types/api/types';
import { Plus, AlertTriangle } from 'lucide-react';
import Modal, { ModalSize } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';

interface TransferFormData {
  itemId: string;
  sourceLocationId: string;
  destinationLocationId: string;
  quantity: number;
  reason?: string;
}

const StockTransferPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransferFormData>({
    itemId: '',
    sourceLocationId: '',
    destinationLocationId: '',
    quantity: 0
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TransferFormData, string>>>({});
  const [selectedItemStock, setSelectedItemStock] = useState<number | null>(null);

  // Mock data - replace with actual data from your store/API
  const items: ItemResponse[] = [];
  const locations: LocationResponse[] = [];
  const stocks: StockResponse[] = [];

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TransferFormData, string>> = {};
    
    if (!formData.itemId) {
      newErrors.itemId = 'Please select an item';
    }
    
    if (!formData.sourceLocationId) {
      newErrors.sourceLocationId = 'Please select source location';
    }
    
    if (!formData.destinationLocationId) {
      newErrors.destinationLocationId = 'Please select destination location';
    }
    
    if (formData.sourceLocationId === formData.destinationLocationId) {
      newErrors.destinationLocationId = 'Source and destination cannot be the same';
    }
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }
    
    if (selectedItemStock !== null && formData.quantity > selectedItemStock) {
      newErrors.quantity = 'Transfer quantity cannot exceed available stock';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleItemLocationChange = () => {
    const stock = stocks.find(s => 
      s.itemId === formData.itemId && 
      s.locationId === formData.sourceLocationId
    );
    setSelectedItemStock(stock?.balance || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Here you would make two transactions:
      // 1. OUT from source location
      // 2. IN to destination location
      
      // Example of how the transactions might look:
      const outTransaction: CreateTransactionInput = {
        itemId: formData.itemId,
        locationId: formData.sourceLocationId,
        quantity: formData.quantity,
        transactionType: TransactionType.OUT,
        reason: `Transfer to ${formData.destinationLocationId}: ${formData.reason || ''}`
      };

      const inTransaction: CreateTransactionInput = {
        itemId: formData.itemId,
        locationId: formData.destinationLocationId,
        quantity: formData.quantity,
        transactionType: TransactionType.IN,
        reason: `Transfer from ${formData.sourceLocationId}: ${formData.reason || ''}`
      };

      // API calls would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsModalOpen(false);
      // Add success notification
    } catch (error) {
      console.error('Failed to create transfer:', error);
      // Add error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfer"
        subtitle="Transfer stock between different locations"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
                   flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          New Transfer
        </button>
      </PageHeader>

      {/* Transfer Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title="Stock Transfer"
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
                  sourceLocationId: '',
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

          {/* Source Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              From Location
            </label>
            <select
              value={formData.sourceLocationId}
              onChange={(e) => {
                setFormData(prev => ({ 
                  ...prev, 
                  sourceLocationId: e.target.value,
                  quantity: 0
                }));
                if (errors.sourceLocationId) {
                  setErrors(prev => ({ ...prev, sourceLocationId: undefined }));
                }
                handleItemLocationChange();
              }}
              className={cn(
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.sourceLocationId && "border-red-300"
              )}
              disabled={isLoading || !formData.itemId}
            >
              <option value="">Select source location...</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.sourceLocationId && (
              <p className="mt-1 text-sm text-red-600">{errors.sourceLocationId}</p>
            )}
            {selectedItemStock !== null && (
              <p className="mt-1 text-sm text-gray-500">
                Available stock: {selectedItemStock} units
              </p>
            )}
          </div>

          {/* Destination Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              To Location
            </label>
            <select
              value={formData.destinationLocationId}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, destinationLocationId: e.target.value }));
                if (errors.destinationLocationId) {
                  setErrors(prev => ({ ...prev, destinationLocationId: undefined }));
                }
              }}
              className={cn(
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.destinationLocationId && "border-red-300"
              )}
              disabled={isLoading || !formData.sourceLocationId}
            >
              <option value="">Select destination location...</option>
              {locations
                .filter(loc => loc.id !== formData.sourceLocationId)
                .map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))
              }
            </select>
            {errors.destinationLocationId && (
              <p className="mt-1 text-sm text-red-600">{errors.destinationLocationId}</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Transfer Quantity
            </label>
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
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.quantity && "border-red-300"
              )}
              disabled={isLoading || !formData.destinationLocationId}
            />
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
              placeholder="Enter reason for transfer..."
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
              {isLoading ? 'Processing...' : 'Transfer Stock'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Recent Transfers */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Transfers</h2>
          {/* Add transfer history table here */}
        </div>
      </Card>
    </div>
  );
};

export default StockTransferPage;