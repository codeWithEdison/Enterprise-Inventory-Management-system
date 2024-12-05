/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/StockInPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageCheck, Plus, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { mockApi } from '@/services/mockApi';
import { ItemResponse, LocationResponse, TransactionType } from '@/types/api/types';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import { mockLocations } from '@/lib/mock-data';

interface StockInItem {
  itemId: string;
  quantity: number;
  locationId: string;
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

    setStockInItems([
      ...stockInItems,
      {
        itemId: items[0].id,
        quantity: 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (stockInItems.length === 0) {
      setError('Please add at least one item');
      return;
    }

    if (stockInItems.some(item => item.quantity <= 0)) {
      setError('All quantities must be greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Replace with actual API call
      await Promise.all(
        stockInItems.map(item => 
          mockApi.transactions.create({
            ...item,
            transactionType: TransactionType.IN
          })
        )
      );

      navigate('/inventory');
    } catch (err) {
      setError('Failed to process stock in. Please try again.');
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

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            {/* Stock In Items */}
            <div className="space-y-4">
              {stockInItems.map((stockInItem, index) => (
                <div key={index} className="flex gap-4 items-start border-b border-gray-200 pb-4">
                  {/* Item Selection */}
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

                  {/* Quantity */}
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

                  {/* Location */}
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

                  {/* Reason */}
                  <div className="flex-1">
                    <Input
                      title="Reason"
                      type="text"
                      value={stockInItem.reason || ''}
                      onChange={(e) => handleUpdateItem(index, { 
                        reason: e.target.value 
                      })}
                      className="bg-gray-50 focus:bg-white"
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
              ))}
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