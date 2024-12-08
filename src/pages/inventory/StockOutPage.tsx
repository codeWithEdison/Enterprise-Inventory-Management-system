/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageMinus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import axiosInstance from '@/lib/axios';
import { ItemResponse, LocationResponse, TransactionType, StockResponse } from '@/types/api/types'; 

interface StockOutItem {
  itemId: string;
  quantity: number;
  locationId: string;
  reason?: string;
  availableStock?: number;
  isCheckingStock?: boolean;
}

const StockOutPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockOutItems, setStockOutItems] = useState<StockOutItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [itemsResponse, locationsResponse] = await Promise.all([
          axiosInstance.get<ItemResponse[]>('/items'),
          axiosInstance.get<LocationResponse[]>('/locations')
        ]);

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

  const checkItemStock = async (itemId: string, locationId: string): Promise<number> => {
    try {
      const response = await axiosInstance.get<StockResponse[]>(`/stock/${itemId}`);
      const locationStock = response.data.find(stock => stock.locationId === locationId);
      return locationStock?.balance || 0;
    } catch (error) {
      console.error('Error checking stock:', error);
      return 0;
    }
  };

  const updateItemStock = async (index: number) => {
    const item = stockOutItems[index];
    setStockOutItems(prev => prev.map((i, idx) => 
      idx === index ? { ...i, isCheckingStock: true } : i
    ));

    const availableStock = await checkItemStock(item.itemId, item.locationId);
    
    setStockOutItems(prev => prev.map((i, idx) => 
      idx === index ? { 
        ...i, 
        availableStock,
        isCheckingStock: false
      } : i
    ));
  };

  const handleAddItem = () => {
    if (items.length === 0 || locations.length === 0) return;

    const newItem = {
      itemId: items[0].id,
      quantity: 1,
      locationId: locations[0].id,
      reason: ''
    };

    setStockOutItems(prev => [...prev, newItem]);
    updateItemStock(stockOutItems.length); // Check stock for the new item
  };

  const handleRemoveItem = (index: number) => {
    setStockOutItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = async (index: number, updates: Partial<StockOutItem>) => {
    setStockOutItems(prev => prev.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));

    // If item or location changed, check new stock level
    if (updates.itemId || updates.locationId) {
      await updateItemStock(index);
    }
  };

  const validateInputs = (): string | null => {
    if (stockOutItems.length === 0) {
      return 'Please add at least one item';
    }

    for (const item of stockOutItems) {
      if (item.quantity <= 0) {
        return 'Quantity must be greater than 0';
      }

      if (item.availableStock !== undefined && item.quantity > item.availableStock) {
        const selectedItem = items.find(i => i.id === item.itemId);
        return `Insufficient stock for ${selectedItem?.name}. Available: ${item.availableStock}`;
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

      const requestBody = {
        transactions: stockOutItems.map(({ itemId, quantity, locationId, reason }) => ({
          itemId,
          quantity,
          locationId,
          reason,
          transactionType: TransactionType.OUT
        }))
      };

      await axiosInstance.post('/transactions', requestBody);
      navigate('/inventory', { 
        state: { message: 'Stock out recorded successfully' } 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process stock out. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Out"
        subtitle="Record outgoing stock"
      />

      {error && (
        <Alert
          alertType={AlertType.DANGER}
          title={error}
          close={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {stockOutItems.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                No items added. Click "Add Item" to start.
              </div>
            )}

            <div className="space-y-4">
              {stockOutItems.map((stockOutItem, index) => {
                const selectedItem = items.find(i => i.id === stockOutItem.itemId);
                const isLowStock = stockOutItem.availableStock !== undefined && 
                                 stockOutItem.quantity > stockOutItem.availableStock;

                return (
                  <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item
                      </label>
                      <select
                        value={stockOutItem.itemId}
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
                        value={stockOutItem.quantity.toString()}
                        onChange={(e) => handleUpdateItem(index, { 
                          quantity: parseInt(e.target.value) || 0 
                        })}
                        min="1"
                        className="bg-gray-50 focus:bg-white"
                        error={isLowStock ? 'Insufficient stock' : undefined}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {stockOutItem.isCheckingStock ? (
                          "Checking stock..."
                        ) : (
                          `Available: ${stockOutItem.availableStock || 0}`
                        )}
                      </p>
                    </div>

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        value={stockOutItem.locationId}
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
                        value={stockOutItem.reason || ''}
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
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>

            {stockOutItems.some(item => 
              item.availableStock !== undefined && item.quantity > item.availableStock
            ) && (
              <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm">
                  Some items exceed available stock levels. Please adjust quantities.
                </p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting || 
              stockOutItems.length === 0 ||
              stockOutItems.some(item => 
                item.availableStock !== undefined && item.quantity > item.availableStock
              )
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <PackageMinus className="h-4 w-4" />
            {isSubmitting ? 'Processing...' : 'Record Stock Out'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockOutPage;