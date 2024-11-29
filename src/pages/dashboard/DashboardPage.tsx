// src/pages/dashboard/DashboardPage.tsx
import { 
  Package, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { mockItems, mockRequests } from '../../lib/mock-data';
import { RequestStatus } from '../../types/api/types';

const DashboardPage = () => {
  // Calculate dashboard statistics
  const totalItems = mockItems.length;
  const lowStockItems = mockItems.filter(item => 
    (item.currentStock || 0) < item.minimumQuantity
  ).length;
  const pendingRequests = mockRequests.filter(
    req => req.status === RequestStatus.PENDING
  ).length;
  const completedRequests = mockRequests.filter(
    req => req.status === RequestStatus.FULLFILLED
  ).length;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const StatCard = ({ title, value, icon: Icon, trend }: any) => (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          {trend && (
            <p className={`text-sm mt-2 flex items-center ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend > 0 ? <ArrowUp className="h-4 w-4 mr-1" /> : 
                          <ArrowDown className="h-4 w-4 mr-1" />}
              {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className="bg-primary-100 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <select className="rounded-md border-gray-300 text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={totalItems}
          icon={Package}
          trend={5}
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockItems}
          icon={AlertTriangle}
          trend={-2}
        />
        <StatCard
          title="Pending Requests"
          value={pendingRequests}
          icon={Clock}
          trend={3}
        />
        <StatCard
          title="Completed Requests"
          value={completedRequests}
          icon={CheckCircle2}
          trend={7}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {mockRequests.slice(0, 5).map((request, requestIdx) => (
                <li key={request.id}>
                  <div className="relative pb-8">
                    {requestIdx !== 4 ? (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                          request.status === RequestStatus.FULLFILLED ? 'bg-green-500' :
                          request.status === RequestStatus.PENDING ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}>
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">
                            Request from <span className="font-medium text-gray-900">
                              {request.user.firstName} {request.user.lastName}
                            </span>
                          </p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;