// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginInput, UserResponse, RoleName, Status } from '../../types/api/types';

// Test user data
const testUser: UserResponse = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'admin@test.com',
  phone: '1234567890',
  nid: 'A123456',
  status: Status.ACTIVE,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  userRoles: [{
    id: '1',
    departmentId: '1',
    roleId: '1',
    userId: '1',
    status: Status.ACTIVE,
    startDate: new Date('2024-01-01'),
    department: {
      id: '1',
      name: 'Hospital Management',
      description: 'Main Hospital Department',
      status: Status.ACTIVE,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    role: {
      id: '1',
      name: RoleName.STOCK_KEEPER,   
      status: Status.ACTIVE,
      access: {
        users: { view: true, create: true, update: true, delete: true, assignRoles: true },
        roles: { view: true, create: true, update: true, delete: true },
        departments: { view: true, create: true, update: true, delete: true },
        items: { view: true, create: true, update: true, delete: true, manageStock: true },
        inventory: { view: true, stockIn: true, stockOut: true, transfer: true, viewTransactions: true },
        locations: { view: true, create: true, update: true, delete: true },
        requests: { create: true, view: true, viewOwn: true, approve: true, reject: true, cancel: true },
        notifications: { view: true, manage: true },
        reports: { stockReport: true, transactionReport: true, requestReport: true, userReport: true },
        settings: { view: true, update: true }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    // user: {} as any // This will be a circular reference
  }]
};

// Test credentials
const TEST_CREDENTIALS = {
  email: 'admin@test.com',
  password: 'password123'
};

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginInput) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check against test credentials
    if (credentials.email === TEST_CREDENTIALS.email && 
        credentials.password === TEST_CREDENTIALS.password) {
      const token = 'test-token-123';
      localStorage.setItem('token', token);
      return { user: testUser, accessToken: token };
    }
    
    throw new Error('Invalid credentials');
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { resetAuthError } = authSlice.actions;
export default authSlice.reducer;