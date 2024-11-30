import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import InventoryPage from '../pages/inventory/InventoryPage';
import ProtectedRoute from './ProtectedRoute';
import { LoadingScreen } from '../components/common/LoadingScreen';
import useAuth from '../hooks/useAuth';
import { AdminRoute } from '../components/routes/AdminRoute';
import UserProfile from '@/pages/users/UserProfile';
import ChangePasswordPage from '@/pages/users/ChangePasswordPage';

const AppRoutes = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

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
            <Route index element={<InventoryPage />} />
            <Route 
              path="manage" 
              element={
                <AdminRoute>
                  <div>Manage Inventory</div>
                </AdminRoute>
              } 
            />
          </Route>

          {/* Request Routes */}
          <Route path="requests">
            <Route index element={<div>Requests List</div>} />
            <Route 
              path="new" 
              element={
                <ProtectedRoute>
                  <div>New Request</div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="approve" 
              element={
                <ProtectedRoute>
                  <div>Approve Requests</div>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Admin Routes */}
          <Route path="admin">
            <Route
              path="users"
              element={
                <AdminRoute>
                  <div>User Management</div>
                </AdminRoute>
              }
            />
            <Route
              path="settings"
              element={
                <AdminRoute>
                  <div>System Settings</div>
                </AdminRoute>
              }
            />
          </Route>

          {/* User Profile */}
          <Route path="profile" element={<UserProfile/>} /> 
          <Route path="change-password" element={<ChangePasswordPage/>} /> 
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;