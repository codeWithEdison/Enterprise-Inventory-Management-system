/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Plus, FileDown, FileUp, PackageSearch } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { SearchInput } from '@/components/common/SearchInput';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ItemResponse, Status } from '@/types/api/types';
import useAuth from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import axiosInstance from '@/lib/axios';

const ItemsListPage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Status | 'ALL'>('ALL');
  const location = useLocation();
  
  const { user } = useAuth();
  const canCreateItem = user?.userRoles[0]?.role.access.items.create;

  useEffect(() => {
    // Check for success message in navigation state
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<ItemResponse[]>('/items');
        setItems(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load items');
        console.error('Error fetching items:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Filter items based on search and status
  const filteredItems = items.filter(item => {
    const matchesSearch = (item.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
                         (item.description?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Items List"
        subtitle="Manage your inventory items"
      >
        <div className="flex gap-3">
          {canCreateItem && (
            <Link
              to="/inventory/items/new"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </Link>
          )}
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileDown className="h-4 w-4" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <FileUp className="h-4 w-4" />
            Import
          </button>
        </div>
      </PageHeader>

      {success && (
        <Alert
          alertType={AlertType.SUCCESS}
          title={success}
          close={() => setSuccess(null)}
        />
      )}

      {error && (
        <Alert
          alertType={AlertType.DANGER}
          title={error}
          close={() => setError(null)}
        />
      )}

      {/* Filters */}
      <div className="flex gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search items..."
          className="w-96"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Status | 'ALL')}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="ALL">All Status</option>
          <option value={Status.ACTIVE}>Active</option>
          <option value={Status.INACTIVE}>Inactive</option>
        </select>
      </div>

      {/* Items List */}
      <Card>
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || selectedStatus !== 'ALL' 
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : 'Get started by adding a new item.'}
              </p>
              {canCreateItem && (
                <div className="mt-6">
                  <Link
                    to="/inventory/items/new"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Item
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min. Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <ItemRow key={item.id} item={item} />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

const ItemRow: React.FC<{ item: ItemResponse }> = ({ item }) => {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{item.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">{item.description || '-'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.minimumQuantity}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={item.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <Link
          to={`/inventory/items/${item.id}`}
          className="text-primary-600 hover:text-primary-900 font-medium text-sm"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
};

export default ItemsListPage;