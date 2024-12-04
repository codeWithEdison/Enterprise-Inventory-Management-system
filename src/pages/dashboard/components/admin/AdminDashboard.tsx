import { Card } from '@/components/common/Card';
import { ChartCard } from '../ChartCard';
import { Activity, Users, Calendar } from 'lucide-react';
import {  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { SystemHealthCard } from './SystemHealthCard';

export const AdminDashboard = () => {
  const departmentData = [
    { name: 'Surgery', value: 30 },
    { name: 'Emergency', value: 25 },
    { name: 'Pediatrics', value: 20 },
    { name: 'ICU', value: 15 },
    { name: 'General', value: 10 },
  ];

  const activityData = [
    { name: 'Mon', logins: 20, requests: 15 },
    { name: 'Tue', logins: 25, requests: 20 },
    { name: 'Wed', logins: 30, requests: 25 },
    { name: 'Thu', logins: 22, requests: 18 },
    { name: 'Fri', logins: 28, requests: 22 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Department Distribution">
          <PieChart>
            <Pie
              data={departmentData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'].map(
                (color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                )
              )}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>

        <ChartCard title="User Activity Trends">
          <BarChart data={activityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="logins" fill="#3B82F6" />
            <Bar dataKey="requests" fill="#10B981" />
          </BarChart>
        </ChartCard>
      </div>

      {/* System Health Overview */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          System Health Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SystemHealthCard
            icon={<Activity className="h-6 w-6 text-green-600" />}
            title="System Status"
            value="Operational"
            bgColor="bg-green-50"
            iconBgColor="bg-green-100"
            textColor="text-green-600"
            valueColor="text-green-700"
          />
          <SystemHealthCard
            icon={<Users className="h-6 w-6 text-blue-600" />}
            title="Active Sessions"
            value="24"
            bgColor="bg-blue-50"
            iconBgColor="bg-blue-100"
            textColor="text-blue-600"
            valueColor="text-blue-700"
          />
          <SystemHealthCard
            icon={<Calendar className="h-6 w-6 text-purple-600" />}
            title="Last Backup"
            value="2h ago"
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