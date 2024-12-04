/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/EditItemPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import { UpdateItemInput, Status, ItemResponse } from '@/types/api/types';
import { mockApi } from '@/services/mockApi';

const EditItemPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [formData, setFormData] = useState<UpdateItemInput>({
    name: '',
    description: '',
    minimumQuantity: 0,
    status: Status.ACTIVE
  });

  useEffect(() => {
    const fetchItem = async () => {
      try {
        setIsLoading(true);
        const data = await mockApi.items.getItemById(id || '');
        setItem(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          minimumQuantity: data.minimumQuantity,
          status: data.status
        });
      } catch (error) {
        setError('Failed to fetch item details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchItem();
    }
  }, [id]);

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      setError('Item name is required');
      return false;
    }
    if (typeof formData.minimumQuantity !== 'number' || formData.minimumQuantity < 0) {
      setError('Minimum quantity must be a non-negative number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigate(`/inventory/items/${id}`);
    } catch (err) {
      setError('Failed to update item. Please try again.');
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

      <form onSubmit={handleSubmit}>
        <Card className="p-6">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-gray-900">Item Information</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <Input
                title="Item Name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                error={error && !formData.name?.trim() ? 'Item name is required' : undefined}
                onCloseError={() => setError(null)}
                className="bg-gray-50 focus:bg-white"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           bg-gray-50 focus:bg-white"
                />
              </div>

              <Input
                title="Minimum Quantity"
                type="number"
                value={formData.minimumQuantity?.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  minimumQuantity: parseInt(e.target.value) || 0 
                }))}
                error={error && (typeof formData.minimumQuantity !== 'number' || formData.minimumQuantity < 0) ? 'Minimum quantity must be a non-negative number' : undefined}
                onCloseError={() => setError(null)}
                className="bg-gray-50 focus:bg-white"
                min="0"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ 
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
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Status</h3>
                <StatusBadge status={item.status} />
              </div>

              {item.currentStock !== undefined && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Stock Level</h3>
                  <p className={`text-sm font-medium ${
                    item.currentStock < item.minimumQuantity 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {item.currentStock} units
                  </p>
                </div>
              )}
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
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemPage;