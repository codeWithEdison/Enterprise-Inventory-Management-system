// src/routes/AppRoutes.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import StockInPage from '../pages/inventory/StockInPage';
import StockOutPage from '../pages/inventory/StockOutPage';
import StockTransferPage from '../pages/inventory/StockTransferPage';
import ProtectedRoute from './ProtectedRoute';
import { LoadingScreen } from '../components/common/LoadingScreen';
import useAuth from '../hooks/useAuth';
import { StockKeeperRoute } from '@/components/routes/StockKeeperRoute';
import UserProfile from '@/pages/users/UserProfile';
import ChangePasswordPage from '@/pages/users/ChangePasswordPage';
import { RoleName } from '@/types/api/types';

const AppRoutes = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const userRole = user?.userRoles?.[0]?.role.name;
  const isStockKeeper = userRole === RoleName.STOCK_KEEPER;
  const isAdmin = userRole === RoleName.ADMIN;

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/auth">
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<div>Forgot Password</div>} />
        </Route>

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - Available to all */}
          <Route index element={<DashboardPage />} />

          {/* Inventory Routes */}
          <Route path="inventory">
            {/* Main inventory page - Admin and Stock Keeper only */}
            <Route 
              index 
              element={
                isAdmin || isStockKeeper ? <InventoryPage /> : <Navigate to="/" replace />
              } 
            />

            {/* Stock In - Stock Keeper only */}
            <Route 
              path="stock-in" 
              element={
                <StockKeeperRoute>
                  <StockInPage />
                </StockKeeperRoute>
              } 
            />

            {/* Stock Out - Stock Keeper only */}
            <Route 
              path="stock-out" 
              element={
                <StockKeeperRoute>
                  <StockOutPage />
                </StockKeeperRoute>
              } 
            />

            {/* Stock Transfer - Stock Keeper only */}
            <Route 
              path="transfer" 
              element={
                <StockKeeperRoute>
                  <StockTransferPage />
                </StockKeeperRoute>
              } 
            />
          </Route>

          {/* Request Routes */}
          <Route path="requests">
            <Route index element={<div>Requests List</div>} />
            <Route 
              path="new" 
              element={<div>New Request</div>}
            />
            <Route 
              path="approve" 
              element={<div>Approve Requests</div>}
            />
          </Route>

          {/* Profile Section */}
          <Route path="profile" element={<UserProfile />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;