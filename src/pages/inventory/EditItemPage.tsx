/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import { UpdateItemInput, Status, ItemResponse, StockResponse } from '@/types/api/types';
import axiosInstance from '@/lib/axios';

const EditItemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [stockInfo, setStockInfo] = useState<StockResponse[]>([]);
  const [formData, setFormData] = useState<UpdateItemInput>({
    name: '',
    description: '',
    minimumQuantity: 0,
    status: Status.ACTIVE
  });

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setIsLoading(true);
        const [itemResponse, stockResponse] = await Promise.all([
          axiosInstance.get<ItemResponse>(`/items/${id}`),
          axiosInstance.get<StockResponse[]>(`/stock/${id}`)
        ]);

        const data = itemResponse.data;
        setItem(data);
        setStockInfo(stockResponse.data);
        setFormData({
          name: data.name,
          description: data.description || '',
          minimumQuantity: data.minimumQuantity,
          status: data.status
        });
      } catch (error: any) {
        setError(error.message || 'Failed to fetch item details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id]);

  const validateForm = (): string | null => {
    if (!formData.name?.trim()) {
      return 'Item name is required';
    }
    if (formData.name.length < 3) {
      return 'Item name must be at least 3 characters long';
    }
    if (typeof formData.minimumQuantity !== 'number' || formData.minimumQuantity < 0) {
      return 'Minimum quantity must be a non-negative number';
    }
    if (formData.description && formData.description.length < 5) {
      return 'Description must be at least 5 characters long';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await axiosInstance.patch(`/items/${id}`, {
        items: [formData]
      });

      setSuccess('Item updated successfully');
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/inventory/items/${id}`, {
          state: { message: 'Item updated successfully' }
        });
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to update item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!item) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-500">Item not found</p>
        <button
          onClick={() => navigate('/inventory/items')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Back to Items
        </button>
      </div>
    );
  }

  const totalStock = stockInfo.reduce((sum, stock) => sum + stock.balance, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Item"
        subtitle="Update item information"
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
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

      {success && (
        <Alert
          alertType={AlertType.SUCCESS}
          title={success}
          close={() => setSuccess(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Item Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <Input
                  title="Item Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, name: e.target.value }));
                    setError(null);
                  }}
                  className="bg-gray-50 focus:bg-white"
                  // placeholder="Enter item name (min. 3 characters)"
                  // required
                />
                <p className="mt-1 text-sm text-gray-500">
                  This name will be used to identify the item in the system
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, description: e.target.value }));
                    setError(null);
                  }}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           bg-gray-50 focus:bg-white"
                  placeholder="Enter item description (min. 5 characters)"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Provide details about the item's usage, specifications, or any other relevant information
                </p>
              </div>

              <div>
                <Input
                  title="Minimum Quantity"
                  type="number"
                  value={formData.minimumQuantity?.toString()}
                  onChange={(e) => {
                    setFormData(prev => ({ 
                      ...prev, 
                      minimumQuantity: parseInt(e.target.value) || 0 
                    }));
                    setError(null);
                  }}
                  className="bg-gray-50 focus:bg-white"
                  min="0"
                  // required
                />
                <p className="mt-1 text-sm text-gray-500">
                  Set a threshold for low stock alerts
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onChange={(e) => setFormData((prev: any) => ({ 
                    ...prev, 
                    status: e.target.value as Status 
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           bg-gray-50 focus:bg-white"
                >
                  {Object.values(Status).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Active items can be used in transactions, inactive items cannot
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                  <StatusBadge status={item.status} />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Total Stock Level</h3>
                  <p className={`text-sm font-medium ${
                    totalStock < item.minimumQuantity 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {totalStock} units
                    {totalStock < item.minimumQuantity && (
                      <span className="block text-xs mt-1">
                        Below minimum quantity ({item.minimumQuantity})
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
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
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemPage;