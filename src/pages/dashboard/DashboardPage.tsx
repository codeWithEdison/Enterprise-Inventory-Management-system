
import { WelcomeHeader } from './components/WelcomeHeader';
import { StatCard } from './components/StatCard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StockKeeperDashboard } from './components/stock-keeper/StockKeeperDashboard';
import { HodDashboard } from './components/hod/HodDashboard';
import { NurseDashboard } from './components/nurse/NurseDashboard';
import { ActivityFeed } from './components/ActivityFeed';
import { QuickActionsSection } from './components/QuickActions';
import useAuth from '@/hooks/useAuth';
import { RoleName } from '@/types/api/types';
import { 
  PackageSearch, 
  Clock, 
  TrendingUp,
  Users
} from 'lucide-react';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const DashboardPage = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  const userRole = user.userRoles[0]?.role.name;

  // Common statistics that are shown to all roles
  const commonStats = [
    {
      title: "Low Stock Items",
      value: "15",
      change: "+2 from yesterday",
      icon: <PackageSearch className="h-6 w-6 text-orange-500" />,
      trend: "up" as const
    },
    {
      title: "Pending Requests",
      value: "23",
      change: "-3 from yesterday",
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      trend: "down" as const
    },
    {
      title: "Total Stock Value",
      value: "$45,250",
      change: "+5% this month",
      icon: <TrendingUp className="h-6 w-6 text-green-500" />,
      trend: "up" as const
    },
    {
      title: "Active Users",
      value: "24",
      change: "+2 this week",
      icon: <Users className="h-6 w-6 text-purple-500" />,
      trend: "up" as const
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: '1',
      title: 'Stock adjustment for Item #1234',
      timestamp: '2 hours ago',
      user: 'John Doe'
    },
    {
      id: '2',
      title: 'New request submitted',
      timestamp: '3 hours ago',
      user: 'Jane Smith'
    },
    {
      id: '3',
      title: 'Request #456 approved',
      timestamp: '4 hours ago',
      user: 'Mike Johnson'
    }
  ];

  // Render role-specific dashboard content
  const renderDashboardContent = () => {
    switch (userRole) {
      case RoleName.ADMIN:
        return <AdminDashboard />;
      case RoleName.STOCK_KEEPER:
        return <StockKeeperDashboard />;
      case RoleName.HOD:
        return <HodDashboard />;
      case RoleName.NURSE:
        return <NurseDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <WelcomeHeader userName={user.firstName} />

      {/* Common Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {commonStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Role-specific content */}
      {renderDashboardContent()}

      {/* Quick Actions Section */}
      {userRole && (
        <QuickActionsSection role={userRole} />
      )}

      {/* Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={recentActivities} />
      </div>
    </div>
  );
};

export default DashboardPage;