/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/StockTransferPage.tsx
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
import { mockApi } from '@/services/mockApi';
import { ItemResponse, LocationResponse } from '@/types/api/types';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import { mockLocations } from '@/lib/mock-data';

interface TransferItem {
  itemId: string;
  quantity: number;
  fromLocationId: string;
  toLocationId: string;
  reason?: string;
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
        const [itemsData, locationsData] = await Promise.all([
          mockApi.items.getItems(),
          Promise.resolve(mockLocations) 
        ]);
        setItems(itemsData);
        setLocations(locationsData);
      } catch (error) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = () => {
    if (items.length === 0 || locations.length < 2) return;

    setTransferItems([
      ...transferItems,
      {
        itemId: items[0].id,
        quantity: 0,
        fromLocationId: locations[0].id,
        toLocationId: locations[1].id,
        reason: ''
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setTransferItems(transferItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<TransferItem>) => {
    setTransferItems(
      transferItems.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  };

  const validateTransfer = (): boolean => {
    for (const transferItem of transferItems) {
      if (transferItem.fromLocationId === transferItem.toLocationId) {
        setError('Source and destination locations must be different');
        return false;
      }

      const item = items.find(i => i.id === transferItem.itemId);
      if (!item?.currentStock || transferItem.quantity > item.currentStock) {
        setError(`Insufficient stock for ${item?.name}. Available: ${item?.currentStock}`);
        return false;
      }

      if (transferItem.quantity <= 0) {
        setError('Transfer quantity must be greater than 0');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (transferItems.length === 0) {
      setError('Please add at least one item to transfer');
      return;
    }

    if (!validateTransfer()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Add your stock transfer logic here
      // For each item:
      // 1. Reduce stock in source location
      // 2. Increase stock in destination location
      // 3. Create transfer record

      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call
      navigate('/inventory');
    } catch (err) {
      setError('Failed to process stock transfer. Please try again.');
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
            {/* Transfer Items */}
            <div className="space-y-4">
              {transferItems.map((transferItem, index) => {
                const selectedItem = items.find(i => i.id === transferItem.itemId);
                const isInsufficientStock = selectedItem?.currentStock !== undefined && 
                                          transferItem.quantity > selectedItem.currentStock;

                return (
                  <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                    {/* Item Selection */}
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
                            {item.name} ({item.currentStock || 0} in stock)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Source Location */}
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

                    {/* Destination Location */}
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

                    {/* Quantity */}
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
                      {selectedItem && (
                        <p className="mt-1 text-xs text-gray-500">
                          Available: {selectedItem.currentStock || 0}
                        </p>
                      )}
                    </div>

                    {/* Reason */}
                    <div className="flex-1">
                      <Input
                        title="Reason"
                        type="text"
                        value={transferItem.reason || ''}
                        onChange={(e) => handleUpdateItem(index, { 
                          reason: e.target.value 
                        })}
                        className="bg-gray-50 focus:bg-white"
                        // placeholder="Reason for transfer"
                      />
                    </div>

                    {/* Remove Button */}
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

            {/* Add Item Button */}
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>

            {/* Transfer Direction */}
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

            {/* Validation Warnings */}
            {transferItems.some(item => {
              const selectedItem = items.find(i => i.id === item.itemId);
              return selectedItem?.currentStock !== undefined && 
                     item.quantity > selectedItem.currentStock;
            }) && (
              <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                <p className="text-sm">
                  Some items exceed available stock levels. Please adjust quantities.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Submit Button */}
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
              transferItems.some(item => {
                const selectedItem = items.find(i => i.id === item.itemId);
                return (
                  selectedItem?.currentStock !== undefined && 
                  item.quantity > selectedItem.currentStock
                );
              })
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