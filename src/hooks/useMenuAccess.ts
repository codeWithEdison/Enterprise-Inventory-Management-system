
import { useCallback } from 'react';
import useAuth from './useAuth';
import { RoleAccess } from '../types/api/types';

export const useMenuAccess = () => {
  const { user } = useAuth();

  const getUserAccess = useCallback((): RoleAccess | null => {
    if (!user?.userRoles?.length) return null;
    return user.userRoles[0].role.access;
  }, [user]);

  const canAccessInventory = useCallback((): boolean => {
    const access = getUserAccess();
    return !!access?.inventory.view;
  }, [getUserAccess]);

  const canManageUsers = useCallback((): boolean => {
    const access = getUserAccess();
    return !!access?.users.view;
  }, [getUserAccess]);

  const canApproveRequests = useCallback((): boolean => {
    const access = getUserAccess();
    return !!access?.requests.approve;
  }, [getUserAccess]);

  const canViewReports = useCallback((): boolean => {
    const access = getUserAccess();
    return !!(
      access?.reports.stockReport ||
      access?.reports.requestReport ||
      access?.reports.transactionReport
    );
  }, [getUserAccess]);

  return {
    getUserAccess,
    canAccessInventory,
    canManageUsers,
    canApproveRequests,
    canViewReports
  };
};