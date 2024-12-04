// src/pages/dashboard/components/ChartCard.tsx
import React, { ReactElement } from 'react';
import { Card } from '@/components/common/Card';
import { ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  children: ReactElement;
  action?: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children,
  action 
}) => (
  <Card className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {action}
    </div>
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </Card>
);

// Usage example:
/*
<ChartCard title="My Chart">
  <LineChart data={data}>
    <Line type="monotone" dataKey="value" stroke="#8884d8" />
  </LineChart>
</ChartCard>
*/