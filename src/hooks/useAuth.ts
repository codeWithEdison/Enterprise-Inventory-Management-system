// src/hooks/useAuth.ts
import { useState } from 'react';
import axiosInstance from '../lib/axios';
import { LoginInput, UserResponse} from '../types/api/types';
import { LoginResponse } from '@/types/auth';

 function useAuth() {
  const [user, setUser] = useState<UserResponse | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (credentials: LoginInput): Promise<boolean> => {
    try {
      const response = await axiosInstance.post<LoginResponse>('/auth/login', credentials);
      const { user, tokens } = response.data;
      
      // Save access token
      localStorage.setItem('accessToken', tokens.access.token);
      // Save refresh token
      localStorage.setItem('refreshToken', tokens.refresh.token);
      // Save user data
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };
}

export default useAuth;