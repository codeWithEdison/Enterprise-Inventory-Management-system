/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CreateRequestInput, ItemResponse } from '@/types/api/types';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import axiosInstance from '@/lib/axios';

interface RequestItem {
  itemId: string;
  requestedQuantity: number;
  availableStock?: number;
}

const NewRequestPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [requestItems, setRequestItems] = useState<RequestItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [remark, setRemark] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<ItemResponse[]>('/items');
        setItems(response.data.filter(item => item.status === 'ACTIVE'));
      } catch (err: any) {
        setError(err.message || 'Failed to load items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const checkItemStock = async (itemId: string): Promise<number> => {
    try {
      const response = await axiosInstance.get<any>(`/stock/${itemId}`);
      return response.data.reduce((sum: number, stock: any) => sum + stock.balance, 0);
    } catch (error) {
      console.error('Error checking stock:', error);
      return 0;
    }
  };

  const handleAddItem = () => {
    if (items.length === 0) return;
    setRequestItems([
      ...requestItems,
      {
        itemId: items[0].id,
        requestedQuantity: 1
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setRequestItems(requestItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = async (index: number, field: keyof RequestItem, value: string | number) => {
    const newItems = [...requestItems];
    newItems[index] = { ...newItems[index] };

    if (field === 'itemId') {
      newItems[index].itemId = value as string;
      const availableStock = await checkItemStock(value as string);
      newItems[index].availableStock = availableStock;
    } else if (field === 'requestedQuantity') {
      newItems[index].requestedQuantity = Number(value) || 0;
    }

    setRequestItems(newItems);
    setError(null);
  };

  const validateInputs = (): string | null => {
    if (requestItems.length === 0) {
      return 'Please add at least one item';
    }

    for (const item of requestItems) {
      if (!item.itemId) {
        return 'Please select an item';
      }
      if (item.requestedQuantity <= 0) {
        return 'Quantity must be greater than 0';
      }
      if (item.availableStock !== undefined && item.requestedQuantity > item.availableStock) {
        return 'Requested quantity exceeds available stock';
      }
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateInputs();
    
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const requestData: CreateRequestInput = {
        items: requestItems.map(item => ({
          itemId: item.itemId,
          requestedQuantity: item.requestedQuantity
        })),
        remark
      };

      await axiosInstance.post('/requests', requestData);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/requests', { 
          state: { message: 'Request submitted successfully' } 
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="New Stock Request"
        subtitle="Request items from inventory"
      />

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <p>Request submitted successfully! Redirecting...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Requested Items</h2>

            {requestItems.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No items added. Click "Add Item" to start.
              </div>
            )}

            <div className="space-y-4">
              {requestItems.map((item, index) => (
                <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                  <div className="flex-1">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item
                      </label>
                      <select
                        value={item.itemId}
                        onChange={(e) => handleUpdateItem(index, 'itemId', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-my-blue rounded-md bg-gray-50 focus:bg-white"
                      >
                        <option value="">Select an item...</option>
                        {items.map(option => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="w-32">
                    <Input
                      title="Quantity"
                      type="number"
                      value={item.requestedQuantity}
                      onChange={(e) => handleUpdateItem(index, 'requestedQuantity', e.target.value)}
                      min="1"
                      className="bg-gray-50 focus:bg-white"
                    />
                    {item.availableStock !== undefined && (
                      <p className="mt-1 text-xs text-gray-500">
                        Available: {item.availableStock} units
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="mt-7 p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark
              </label>
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-my-blue rounded-md bg-gray-50 focus:bg-white"
                placeholder="Add any additional notes or comments..."
              />
              <p className="mt-1 text-xs text-gray-500">
                Optional: Provide any additional information about your request
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || requestItems.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewRequestPage;
