/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/inventory/inventorySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  ItemResponse, 
  TransactionResponse,
  CreateTransactionInput,
  ItemFilterParams 
} from '../../types/api/types';
import { mockApi } from '../../services/mockApi';

interface InventoryState {
  items: ItemResponse[];
  transactions: TransactionResponse[];
  selectedItem: ItemResponse | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  transactions: [],
  selectedItem: null,
  isLoading: false,
  error: null,
};

export const fetchItems = createAsyncThunk(
  'inventory/fetchItems',
  async (_params?: ItemFilterParams) => {
    const response = await mockApi.items.getItems();
    return response;
  }
);

export const createTransaction = createAsyncThunk(
  'inventory/createTransaction',
  async (transaction: CreateTransactionInput) => {
    // In a real app, this would call the API
    // For now, we'll just return the mock transaction
    return {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch items';
      })
      // Create Transaction
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions.push(action.payload as TransactionResponse);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create transaction';
      });
  },
});

export const { setSelectedItem, clearError } = inventorySlice.actions;
export default inventorySlice.reducer;