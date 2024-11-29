/* eslint-disable @typescript-eslint/no-unused-vars */
// src/services/mockApi.ts
import { 
    mockUsers, 
    // mockRoles, 
    // mockDepartments, 
    mockItems, 
    // mockLocations, 
    mockTransactions, 
    mockRequests, 
    mockNotifications,
    // mockStocks 
  } from '..//lib/mock-data';
  
  import {
    LoginInput,
    LoginResponse,
    UserResponse,
    ItemResponse,
    RequestResponse,
    TransactionResponse,
    NotificationResponse,
    RequestStatus,
    PaginationParams,
    NotificationStatus
  } from '../types/api/types';
  
  // Helper function to simulate API delay
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Auth Service
  export const authService = {
    login: async (credentials: LoginInput): Promise<LoginResponse> => {
      await delay(500); // Simulate network delay
      
      const user = mockUsers.find(u => u.email === credentials.email);
      if (!user || credentials.password !== 'password') { // For mock purposes, any password works
        throw new Error('Invalid credentials');
      }
  
      return {
        accessToken: 'mock-jwt-token',
        user
      };
    }
  };
  
  // User Service
  export const userService = {
    getCurrentUser: async (): Promise<UserResponse> => {
      await delay(300);
      return mockUsers[0];
    },
  
    getUsers: async (_params?: PaginationParams): Promise<UserResponse[]> => {
      await delay(300);
      return mockUsers;
    }
  };
  
  // Item Service
  export const itemService = {
    getItems: async (): Promise<ItemResponse[]> => {
      await delay(300);
      return mockItems;
    },
  
    getItemById: async (id: string): Promise<ItemResponse> => {
      await delay(300);
      const item = mockItems.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      return item;
    }
  };
  
  // Request Service
  export const requestService = {
    getRequests: async (): Promise<RequestResponse[]> => {
      await delay(300);
      return mockRequests;
    },
  
    updateRequestStatus: async (
      requestId: string, 
      status: RequestStatus, 
      remark?: string
    ): Promise<RequestResponse> => {
      await delay(500);
      const request = mockRequests.find(req => req.id === requestId);
      if (!request) throw new Error('Request not found');
      
      // In a real app, this would update the backend
      const updatedRequest = {
        ...request,
        status,
        remark: remark || request.remark,
        updatedAt: new Date()
      };
      
      return updatedRequest;
    }
  };
  
  // Transaction Service
  export const transactionService = {
    getTransactions: async (): Promise<TransactionResponse[]> => {
      await delay(300);
      return mockTransactions;
    }
  };
  
  // Notification Service
  export const notificationService = {
    getNotifications: async (): Promise<NotificationResponse[]> => {
      await delay(300);
      return mockNotifications;
    },
  
    markAsRead: async (notificationId: string): Promise<NotificationResponse> => {
      await delay(300);
      const notification = mockNotifications.find(n => n.id === notificationId);
      if (!notification) throw new Error('Notification not found');
      
      return {
        ...notification,
        status: NotificationStatus.READ as const, 
        updatedAt: new Date()
      };
    }
  };
  
  // Export all services
  export const mockApi = {
    auth: authService,
    users: userService,
    items: itemService,
    requests: requestService,
    transactions: transactionService,
    notifications: notificationService
  };