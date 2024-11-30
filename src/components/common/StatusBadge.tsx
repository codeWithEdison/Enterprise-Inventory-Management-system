import { cn } from '@/lib/utils';
import { Status } from '@/types/api/types';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = () => {
    switch (status) {
      case Status.ACTIVE:
        return 'bg-green-100 text-green-800';
      case Status.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium rounded-full",
      getStatusStyles(),
      className
    )}>
      {status}
    </span>
  );
};
