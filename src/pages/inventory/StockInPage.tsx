/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/StockInPage.tsx
import React, { useState } from 'react';
import { 
  ItemResponse, 
  LocationResponse,
  CreateTransactionInput,
  TransactionType 
} from '@/types/api/types';
import { Plus } from 'lucide-react';
import Modal, { ModalSize } from '@/components/common/Modal';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';

interface StockInFormData {
  itemId: string;
  locationId: string;
  quantity: number;
  reason?: string;
}

const StockInPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<StockInFormData>({
    itemId: '',
    locationId: '',
    quantity: 0
  });
  const [errors, setErrors] = useState<Partial<Record<keyof StockInFormData, string>>>({});

  // Mock data - replace with actual data
  const items: ItemResponse[] = [];
  const locations: LocationResponse[] = [];

  const validateForm = () => {
    const newErrors: Partial<Record<keyof StockInFormData, string>> = {};
    
    if (!formData.itemId) newErrors.itemId = 'Please select an item';
    if (!formData.locationId) newErrors.locationId = 'Please select a location';
    if (formData.quantity <= 0) newErrors.quantity = 'Quantity must be greater than 0';

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
        transactionType: TransactionType.IN,
        reason: formData.reason
      };

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsModalOpen(false);
      // Add success notification
    } catch (error) {
      console.error('Failed to create stock in transaction:', error);
      // Add error notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock In"
        subtitle="Record new stock arrivals and inventory additions"
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
                   flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Record Stock In
        </button>
      </PageHeader>

      {/* Stock In Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => !isLoading && setIsModalOpen(false)}
        title="Record Stock In"
        widthSizeClass={ModalSize.medium}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Item
            </label>
            <select
              value={formData.itemId}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, itemId: e.target.value }));
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select Location
            </label>
            <select
              value={formData.locationId}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, locationId: e.target.value }));
                if (errors.locationId) setErrors(prev => ({ ...prev, locationId: undefined }));
              }}
              className={cn(
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.locationId && "border-red-300"
              )}
              disabled={isLoading}
            >
              <option value="">Select a location...</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {errors.locationId && (
              <p className="mt-1 text-sm text-red-600">{errors.locationId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }));
                if (errors.quantity) setErrors(prev => ({ ...prev, quantity: undefined }));
              }}
              className={cn(
                "mt-1 block w-full rounded-md border-gray-300 shadow-sm",
                "focus:border-primary-500 focus:ring-primary-500 sm:text-sm",
                errors.quantity && "border-red-300"
              )}
              disabled={isLoading}
            />
            {errors.quantity && (
              <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
            )}
          </div>

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
              {isLoading ? 'Recording...' : 'Record Stock In'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Recent Stock In Transactions */}
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Stock In Transactions</h2>
          {/* Add transaction table or list here */}
        </div>
      </Card>
    </div>
  );
};

export default StockInPage;