/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/StockOutPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageMinus, Plus, Trash2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { mockApi } from '@/services/mockApi';
import { ItemResponse, LocationResponse, TransactionType } from '@/types/api/types';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import { mockLocations } from '@/lib/mock-data';

interface StockOutItem {
  itemId: string;
  quantity: number;
  locationId: string;
  reason?: string;
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
        const [itemsData, locationsData] = await Promise.all([
          mockApi.items.getItems(),
          // Use mockLocations instead of inline mock data
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
    if (items.length === 0 || locations.length === 0) return;

    setStockOutItems([
      ...stockOutItems,
      {
        itemId: items[0].id,
        quantity: 0,
        locationId: locations[0].id,
        reason: ''
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setStockOutItems(stockOutItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: Partial<StockOutItem>) => {
    setStockOutItems(
      stockOutItems.map((item, i) => 
        i === index ? { ...item, ...updates } : item
      )
    );
  };

  const validateStockLevels = (): boolean => {
    for (const stockOutItem of stockOutItems) {
      const item = items.find(i => i.id === stockOutItem.itemId);
      if (!item) continue;

      if (!item.currentStock || stockOutItem.quantity > item.currentStock) {
        setError(`Insufficient stock for ${item.name}. Available: ${item.currentStock}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (stockOutItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    if (stockOutItems.some(item => item.quantity <= 0)) {
      setError('All quantities must be greater than 0');
      return;
    }

    if (!validateStockLevels()) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Replace with actual API call
      await Promise.all(
        stockOutItems.map(item => 
          mockApi.transactions.create({
            ...item,
            transactionType: TransactionType.OUT
          })
        )
      );

      navigate('/inventory');
    } catch (err) {
      setError('Failed to process stock out. Please try again.');
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
          alertType={ AlertType.DANGER}
          title={error}
          close={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Stock Out Items */}
            <div className="space-y-4">
              {stockOutItems.map((stockOutItem, index) => {
                const selectedItem = items.find(i => i.id === stockOutItem.itemId);
                const isLowStock = selectedItem?.currentStock !== undefined && 
                                 stockOutItem.quantity > selectedItem.currentStock;

                return (
                  <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                    {/* Item Selection */}
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
                            {item.name} ({item.currentStock || 0} in stock)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
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
                      {selectedItem && (
                        <p className="mt-1 text-xs text-gray-500">
                          Available: {selectedItem.currentStock || 0}
                        </p>
                      )}
                    </div>

                    {/* Location */}
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

                    {/* Reason */}
                    <div className="flex-1">
                      <Input
                        title="Reason"
                        type="text"
                        value={stockOutItem.reason || ''}
                        onChange={(e) => handleUpdateItem(index, { 
                          reason: e.target.value 
                        })}
                        className="bg-gray-50 focus:bg-white"
                        // placeholder="e.g., Department request, Damage, etc."
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

            {/* Stock Level Warning */}
            {stockOutItems.some(item => {
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
              stockOutItems.length === 0 ||
              stockOutItems.some(item => {
                const selectedItem = items.find(i => i.id === item.itemId);
                return selectedItem?.currentStock !== undefined && 
                       item.quantity > selectedItem.currentStock;
              })
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