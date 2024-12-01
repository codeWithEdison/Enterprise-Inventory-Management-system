// src/pages/inventory/InventoryPage.tsx
import React, { useEffect, useState } from 'react';
import { Plus, Filter, AlertTriangle } from 'lucide-react';
import { mockItems } from '@/lib/mock-data';
import { 
  ItemResponse, 
  Status, 
  CreateItemInput,
  // ItemFilterParams,  
  UpdateItemInput
} from '@/types/api/types';

import Modal, { ModalSize } from '@/components/common/Modal';
import AddItemForm from './AddItemForm';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { EmptyState } from '@/components/common/EmptyState';
import { StatusBadge } from '@/components/common/StatusBadge';
import Pagination from '@/components/common/Pagination';
import EditItemForm from './EditItemForm';
import { cn } from '@/lib/utils';


const PAGE_SIZE = 10;

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

   // Filter items
   const filteredItems = mockItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddItem = async (_data: CreateItemInput) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleEditItem = async (_itemId: string, _data: UpdateItemInput) => {
    setIsLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (item: ItemResponse) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
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

      {/* Edit Item Modal */}
      {selectedItem && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => !isLoading && setIsEditModalOpen(false)}
          title="Edit Item"
          widthSizeClass={ModalSize.medium}
        >
          <EditItemForm 
            item={selectedItem}
            onSubmit={handleEditItem}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={isLoading}
          />
        </Modal>
      )}


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
        {currentItems.length > 0 ? (
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
              {currentItems.map((item) => (
                    <ItemRow 
                      key={item.id} 
                      item={item}
                      onEdit={() => openEditModal(item)}
                    />
                  ))}
              </tbody>
            </table>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={PAGE_SIZE}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              className="border-t"
            />
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

// Updated ItemRow component
interface ItemRowProps {
  item: ItemResponse;
  onEdit: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, onEdit }) => {
  const isLowStock = (item.currentStock || 0) < item.minimumQuantity;

  const getStockLevelClass = () => {
    if (isLowStock) return 'text-amber-700 bg-amber-50';
    return 'text-green-700 bg-green-50';
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">
        <div>
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
          {item.description && (
            <div className="text-sm text-gray-500">{item.description}</div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {isLowStock && (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <div>
            <div className={cn(
              "inline-flex text-sm px-2 py-1 rounded-full font-medium",
              getStockLevelClass()
            )}>
              {item.currentStock} units
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Min: {item.minimumQuantity}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(item.updatedAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
        <button
          onClick={onEdit}
          className="text-primary-600 hover:text-primary-900 font-medium 
                   hover:underline focus:outline-none"
        >
          Edit
        </button>
      </td>
    </tr>
  );
};

export default InventoryPage;
