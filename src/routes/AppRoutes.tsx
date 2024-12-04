// src/routes/AppRoutes.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { RoleName } from "@/types/api/types";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import useAuth from "@/hooks/useAuth";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import AuthLayout from "@/components/layout/AuthLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import { AdminRoute } from "@/components/routes/AdminRoute";
import { StockKeeperRoute } from "@/components/routes/StockKeeperRoute";
// import { HodRoute } from '@/components/routes/HodRoute';
// import { NurseRoute } from '@/components/routes/NurseRoute';

// Auth Pages
import LoginPage from "@/pages/auth/LoginPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import VerifyEmailPage from "@/pages/auth/VerifyEmailPage";

// Dashboard Pages
import DashboardPage from "@/pages/dashboard/DashboardPage";

// Inventory Pages
import InventoryPage from "@/pages/inventory/InventoryPage";
import StockInPage from "@/pages/inventory/StockInPage";
import StockOutPage from "@/pages/inventory/StockOutPage";
import StockTransferPage from "@/pages/inventory/StockTransferPage";
import ItemsListPage from "@/pages/inventory/ItemsListPage";
import ItemDetailsPage from "@/pages/inventory/ItemDetailsPage";
import StockAdjustmentsPage from "@/pages/inventory/StockAdjustmentsPage";

// Request Pages
import AllRequestsPage from "@/pages/requests/AllRequestsPage";
import NewRequestPage from "@/pages/requests/NewRequestPage";
import PendingApprovalsPage from "@/pages/requests/PendingApprovalsPage";
import MyRequestsPage from "@/pages/requests/MyRequestsPage";
import RequestDetailsPage from "@/pages/requests/RequestDetailsPage";

// User Management Pages
import UsersListPage from "@/pages/admin/users/UsersListPage";
import UserDetailsPage from "@/pages/admin/users/UserDetailsPage";
import CreateUserPage from "@/pages/admin/users/CreateUserPage";
import EditUserPage from "@/pages/admin/users/EditUserPage";

// Role Management Pages
import RolesListPage from "@/pages/admin/roles/RolesListPage";
import RoleDetailsPage from "@/pages/admin/roles/RoleDetailsPage";
import CreateRolePage from "@/pages/admin/roles/CreateRolePage";

// Department Management Pages
import DepartmentsListPage from "@/pages/admin/departments/DepartmentsListPage";
import DepartmentDetailsPage from "@/pages/admin/departments/DepartmentDetailsPage";
import CreateDepartmentPage from "@/pages/admin/departments/CreateDepartmentPage";

// Reports Pages
import StockReportPage from "@/pages/reports/StockReportPage";
import TransactionReportPage from "@/pages/reports/TransactionReportPage";
import RequestReportPage from "@/pages/reports/RequestReportPage";
import UserReportPage from "@/pages/reports/UserReportPage";

// Settings Pages
import UserProfile from "@/pages/users/UserProfile";
import ChangePasswordPage from "@/pages/users/ChangePasswordPage";
import EditDepartmentPage from "@/pages/admin/departments/EditDepartmentPage";
import AddItemPage from "@/pages/inventory/AddItemPage";
import EditItemPage from "@/pages/inventory/EditItemPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import DevelopersPage from "@/pages/DevelopersPage";
// import SystemSettingsPage from '@/pages/admin/settings/SystemSettingsPage';

const AppRoutes = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const userRole = user?.userRoles?.[0]?.role.name;
  const isAdmin = userRole === RoleName.ADMIN;
  const isStockKeeper = userRole === RoleName.STOCK_KEEPER;
  const isHod = userRole === RoleName.HOD;
  const isNurse = userRole === RoleName.NURSE;

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="reset-password" element={<ResetPasswordPage />} />
          <Route path="verify-email" element={<VerifyEmailPage />} />
        </Route>
          <Route
            path="/developers"
            element={
              // <MainLayout>
              <DevelopersPage />
              // </MainLayout>
            }
          />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Dashboard - Role-specific dashboards */}
          <Route index element={<DashboardPage />} />

          {/* Admin Routes */}
          <Route path="admin" element={<AdminRoute />}>
            <Route path="users">
              <Route index element={<UsersListPage />} />
              <Route path="new" element={<CreateUserPage />} />
              <Route path=":id" element={<UserDetailsPage />} />
              <Route path=":id/edit" element={<EditUserPage />} />
            </Route>

            <Route path="roles">
              <Route index element={<RolesListPage />} />
              <Route path="new" element={<CreateRolePage />} />
              <Route path=":id" element={<RoleDetailsPage />} />
            </Route>

            <Route path="departments">
              <Route index element={<DepartmentsListPage />} />
              <Route path="new" element={<CreateDepartmentPage />} />
              <Route path=":id" element={<DepartmentDetailsPage />} />
              <Route path=":id/edit" element={<EditDepartmentPage />} />
            </Route>

            {/* <Route path="settings" element={<SystemSettingsPage />} /> */}
          </Route>

          {/* Inventory Routes */}
          <Route path="inventory">
            <Route
              index
              element={
                isAdmin || isStockKeeper ? (
                  <InventoryPage />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route path="items">
              <Route index element={<ItemsListPage />} />
              <Route path=":id" element={<ItemDetailsPage />} />
              {/* <Route path="new" element={<ItemDetailsPage />} /> */}
              <Route path="new" element={<AddItemPage />} />
              <Route path=":id/edit" element={<EditItemPage />} />
            </Route>
            <Route
              path="stock-in"
              element={
                <StockKeeperRoute>
                  <StockInPage />
                </StockKeeperRoute>
              }
            />
            <Route
              path="stock-out"
              element={
                <StockKeeperRoute>
                  <StockOutPage />
                </StockKeeperRoute>
              }
            />
            <Route
              path="transfer"
              element={
                <StockKeeperRoute>
                  <StockTransferPage />
                </StockKeeperRoute>
              }
            />
            <Route
              path="adjustments"
              element={
                <StockKeeperRoute>
                  <StockAdjustmentsPage />
                </StockKeeperRoute>
              }
            />
          </Route>

          {/* Request Routes */}
          <Route path="requests">
            <Route index element={<AllRequestsPage />} />
            <Route
              path="new"
              element={
                isNurse || isHod ? (
                  <NewRequestPage />
                ) : (
                  <Navigate to="/requests" replace />
                )
              }
            />
            <Route
              path="approve"
              element={
                isHod || isAdmin ? (
                  <PendingApprovalsPage />
                ) : (
                  <Navigate to="/requests" replace />
                )
              }
            />
            <Route path="my-requests" element={<MyRequestsPage />} />
            <Route path=":id" element={<RequestDetailsPage />} />
          </Route>

          {/* Reports Routes */}
          <Route path="reports">
            <Route path="stock" element={<StockReportPage />} />
            <Route path="transactions" element={<TransactionReportPage />} />
            <Route path="requests" element={<RequestReportPage />} />
            <Route
              path="users"
              element={
                isAdmin ? (
                  <UserReportPage />
                ) : (
                  <Navigate to="/reports" replace />
                )
              }
            />
          </Route>

          {/* Profile & Settings Routes */}
          <Route path="profile" element={<UserProfile />} />
          <Route path="change-password" element={<ChangePasswordPage />} />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
