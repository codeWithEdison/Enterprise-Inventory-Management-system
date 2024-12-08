/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftRight, 
  Plus, 
  Trash2, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import axiosInstance from '@/lib/axios';
import { ItemResponse, LocationResponse, StockResponse } from '@/types/api/types';

interface TransferItem {
  itemId: string;
  quantity: number;
  fromLocationId: string;
  toLocationId: string;
  reason?: string;
  availableStock?: number;
  isCheckingStock?: boolean;
}

const StockTransferPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transferItems, setTransferItems] = useState<TransferItem[]>([]);
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
    const item = transferItems[index];
    setTransferItems(prev => prev.map((i, idx) => 
      idx === index ? { ...i, isCheckingStock: true } : i
    ));

    const availableStock = await checkItemStock(item.itemId, item.fromLocationId);
    
    setTransferItems(prev => prev.map((i, idx) => 
      idx === index ? { 
        ...i, 
        availableStock,
        isCheckingStock: false
      } : i
    ));
  };

  const handleAddItem = () => {
    if (items.length === 0 || locations.length < 2) return;

    const newItem = {
      itemId: items[0].id,
      quantity: 1,
      fromLocationId: locations[0].id,
      toLocationId: locations[1].id,
      reason: ''
    };

    setTransferItems(prev => [...prev, newItem]);
    updateItemStock(transferItems.length); // Check stock for new item
  };

  const handleRemoveItem = (index: number) => {
    setTransferItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateItem = async (index: number, updates: Partial<TransferItem>) => {
    setTransferItems(prev => prev.map((item, i) => 
      i === index ? { ...item, ...updates } : item
    ));

    // If item or source location changed, check new stock level
    if (updates.itemId || updates.fromLocationId) {
      await updateItemStock(index);
    }
  };

  const validateTransfer = (): string | null => {
    if (transferItems.length === 0) {
      return 'Please add at least one item to transfer';
    }

    for (const item of transferItems) {
      if (item.fromLocationId === item.toLocationId) {
        return 'Source and destination locations must be different';
      }

      if (item.quantity <= 0) {
        return 'Transfer quantity must be greater than 0';
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
    
    const validationError = validateTransfer();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const requestBody = {
        transfers: transferItems.map(({ itemId, quantity, fromLocationId, toLocationId, reason }) => ({
          itemId,
          quantity,
          fromLocationId,
          toLocationId,
          reason
        }))
      };

      await axiosInstance.post('/stock/transfer', requestBody);
      
      navigate('/inventory', { 
        state: { message: 'Stock transfer processed successfully' } 
      });
    } catch (err: any) {
      setError(err.message || 'Failed to process stock transfer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Transfer"
        subtitle="Transfer stock between locations"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Back
        </button>
      </PageHeader>

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
            <div className="space-y-4">
              {transferItems.map((transferItem, index) => {
                const selectedItem = items.find(i => i.id === transferItem.itemId);
                const isInsufficientStock = transferItem.availableStock !== undefined && 
                                          transferItem.quantity > transferItem.availableStock;

                return (
                  <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Item
                      </label>
                      <select
                        value={transferItem.itemId}
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

                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Location
                      </label>
                      <select
                        value={transferItem.fromLocationId}
                        onChange={(e) => handleUpdateItem(index, { fromLocationId: e.target.value })}
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Location
                      </label>
                      <select
                        value={transferItem.toLocationId}
                        onChange={(e) => handleUpdateItem(index, { toLocationId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        {locations
                          .filter(loc => loc.id !== transferItem.fromLocationId)
                          .map(location => (
                            <option key={location.id} value={location.id}>
                              {location.name}
                            </option>
                          ))
                        }
                      </select>
                    </div>

                    <div className="w-32">
                      <Input
                        title="Quantity"
                        type="number"
                        value={transferItem.quantity.toString()}
                        onChange={(e) => handleUpdateItem(index, { 
                          quantity: parseInt(e.target.value) || 0 
                        })}
                        min="1"
                        className="bg-gray-50 focus:bg-white"
                        error={isInsufficientStock ? 'Insufficient stock' : undefined}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        {transferItem.isCheckingStock ? (
                          "Checking stock..."
                        ) : (
                          `Available: ${transferItem.availableStock || 0}`
                        )}
                      </p>
                    </div>

                    <div className="flex-1">
                      <Input
                        title="Reason"
                        type="text"
                        value={transferItem.reason || ''}
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

              {transferItems.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <ArrowLeftRight className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p>No items added for transfer yet.</p>
                  <p className="text-sm">Click "Add Item" to start.</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>

            {transferItems.length > 0 && (
              <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    {locations.find(l => l.id === transferItems[0].fromLocationId)?.name}
                  </p>
                  <p className="text-xs text-gray-500">Source</p>
                </div>
                <ArrowRight className="h-5 w-5 text-gray-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">
                    {locations.find(l => l.id === transferItems[0].toLocationId)?.name}
                  </p>
                  <p className="text-xs text-gray-500">Destination</p>
                </div>
              </div>
            )}

            {transferItems.some(item => 
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
              transferItems.length === 0 ||
              transferItems.some(item => 
                item.availableStock !== undefined && item.quantity > item.availableStock
              )
            }
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <ArrowLeftRight className="h-4 w-4" />
            {isSubmitting ? 'Processing...' : 'Process Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockTransferPage;