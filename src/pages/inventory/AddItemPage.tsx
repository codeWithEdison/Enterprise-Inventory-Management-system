/* eslint-disable @typescript-eslint/no-unused-vars */
// src/pages/inventory/AddItemPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
import Alert, { AlertType } from '@/components/common/Alert';
import { CreateItemInput } from '@/types/api/types';

const AddItemPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateItemInput>({
    name: '',
    description: '',
    minimumQuantity: 0
  });

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Item name is required');
      return false;
    }
    if (formData.minimumQuantity < 0) {
      setError('Minimum quantity cannot be negative');
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
      navigate('/inventory/items');
    } catch (err) {
      setError('Failed to create item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Item"
        subtitle="Add a new item to inventory"
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
                error={error && !formData.name.trim() ? 'Item name is required' : undefined}
                onCloseError={() => setError(null)}
                className="bg-gray-50 focus:bg-white"
                // placeholder="Enter item name"
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
                  placeholder="Enter item description (optional)"
                />
              </div>

              <Input
                title="Minimum Quantity"
                type="number"
                value={formData.minimumQuantity.toString()}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  minimumQuantity: parseInt(e.target.value) || 0 
                }))}
                error={error && formData.minimumQuantity < 0 ? 'Minimum quantity cannot be negative' : undefined}
                onCloseError={() => setError(null)}
                className="bg-gray-50 focus:bg-white"
                min="0"
              />
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
            {isSubmitting ? 'Creating...' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemPage;