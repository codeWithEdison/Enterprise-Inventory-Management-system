import React, { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { ChartCard } from '../ChartCard';
// import { BudgetCard } from './BudgetCard';
import { Clock, Percent } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import axiosInstance from '@/lib/axios';
import { LoadingSpinner } from '@/components/common/LoadingScreen';

interface DashboardData {
  stats: {
    averageResponseTime: {
      num: number;
      time: string;
      remark: string;
    };
    requestCompletionTime: {
      num: number;
      remark: string;
    };
  };
  transactionHistory: Array<{
    name: string;
    approved: number;
    pending: number;
  }>;
  statusData: Array<{
    name: string;
    value: number;
  }>;
}

export const HodDashboard = () => {
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

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const COLORS = ['#F59E0B', '#10B981', '#EF4444', '#3B82F6'];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Department Requests Overview">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.transactionHistory}>
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
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Request Status Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {data.statusData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Department Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* <BudgetCard total={60000} used={45000} /> */}
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Average Response Time
            </h3>
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.stats.averageResponseTime.num}{data.stats.averageResponseTime.time}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {data.stats.averageResponseTime.remark}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Request Completion Rate
            </h3>
            <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
              <Percent className="h-4 w-4 text-green-600" />
            </div>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {data.stats.requestCompletionTime.num}%
          </p>
          <p className="mt-2 text-sm text-gray-500">
            {data.stats.requestCompletionTime.remark}
          </p>
        </Card>
      </div>
    </>
  );
};

export default HodDashboard;