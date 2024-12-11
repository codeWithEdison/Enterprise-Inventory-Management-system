import React, { useState, useEffect } from "react";
import { FileDown, ArrowDown, ArrowUp, Loader2, Building2 } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { Card } from "@/components/common/Card";
import axiosInstance from "@/lib/axios";
interface StockLocation {
  locationId: string;
  locationName: string;
  stock: number;
}

interface StockItem {
  id: string;
  name: string;
  description: string;
  minimumQuantity: number;
  status: string;
  totalStock: number;
  stockByLocation: StockLocation[];
}

interface LocationStock {
  locationId: string;
  locationName: string;
  totalItems: number;
  totalStock: number;
  items: {
    balance: number;
    item: {
      id: string;
      name: string;
      description: string;
      minimumQuantity: number;
    };
  }[];
}

interface StockReport {
  totalItems: number;
  totalStock: number;
  stockByLocation: LocationStock[];
  items: StockItem[];
}

const StockReportPage = () => {
  const [report, setReport] = useState<StockReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  useEffect(() => {
    const fetchStockReport = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get<StockReport>('/reports/stock');
        setReport(data);
      } catch (err) {
        setError("Failed to load stock data");
        console.error("Error fetching stock report:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockReport();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !report) {
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

  const lowStockItems = report.items.filter(
    item => item.totalStock < item.minimumQuantity
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stock Report"
        subtitle="Overview of current stock levels and statistics"
      >
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
          <FileDown className="h-4 w-4" />
          Export Report
        </button>
      </PageHeader>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Items</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {report.totalItems}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Stock</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {report.totalStock}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Low Stock Items</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">
            {lowStockItems.length}
          </p>
        </Card>
      </div>

      {/* Location Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Stock by Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {report.stockByLocation.map((location) => (
            <div
              key={location.locationId}
              className="p-4 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-gray-400" />
                <h4 className="font-medium text-gray-900">{location.locationName}</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Items</p>
                  <p className="text-lg font-semibold">{location.totalItems}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Stock</p>
                  <p className="text-lg font-semibold">{location.totalStock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Stock Levels Table */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Stock Levels</h3>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">All Locations</option>
            {report.stockByLocation.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.locationName}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min. Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Locations
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {report.items
                .filter(item => 
                  selectedLocation === 'all' || 
                  item.stockByLocation.some(loc => loc.locationId === selectedLocation)
                )
                .map((item) => {
                  const isLowStock = item.totalStock < item.minimumQuantity;
                  return (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {item.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          isLowStock ? "text-red-600" : "text-gray-900"
                        }`}>
                          {item.totalStock}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.minimumQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {isLowStock ? (
                            <>
                              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                              <span className="text-sm font-medium text-red-600">
                                Low Stock
                              </span>
                            </>
                          ) : (
                            <>
                              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm font-medium text-green-600">
                                Normal
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          {item.stockByLocation.map((loc, index) => (
                            <div key={loc.locationId} className="text-gray-600">
                              {loc.locationName}: <span className="font-medium">{loc.stock}</span>
                              {index < item.stockByLocation.length - 1 ? ', ' : ''}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default StockReportPage;