import React, { useState, useEffect } from 'react';
import { Card } from '@/components/common/Card';
import { ChartCard } from '../ChartCard';
import { Activity, Users, ClipboardList, Loader2 } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer
} from 'recharts';
import { SystemHealthCard } from './SystemHealthCard';
import axiosInstance from '@/lib/axios';

interface DashboardStats {
  totalActiveUsers: number;
  totalActiveItems: number;
  totalRequests: number;
}

interface DepartmentData {
  name: string;
  value: number;
}

interface RequestHistory {
  name: string;
  requests: number;
}

interface DashboardData {
  stats: DashboardStats;
  departmentDistribution: DepartmentData[];
  requestHistory: RequestHistory[];
}

export const AdminDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get<DashboardData>('/dashboard');
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
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error || !data) {
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

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Department Distribution">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentDistribution.filter(dept => dept.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.departmentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Request History">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.requestHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="requests" 
                  fill="#10B981" 
                  name="Total Requests"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* System Health Overview */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SystemHealthCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Active Users"
            value={data.stats.totalActiveUsers.toString()}
            bgColor="bg-blue-50"
            iconBgColor="bg-blue-100"
            textColor="text-blue-600"
            valueColor="text-blue-700"
          />
          <SystemHealthCard
            icon={<ClipboardList className="h-6 w-6 text-green-600" />}
            title="Active Items"
            value={data.stats.totalActiveItems.toString()}
            bgColor="bg-green-50"
            iconBgColor="bg-green-100"
            textColor="text-green-600"
            valueColor="text-green-700"
          />
          <SystemHealthCard
            icon={<Activity className="h-6 w-6 text-purple-600" />}
            title="Total Requests"
            value={data.stats.totalRequests.toString()}
            bgColor="bg-purple-50"
            iconBgColor="bg-purple-100"
            textColor="text-purple-600"
            valueColor="text-purple-700"
          />
        </div>
      </Card>
    </>
  );
};

export default AdminDashboard;