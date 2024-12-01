/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/requests/NewRequestPage.tsx
import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

import { 
  CreateRequestInput,
  ItemResponse,
  RequestStatus
} from '@/types/api/types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { EmptyState } from '@/components/common/EmptyState';

interface RequestItem {
  itemId: string;
  requestedQuantity: number;
  currentStock?: number;
}

const NewRequestPage = () => {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [remark, setRemark] = useState('');
  const [errors, setErrors] = useState<{
    items?: string;
    remark?: string;
    [key: string]: string | undefined;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with actual data
  const availableItems: ItemResponse[] = [];

  const addItem = () => {
    setItems([...items, { itemId: '', requestedQuantity: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: keyof RequestItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // If itemId changed, get current stock
    if (field === 'itemId') {
      const selectedItem = availableItems.find(item => item.id === value);
      newItems[index].currentStock = selectedItem?.currentStock;
    }

    setItems(newItems);
    
    // Clear any errors for this item
    if (errors[`item${index}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`item${index}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (items.length === 0) {
      newErrors.items = 'Please add at least one item';
    }

    items.forEach((item, index) => {
      if (!item.itemId) {
        newErrors[`item${index}`] = 'Please select an item';
      }
      if (item.requestedQuantity <= 0) {
        newErrors[`quantity${index}`] = 'Quantity must be greater than 0';
      }
      if (item.currentStock !== undefined && item.requestedQuantity > item.currentStock) {
        newErrors[`quantity${index}`] = 'Requested quantity exceeds available stock';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const requestData: CreateRequestInput = {
        items: items.map(item => ({
          itemId: item.itemId,
          requestedQuantity: item.requestedQuantity
        })),
        remark
      };

      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form after success
      setItems([]);
      setRemark('');
      // Add success notification
    } catch (error) {
      console.error('Failed to create request:', error);
      // Add error notification
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Stock Request"
        subtitle="Request items from inventory"
      />

      <form onSubmit={handleSubmit}>
        <Card>
          <div className="p-6 space-y-6">
            {/* Request Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Requested Items
                </h2>
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium
                          text-primary-600 bg-primary-50 rounded-lg
                          hover:bg-primary-100"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              {errors.items && (
                <div className="mb-4 text-sm text-red-600">
                  {errors.items}
                </div>
              )}

              {items.length === 0 ? (
                <EmptyState
                  title="No items added"
                  description="Click the Add Item button to start your request"
                />
              ) : (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 items-start border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Item Selection */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Select Item
                          </label>
                          <select
                            value={item.itemId}
                            onChange={(e) => updateItem(index, 'itemId', e.target.value)}
                            className={cn(
                              "mt-1 block w-full rounded-md border-gray-300",
                              "focus:border-primary-500 focus:ring-primary-500",
                              errors[`item${index}`] && "border-red-300"
                            )}
                          >
                            <option value="">Select an item...</option>
                            {availableItems.map(item => (
                              <option key={item.id} value={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                          {errors[`item${index}`] && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors[`item${index}`]}
                            </p>
                          )}
                        </div>

                        {/* Quantity Input */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <input
                              type="number"
                              min="1"
                              value={item.requestedQuantity}
                              onChange={(e) => updateItem(
                                index, 
                                'requestedQuantity', 
                                parseInt(e.target.value) || 0
                              )}
                              className={cn(
                                "block w-full rounded-md border-gray-300",
                                "focus:border-primary-500 focus:ring-primary-500",
                                errors[`quantity${index}`] && "border-red-300"
                              )}
                            />
                            {item.currentStock !== undefined && (
                              <div className="mt-1 text-sm text-gray-500">
                                Available: {item.currentStock} units
                              </div>
                            )}
                            {errors[`quantity${index}`] && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors[`quantity${index}`]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Remark */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300
                         focus:border-primary-500 focus:ring-primary-500"
                placeholder="Add any additional notes or comments..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setItems([]);
                setRemark('');
              }}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white
                      border border-gray-300 rounded-md hover:bg-gray-50
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-primary-500 disabled:opacity-50"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600
                      border border-transparent rounded-md hover:bg-primary-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-primary-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default NewRequestPage;