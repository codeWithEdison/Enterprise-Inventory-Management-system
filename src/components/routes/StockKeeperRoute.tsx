
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
import { RoleName } from '@/types/api/types';

interface StockKeeperRouteProps {
  children: React.ReactNode;
}

export const StockKeeperRoute: React.FC<StockKeeperRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  const userRole = user?.userRoles?.[0]?.role.name;
  const isAuthorized = userRole === RoleName.STOCK_KEEPER || userRole === RoleName.ADMIN;

  if (!isAuthorized) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};