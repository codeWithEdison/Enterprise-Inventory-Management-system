/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { ChartCard } from '../ChartCard';
import { StockOverview } from './StockOverview';
import { LoadingSpinner } from '@/components/common/LoadingScreen';
import axiosInstance from '@/lib/axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

interface DashboardStats {
  criticalStock: number;
  lowStock: number;
  approvedRequests: number;
  healthyStock: number;
}

interface TransactionHistory {
  name: string;
  in: number;
  out: number;
}

interface DashboardData {
  stats: DashboardStats;
  transactionHistory: TransactionHistory[];
  lowStockItems: any[]; // Update type based on your data structure
}

export const StockKeeperDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get('/dashboard');
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data) {
    return (
      <div className="text-red-500 text-center p-4">
        {error || 'Failed to load dashboard data'}
      </div>
    );
  }

  // Prepare stock metrics data
  const stockMetrics = [
    {
      title: 'Critical Stock',
      value: `${data.stats.criticalStock} items`,
      description: 'Needs immediate attention',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Low Stock',
      value: `${data.stats.lowStock} items`,
      description: 'Below minimum quantity',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Healthy Stock',
      value: `${data.stats.healthyStock} items`,
      description: 'Above minimum quantity',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Approved Requests',
      value: data.stats.approvedRequests.toString(),
      description: 'Pending fulfillment',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  // Generate pie chart data from lowStockItems
  // If lowStockItems is empty, show a default "No Low Stock" message
  const lowStockData = data.lowStockItems.length > 0 
    ? data.lowStockItems 
    : [{ name: 'No Low Stock', value: 1 }];

  const COLORS = ['#EF4444', '#F59E0B', '#10B981', '#6366F1'];

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Stock Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock Movement">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.transactionHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #ccc', 
                    borderRadius: '8px' 
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="in" 
                  stroke="#10B981" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Stock In" 
                />
                <Line 
                  type="monotone" 
                  dataKey="out" 
                  stroke="#EF4444" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                  name="Stock Out" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Low Stock by Category">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lowStockData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => 
                    data.lowStockItems.length > 0 
                      ? `${name} ${(percent * 100).toFixed(0)}%`
                      : name
                  }
                >
                  {lowStockData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                {data.lowStockItems.length > 0 && <Legend />}
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Quick Stock Metrics */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Stock Metrics</h3>
        <StockOverview metrics={stockMetrics} />
      </div>
    </>
  );
};

export default StockKeeperDashboard;