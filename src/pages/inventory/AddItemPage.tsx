/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import Input from '@/components/common/Input';
// import Alert, { AlertType } from '@/components/common/Alert';
import { CreateItemInput } from '@/types/api/types';
import axiosInstance from '@/lib/axios';

const AddItemPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<CreateItemInput>({
    name: '',
    description: '',
    minimumQuantity: 0
  });

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Item name is required';
    }
    if (formData.minimumQuantity < 0) {
      return 'Minimum quantity cannot be negative';
    }
    if (formData.name.length < 3) {
      return 'Item name must be at least 3 characters long';
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

      const requestData = {
        items: [formData]
      };

      await axiosInstance.post('/items', requestData);
      
      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        description: '',
        minimumQuantity: 0
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate('/inventory/items', {
          state: { message: 'Item created successfully' }
        });
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create item. Please try again.';
      setError(errorMessage);
      setSuccess(false);
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
            <p>Item created successfully! Redirecting...</p>
          </div>
        </div>
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
                  error={error && !formData.name.trim() ? 'Item name is required' : undefined}
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
                  value={formData.minimumQuantity.toString()}
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
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Creating...' : 'Create Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItemPage;