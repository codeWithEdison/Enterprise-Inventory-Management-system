// src/components/notifications/NotificationBadge.tsx
import React from 'react';
// import { Bell } from 'lucide-react';

interface NotificationBadgeProps {
  count: number;
  className?: string;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({ count, className }) => {
  if (count === 0) return null;

  return (
    <span className={`
      absolute -top-1 -right-1 h-5 w-5
      flex items-center justify-center
      bg-red-500 text-white text-xs font-medium
      rounded-full
      ${className}
    `}>
      {count > 99 ? '99+' : count}
    </span>
  );
};