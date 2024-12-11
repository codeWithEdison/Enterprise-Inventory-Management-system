import React, { useEffect, useState } from 'react';
import { Card } from '@/components/common/Card';
import { PageHeader } from '@/components/common/PageHeader';
import { LoadingSpinner } from '@/components/common/LoadingScreen';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, CheckCircle2, XCircle, Package } from 'lucide-react';
import axiosInstance from '@/lib/axios';

interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  rejectedRequests: number;
  approvedRequests: number;
  fulfilledRequests: number;
}

interface HistoryData {
  name: string;
  requests: number;
}

interface DashboardData {
  stats: DashboardStats;
  requestHistory: HistoryData[];
}

const NurseDashboard = () => {
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

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: number;
    icon: React.ElementType;
    color: string;
  }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of stock requests and activity"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Requests"
          value={data.stats.totalRequests}
          icon={Package}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Pending Requests"
          value={data.stats.pendingRequests}
          icon={Clock}
          color="bg-yellow-100 text-yellow-600"
        />
        <StatCard
          title="Approved Requests"
          value={data.stats.approvedRequests}
          icon={CheckCircle2}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Rejected Requests"
          value={data.stats.rejectedRequests}
          icon={XCircle}
          color="bg-red-100 text-red-600"
        />
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Request History</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.requestHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="requests"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default NurseDashboard;