/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, ArrowLeft, History, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card } from '@/components/common/Card';
import { StatusBadge } from '@/components/common/StatusBadge';
// import Alert, { AlertType } from '@/components/common/Alert';
import useAuth from '@/hooks/useAuth';
import { ItemResponse, StockResponse } from '@/types/api/types'; 
import axiosInstance from '@/lib/axios';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [stockInfo, setStockInfo] = useState<StockResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check permissions
  const canEditItem = user?.userRoles[0]?.role.access.items.update;
  const canDeleteItem = user?.userRoles[0]?.role.access.items.delete;

  // Fetch item details and stock information
  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setIsLoading(true);
        const [itemResponse, stockResponse] = await Promise.all([
          axiosInstance.get<ItemResponse>(`/items/${id}`),
          axiosInstance.get<StockResponse[]>(`/stock/${id}`)
        ]);
        
        setItem(itemResponse.data);
        setStockInfo(stockResponse.data);
      } catch (err: any) {
        setError(err.message || 'Failed to load item details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchItemData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await axiosInstance.delete(`/items/${id}`);
      navigate('/inventory/items', {
        state: { message: 'Item deleted successfully' }
      });
    } catch (err: any) {
      setError(err.message || 'Failed to delete item');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-500">{error || 'Item not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Go Back
        </button>
      </div>
    );
  }

  const totalStock = stockInfo.reduce((sum, stock) => sum + stock.balance, 0);
  const isLowStock = totalStock < item.minimumQuantity;

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.name}
        subtitle="Item Details"
      >
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          {canEditItem && (
            <button
              onClick={() => navigate(`/inventory/items/${id}/edit`)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              <Edit2 className="h-4 w-4" />
              Edit Item
            </button>
          )}
          {canDeleteItem && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Item
                </>
              )}
            </button>
          )}
        </div>
      </PageHeader>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'details'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'history'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
          >
            Location Stock
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'details' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Details Card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Item Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.description || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Created At</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(item.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(item.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <StatusBadge status={item.status} />
                </dd>
              </div>
            </dl>
          </Card>

          {/* Stock Information Card */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Information</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Total Stock</dt>
                <dd className={`mt-1 text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900'}`}>
                  {totalStock}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Minimum Quantity</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.minimumQuantity}</dd>
              </div>
              {isLowStock && (
                <div className="bg-red-50 p-4 rounded-md">
                  <p className="text-sm text-red-700">
                    Stock level is below minimum quantity. Please reorder soon.
                  </p>
                </div>
              )}
            </dl>
          </Card>
        </div>
      ) : (
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock by Location</h3>
          {stockInfo.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stockInfo.map((stock) => (
                    <tr key={stock.locationId}>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {stock.location.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right">
                        {stock.balance}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {totalStock}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <History className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-500">No stock information available</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default ItemDetailsPage;