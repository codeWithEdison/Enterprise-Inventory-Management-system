import { Card } from '@/components/common/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon,
  trend 
}) => (
  <Card className="p-6">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      </div>
      {icon}
    </div>
    <div className={`mt-2 flex items-center text-sm ${
      trend === 'up' ? 'text-green-600' : 'text-red-600'
    }`}>
      <span>{change}</span>
    </div>
  </Card>
);
