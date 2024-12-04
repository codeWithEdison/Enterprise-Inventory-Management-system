import { Card } from '@/components/common/Card';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  user: string;
  icon?: React.ReactNode;
}

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => (
  <Card className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            {activity.icon || <Activity className="h-5 w-5 text-gray-600" />}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {activity.title}
            </p>
            <p className="text-sm text-gray-500">
              {activity.timestamp} by {activity.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  </Card>
);
