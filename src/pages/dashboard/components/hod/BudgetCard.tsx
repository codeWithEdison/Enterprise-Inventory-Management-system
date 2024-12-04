import { Card } from '@/components/common/Card';
import { CircleDollarSign } from 'lucide-react';

interface BudgetCardProps {
  total: number;
  used: number;
  currency?: string;
}

export const BudgetCard: React.FC<BudgetCardProps> = ({ 
  total, 
  used, 
  currency = '$' 
}) => {
  const percentage = (used / total) * 100;
  const remaining = total - used;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Budget Utilization
        </h3>
        <CircleDollarSign className="h-6 w-6 text-green-500" />
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{percentage.toFixed(1)}%</p>
      <div className="mt-4 h-2 bg-gray-200 rounded-full">
        <div 
          className="h-2 bg-green-500 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="mt-2 text-sm text-gray-500">
        {currency}{remaining.toLocaleString()} remaining of {currency}
        {total.toLocaleString()}
      </p>
    </Card>
  );
};