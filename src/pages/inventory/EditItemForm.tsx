// src/components/inventory/EditItemForm.tsx
import React, { useState } from 'react';
import { UpdateItemInput, ItemResponse, Status } from '@/types/api/types';
import Input from '@/components/common/Input';

interface EditItemFormProps {
  item: ItemResponse;
  onSubmit: (itemId: string, data: UpdateItemInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const EditItemForm: React.FC<EditItemFormProps> = ({
  item,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<UpdateItemInput>({
    name: item.name,
    description: item.description,
    minimumQuantity: item.minimumQuantity,
    status: item.status
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateItemInput, string>>>({});

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UpdateItemInput, string>> = {};
    
    if (formData.name?.trim() === '') {
      newErrors.name = 'Item name is required';
    }
    
    if (formData.minimumQuantity && formData.minimumQuantity < 0) {
      newErrors.minimumQuantity = 'Minimum quantity cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(item.id, formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          title="Item Name"
          type="text"
          value={formData.name || ''}
          error={errors.name}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, name: e.target.value }));
            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
          }}
          disabled={isLoading}
        />
      </div>

      <div>
        <Input
          title="Description"
          type="text"
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            description: e.target.value 
          }))}
          disabled={isLoading}
        />
      </div>

      <div>
        <Input
          title="Minimum Quantity"
          type="number"
          value={formData.minimumQuantity?.toString() || ''}
          error={errors.minimumQuantity}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setFormData(prev => ({ 
              ...prev, 
              minimumQuantity: value 
            }));
            if (errors.minimumQuantity) {
              setErrors(prev => ({ ...prev, minimumQuantity: undefined }));
            }
          }}
          disabled={isLoading}
        />
      </div>

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
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                   focus:outline-none focus:ring-2 focus:ring-primary-500"
          disabled={isLoading}
        >
          {Object.values(Status).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium 
                   text-gray-700 hover:bg-gray-50 focus:outline-none disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium
                   hover:bg-primary-700 focus:outline-none focus:ring-2 
                   focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditItemForm;