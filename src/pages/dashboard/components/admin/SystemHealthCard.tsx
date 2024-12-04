// src/pages/dashboard/components/admin/SystemHealthCard.tsx
import React from 'react';

interface SystemHealthCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  bgColor: string;
  iconBgColor: string;
  textColor: string;
  valueColor: string;
}

export const SystemHealthCard: React.FC<SystemHealthCardProps> = ({
  icon,
  title,
  value,
  bgColor,
  iconBgColor,
  textColor,
  valueColor,
}) => {
  return (
    <div className={`flex items-center gap-4 p-4 ${bgColor} rounded-lg`}>
      <div className={`p-3 ${iconBgColor} rounded-full`}>
        {icon}
      </div>
      <div>
        <p className={`text-sm font-medium ${textColor}`}>{title}</p>
        <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  );
};