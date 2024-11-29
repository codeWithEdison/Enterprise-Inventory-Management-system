// import { Navigate, useLocation } from 'react-router-dom';
import { RoleName } from '../../types/api/types';
import useRouteGuard from '../../hooks/useRouteGuard';

interface AdminRouteProps {
  children: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { checkAccess } = useRouteGuard({
    allowedRoles: [RoleName.ADMIN],
    redirectTo: '/dashboard'
  });

  if (!checkAccess()) {
    return null; // The hook will handle the navigation
  }

  return <>{children}</>;
};