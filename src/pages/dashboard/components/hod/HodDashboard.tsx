import { Card } from '@/components/common/Card';
import { ChartCard } from '../ChartCard';
import { BudgetCard } from './BudgetCard';
import { Clock } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell 
} from 'recharts';

export const HodDashboard = () => {
  const requestsData = [
    { name: 'Week 1', pending: 12, approved: 8 },
    { name: 'Week 2', pending: 15, approved: 10 },
    { name: 'Week 3', pending: 8, approved: 12 },
    { name: 'Week 4', pending: 10, approved: 15 },
  ];

  const statusData = [
    { name: 'Pending', value: 15 },
    { name: 'Approved', value: 25 },
    { name: 'Rejected', value: 5 },
    { name: 'Fulfilled', value: 20 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Department Requests Overview">
          <LineChart data={requestsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="pending" 
              stroke="#F59E0B" 
              strokeWidth={2}
              name="Pending Requests"
            />
            <Line 
              type="monotone" 
              dataKey="approved" 
              stroke="#10B981" 
              strokeWidth={2}
              name="Approved Requests"
            />
          </LineChart>
        </ChartCard>

        <ChartCard title="Request Status Distribution">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {[
                '#F59E0B',
                '#10B981',
                '#EF4444',
                '#3B82F6',
              ].map((color, index) => (
                <Cell key={`cell-${index}`} fill={color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>

      {/* Department Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <BudgetCard total={60000} used={45000} />
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Average Response Time
            </h3>
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">4.2h</p>
          <p className="mt-2 text-sm text-gray-500">
            15% faster than last month
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Request Completion Rate
            </h3>
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-medium">%</span>
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">92%</p>
          <p className="mt-2 text-sm text-gray-500">
            Up from 89% last month
          </p>
        </Card>
      </div>
    </>
  );
};