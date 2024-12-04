import { ChartCard } from '../ChartCard';
import { StockOverview } from './StockOverview';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Stock Movement">
          <BarChart data={stockMovementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="in" fill="#10B981" name="Stock In" />
            <Bar dataKey="out" fill="#EF4444" name="Stock Out" />
          </BarChart>
        </ChartCard>

        <ChartCard title="Low Stock by Category">
          <PieChart>
            <Pie
              data={lowStockData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
              dataKey="value"
            >
              {[
                '#EF4444',
                '#F59E0B',
                '#10B981',
                '#6366F1',
              ].map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>

      {/* Quick Stock Overview */}
      <div className="mt-6">
        <StockOverview metrics={stockMetrics} />
      </div>
    </>
  );
};
