// src/pages/inventory/InventoryPage.tsx
import React, { useState } from 'react';
import { Plus, Filter, AlertTriangle } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import { 
  ItemResponse, 
  Status, 
  CreateItemInput,
  ItemFilterParams 
} from '@/types/api/types';

import Modal, { ModalSize } from '@/components/common/Modal';
import AddItemForm from './AddItemForm';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter items based on search and status
  const filterParams: ItemFilterParams = {
    search: searchQuery,
    status: filterStatus === 'all' ? undefined : filterStatus
  };

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = !filterParams.search || 
      item.name.toLowerCase().includes(filterParams.search.toLowerCase()) ||
      item.description?.toLowerCase().includes(filterParams.search.toLowerCase());
    
    const matchesStatus = !filterParams.status || item.status === filterParams.status;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddItem = async (data: CreateItemInput) => {
    setIsLoading(true);
    try {
      // Here you would make your API call
      console.log('Adding item:', data);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Add success handling
      setIsAddModalOpen(false);
    } catch (error) {
      // Add error handling
      console.error('Failed to add item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Manage your stock items and inventory levels"
      >
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700
                   flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </button>
      </PageHeader>

      {/* Add Item Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => !isLoading && setIsAddModalOpen(false)}
        title="Add New Item"
        widthSizeClass={ModalSize.medium}
      >
        <AddItemForm 
          onSubmit={handleAddItem}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={isLoading}
        />
      </Modal>

      {/* Filters */}
      <Card>
        <div className="p-4 flex flex-col sm:flex-row gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search items..."
            className="sm:w-96"
          />
          <div className="flex items-center gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | 'all')}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              {Object.values(Status).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300
                             rounded-lg text-sm hover:bg-gray-50">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>
      </Card>

      {/* Items List */}
      <Card>
        {filteredItems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No items found"
            description="Try adjusting your search or filter to find what you're looking for."
          />
        )}
      </Card>
    </div>
  );
};

// ItemRow component
interface ItemRowProps {
  item: ItemResponse;
}

const ItemRow: React.FC<ItemRowProps> = ({ item }) => {
  const isLowStock = (item.currentStock || 0) < item.minimumQuantity;

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
          {item.description && (
            <div className="text-sm text-gray-500">{item.description}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          {isLowStock && (
            <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
          )}
          <div>
            <div className="text-sm text-gray-900">{item.currentStock} units</div>
            <div className="text-xs text-gray-500">Min: {item.minimumQuantity}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(item.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button className="text-primary-600 hover:text-primary-900">
          Edit
        </button>
      </td>
    </tr>
  );
};

export default InventoryPage;