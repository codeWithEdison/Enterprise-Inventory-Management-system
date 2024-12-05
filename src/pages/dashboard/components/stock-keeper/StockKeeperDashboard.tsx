import { ChartCard } from '../ChartCard';
import { StockOverview } from './StockOverview';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

export const StockKeeperDashboard = () => {
  const stockMovementData = [
    { name: 'Mon', in: 50, out: 30 },
    { name: 'Tue', in: 40, out: 35 },
    { name: 'Wed', in: 60, out: 40 },
    { name: 'Thu', in: 45, out: 38 },
    { name: 'Fri', in: 55, out: 42 },
  ];

  const lowStockData = [
    { name: 'Medicines', value: 8 },
    { name: 'Supplies', value: 5 },
    { name: 'Equipment', value: 3 },
    { name: 'Other', value: 2 },
  ];

  const stockMetrics = [
    {
      title: 'Critical Stock',
      value: '5 items',
      description: 'Needs immediate attention',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: 'Low Stock',
      value: '12 items',
      description: 'Below minimum quantity',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      title: 'Healthy Stock',
      value: '85 items',
      description: 'Above minimum quantity',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Value',
      value: '$45,250',
      description: 'Current inventory value',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    }
  ];

  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Stock Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock Movement" >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockMovementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid #ccc', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="in" stroke="#10B981" strokeWidth={2} activeDot={{ r: 8 }} name="Stock In" />
              <Line type="monotone" dataKey="out" stroke="#EF4444" strokeWidth={2} activeDot={{ r: 8 }} name="Stock Out" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Low Stock by Category" >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={lowStockData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {lowStockData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#EF4444', '#F59E0B', '#10B981', '#6366F1'][index % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
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