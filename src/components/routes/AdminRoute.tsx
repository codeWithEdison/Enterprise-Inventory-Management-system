import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { RoleName } from '@/types/api/types';
import useAuth from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface AdminRouteProps {
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Handle loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check if user has admin role
  const isAdmin = user?.userRoles.some(role => role.role.name === RoleName.ADMIN);

  if (!user) {
    // If not authenticated, redirect to login with return url
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // If not admin, redirect to dashboard with message
    return <Navigate 
      to="/dashboard" 
      state={{ 
        error: "You don't have permission to access this area",
        from: location 
      }} 
      replace 
    />;
  }

  // If we have children, render them, otherwise render the Outlet
  return children ? <>{children}</> : <Outlet />;
};