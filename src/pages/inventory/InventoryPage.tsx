/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  // FileDown, 
  ArrowUp, 
  ArrowDown,
  PackagePlus,
  PackageMinus,
  // FileUp,
  PackageSearch
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { SearchInput } from '@/components/common/SearchInput';
import { StatusBadge } from '@/components/common/StatusBadge';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import Alert, { AlertType } from '@/components/common/Alert';
import { ItemResponse, Status, StockResponse } from '@/types/api/types';
import useAuth from '@/hooks/useAuth';
import axiosInstance from '@/lib/axios';

interface ItemWithStock extends ItemResponse {
  stockInfo?: StockResponse[];
  totalStock?: number;
}

const InventoryPage = () => {
  const location = useLocation();
  const [items, setItems] = useState<ItemWithStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | Status>('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');

  const { user } = useAuth();
  const canManageStock = user?.userRoles[0]?.role.access.items.manageStock;

  // Fetch items and their stock information
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        // Get all items
        const itemsResponse = await axiosInstance.get<ItemResponse[]>('/items');
        
        // For each item, fetch its stock information
        const itemsWithStock = await Promise.all(
          itemsResponse.data.map(async (item) => {
            try {
              const stockResponse = await axiosInstance.get<StockResponse[]>(`/stock/${item.id}`);
              const totalStock = stockResponse.data.reduce((sum, stock) => sum + stock.balance, 0);
              
              return {
                ...item,
                stockInfo: stockResponse.data,
                totalStock
              };
            } catch (error) {
              console.error(`Failed to fetch stock for item ${item.id}:`, error);
              return {
                ...item,
                stockInfo: [],
                totalStock: 0
              };
            }
          })
        );

        setItems(itemsWithStock);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load inventory items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Handle success messages from navigation
  useEffect(() => {
    if (location.state?.message) {
      setSuccess(location.state.message);
      // Clear the message
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
                         (item.description?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesStock = (() => {
      switch (stockFilter) {
        case 'LOW':
          return item.totalStock !== undefined && 
                 item.totalStock < item.minimumQuantity;
        case 'OUT':
          return item.totalStock === 0;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesStock;
  });

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Manage your inventory items and stock levels"
      >
        <div className="flex gap-3">
          {canManageStock && (
            <>
              <Link
                to="/inventory/stock-in"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                <PackagePlus className="h-4 w-4" />
                Stock In
              </Link>
              <Link
                to="/inventory/stock-out"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
              >
                <PackageMinus className="h-4 w-4" />
                Stock Out
              </Link>
            </>
          )}
          <Link
            to="/inventory/items/new"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </Link>
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
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search items..."
            className="w-96"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'ALL')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Status</option>
            {Object.values(Status).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as 'ALL' | 'LOW' | 'OUT')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="ALL">All Stock Levels</option>
            <option value="LOW">Low Stock</option>
            <option value="OUT">Out of Stock</option>
          </select>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="mt-1 text-2xl font-bold text-yellow-600">
                {items.filter(item => 
                  item.totalStock !== undefined && 
                  item.totalStock < item.minimumQuantity
                ).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Out of Stock</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {items.filter(item => item.totalStock === 0).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Items</p>
              <p className="mt-1 text-2xl font-bold text-green-600">
                {items.filter(item => item.status === Status.ACTIVE).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <div className="overflow-x-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <PackageSearch className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No items found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {search || statusFilter !== 'ALL' || stockFilter !== 'ALL'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding some items to your inventory'}
              </p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
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
                {filteredItems.map((item) => {
                  const isLowStock = item.totalStock !== undefined && 
                                   item.totalStock < item.minimumQuantity;

                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/inventory/items/${item.id}`}
                          className="flex items-start"
                        >
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.name}
                            </div>
                            {item.description && (
                              <div className="text-sm text-gray-500">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium flex items-center gap-2 ${
                          isLowStock ? 'text-red-600' : 'text-gray-900'
                        }`}>
                          {item.totalStock || 0}
                          {isLowStock ? (
                            <ArrowDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.minimumQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            to={`/inventory/items/${item.id}`}
                            className="text-primary-600 hover:text-primary-900 font-medium text-sm"
                          >
                            View
                          </Link>
                          {canManageStock && (
                            <Link
                              to={`/inventory/items/${item.id}/edit`}
                              className="text-primary-600 hover:text-primary-900 font-medium text-sm"
                            >
                              Edit
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
};

export default InventoryPage;