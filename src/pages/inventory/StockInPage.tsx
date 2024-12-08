/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import axiosInstance from '@/lib/axios';
import { 
  ItemResponse, 
  LocationResponse, 
  TransactionType,
  CreateTransactionInput 
} from '@/types/api/types';

interface StockInItem extends Omit<CreateTransactionInput, 'transactionType'> {
  itemId: string;
  locationId: string;
  quantity: number;
  reason?: string;
}

const StockInPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockInItems, setStockInItems] = useState<StockInItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [itemsResponse, locationsResponse] = await Promise.all([
          axiosInstance.get<ItemResponse[]>('/items'),
          axiosInstance.get<LocationResponse[]>('/locations')
        ]);

        // Filter only active items and locations
        const activeItems = itemsResponse.data.filter(item => item.status === 'ACTIVE');
        const activeLocations = locationsResponse.data.filter(location => location.status === 'ACTIVE');

        setItems(activeItems);
        setLocations(activeLocations);
      } catch (error: any) {
        setError(error.message || 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    if (items.length === 0 || locations.length === 0) return;

    setStockInItems([
      ...stockInItems,
      {
        itemId: items[0].id,
        quantity: 1,
        locationId: locations[0].id,
        reason: ''
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setStockInItems(stockInItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<StockInItem>) => {
    setStockInItems(
      stockInItems.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  };

  const validateInputs = (): string | null => {
    if (stockInItems.length === 0) {
      return 'Please add at least one item';
    }

    for (const item of stockInItems) {
      if (item.quantity <= 0) {
        return 'Quantity must be greater than 0';
      }

      const selectedItem = items.find(i => i.id === item.itemId);
      if (!selectedItem) {
        return 'Invalid item selected';
      }

      const selectedLocation = locations.find(l => l.id === item.locationId);
      if (!selectedLocation) {
        return 'Invalid location selected';
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

      // Create transactions with the correct format
      const requestBody = {
        transactions: stockInItems.map(item => ({
          ...item,
          transactionType: TransactionType.IN
        }))
      };

      await axiosInstance.post('/transactions', requestBody);

      // Show success message and navigate
      navigate('/inventory', { 
        state: { message: 'Stock in recorded successfully' } 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process stock in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock In"
        subtitle="Record incoming stock"
      />

      {error && (
        <Alert
          alertType={AlertType.DANGER}
          title={error}
          close={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-6">
            {stockInItems.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No items added. Click "Add Item" to start.
              </div>
            )}

            {stockInItems.map((stockInItem, index) => (
              <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Item
                  </label>
                  <select
                    value={stockInItem.itemId}
                    onChange={(e) => handleUpdateItem(index, { itemId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {items.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-32">
                  <Input
                    title="Quantity"
                    type="number"
                    value={stockInItem.quantity.toString()}
                    onChange={(e) => handleUpdateItem(index, { 
                      quantity: parseInt(e.target.value) || 0 
                    })}
                    min="1"
                    className="bg-gray-50 focus:bg-white"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <select
                    value={stockInItem.locationId}
                    onChange={(e) => handleUpdateItem(index, { locationId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <Input
                    title="Reason"
                    type="text"
                    value={stockInItem.reason || ''}
                    onChange={(e) => handleUpdateItem(index, { reason: e.target.value })}
                    // placeholder="Optional"
                    className="bg-gray-50 focus:bg-white"
                  />
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

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>
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
            disabled={isSubmitting || stockInItems.length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <PackageCheck className="h-4 w-4" />
            {isSubmitting ? 'Processing...' : 'Record Stock In'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockInPage;