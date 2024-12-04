import { ChartCard } from '../ChartCard';
import { Card } from '@/components/common/Card';
import { Clock, Package, CheckCircle } from 'lucide-react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

export const NurseDashboard = () => {
  const requestHistory = [
    { name: 'Week 1', requests: 5 },
    { name: 'Week 2', requests: 8 },
    { name: 'Week 3', requests: 6 },
    { name: 'Week 4', requests: 9 },
  ];

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Request History">
          <LineChart data={requestHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="requests" 
              stroke="#3B82F6" 
              strokeWidth={2}
              name="Requests Made"
            />
          </LineChart>
        </ChartCard>

        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Status</h2>
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Pending Requests</p>
                <p className="text-yellow-800">3 requests awaiting approval</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Approved Requests</p>
                <p className="text-green-800">2 requests ready for collection</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Recent Deliveries</p>
                <p className="text-blue-800">4 items received this week</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};