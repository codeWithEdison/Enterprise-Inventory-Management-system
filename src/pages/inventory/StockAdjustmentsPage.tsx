// src/pages/inventory/StockAdjustmentsPage.tsx
import React, { useState, useEffect } from "react";
import { Plus, ArrowDown, ArrowUp } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/common/Card";
import { SearchInput } from "@/components/common/SearchInput";
import Modal, { ModalSize } from "@/components/common/Modal";
import Input from "@/components/common/Input";
import { mockApi } from "@/services/mockApi";
import { ItemResponse, TransactionType } from "@/types/api/types";
import { LoadingScreen } from "@/components/common/LoadingScreen";

const StockAdjustmentsPage = () => {
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemResponse | null>(null);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const data = await mockApi.items.getItems();
        setItems(data);
      } catch (err) {
        setError("Failed to load items");
        console.error("Error fetching items:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Adjustments"
        subtitle="Manage and adjust stock levels"
      >
        <button
          onClick={() => setIsAdjustmentModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Adjustment
        </button>
      </PageHeader>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search items..."
          className="w-96"
        />
      </div>

      {/* Items List */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Quantity
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`text-sm font-medium ${
                        item.currentStock &&
                        item.currentStock < item.minimumQuantity
                          ? "text-red-600"
                          : "text-gray-900"
                      }`}
                    >
                      {item.currentStock ?? "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.minimumQuantity}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setIsAdjustmentModalOpen(true);
                      }}
                      className="text-primary-600 hover:text-primary-900 font-medium text-sm"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stock Adjustment Modal */}
      {isAdjustmentModalOpen && (
        <StockAdjustmentModal
          item={selectedItem}
          onClose={() => {
            setIsAdjustmentModalOpen(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
};

// Stock Adjustment Modal Component
interface StockAdjustmentModalProps {
  item: ItemResponse | null;
  onClose: () => void;
}

const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  item,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    quantity: "",
    reason: "",
    type: TransactionType.IN,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    try {
      setIsSubmitting(true);
      // Call your API to make the adjustment
      // await mockApi.transactions.create({...})

      // Close modal
      onClose();
    } catch (error) {
      console.error("Failed to adjust stock:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Adjust Stock - ${item.name}`}
      widthSizeClass={ModalSize.medium}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Stock Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">Current Stock</div>
          <div className="text-lg font-medium text-gray-900">
            {item.currentStock ?? "N/A"}
          </div>
          {item.currentStock !== undefined &&
            item.currentStock < item.minimumQuantity && (
              <div className="mt-2 text-sm text-red-600">
                Stock is below minimum quantity ({item.minimumQuantity})
              </div>
            )}
        </div>

        {/* Adjustment Type */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: TransactionType.IN }))
            }
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
              formData.type === TransactionType.IN
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ArrowDown className="h-5 w-5" />
            Stock In
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({ ...prev, type: TransactionType.OUT }))
            }
            className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
              formData.type === TransactionType.OUT
                ? "border-primary-500 bg-primary-50 text-primary-700"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            <ArrowUp className="h-5 w-5" />
            Stock Out
          </button>
        </div>

        {/* Quantity */}
        <Input
          title="Quantity"
          type="number"
          value={formData.quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (!isNaN(value) && value >= 0) {
              setFormData((prev) => ({ ...prev, quantity: e.target.value }));
            }
          }}
          className="bg-gray-50 focus:bg-white"
          min="1"
          error={
            formData.type === TransactionType.OUT &&
            parseInt(formData.quantity) > (item.currentStock || 0)
              ? "Quantity cannot exceed current stock"
              : undefined
          }
        />

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, reason: e.target.value }))
            }
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     bg-gray-50 focus:bg-white"
            placeholder="Enter reason for adjustment..."
          />
        </div>

        {/* Preview Change */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-500">
            New Stock Level After Adjustment
          </div>
          <div className="text-lg font-medium text-gray-900">
            {item.currentStock !== undefined && formData.quantity
              ? formData.type === TransactionType.IN
                ? item.currentStock + parseInt(formData.quantity)
                : item.currentStock - parseInt(formData.quantity)
              : "N/A"}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !formData.quantity ||
              !formData.reason ||
              (formData.type === TransactionType.OUT &&
                parseInt(formData.quantity) > (item.currentStock || 0))
            }
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg 
                     hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Processing..." : "Confirm Adjustment"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StockAdjustmentsPage;
