/* eslint-disable @typescript-eslint/no-unused-vars */
// src/hooks/useAuth.ts
import { LoginInput } from '../types/api/types';
import { login, logout, resetAuthError } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from './useAppDispatch';

const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials: LoginInput) => {
    try {
      await dispatch(login(credentials)).unwrap();
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleResetError = () => {
    dispatch(resetAuthError());
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    logout: handleLogout,
    resetError: handleResetError,
  };
};

export default useAuth;