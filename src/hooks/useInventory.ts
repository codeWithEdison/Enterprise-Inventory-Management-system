/* eslint-disable @typescript-eslint/no-unused-vars */
// src/features/inventory/inventorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  ItemResponse, 
  TransactionResponse,
  CreateTransactionInput,
  ItemFilterParams, 
  LocationResponse
} from '../types/api/types';
import { mockApi } from '../services/mockApi';

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

export const fetchItems = createAsyncThunk<ItemResponse[], ItemFilterParams | undefined>(
  'inventory/fetchItems',
  async (params) => {
    const response = await mockApi.items.getItems();
    return response;
  }
);

export const createTransaction = createAsyncThunk<TransactionResponse, CreateTransactionInput>(
  'inventory/createTransaction',
  async (transaction) => {
    // In a real app, this would call the API
    return {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      transactedBy: 'current-user-id', // This would come from the actual user
      item: {} as ItemResponse, // This would come from the actual item
      location: {} as LocationResponse, // This would come from the actual location
    } as TransactionResponse;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<ItemResponse | null>) => {
      state.selectedItem = action.payload;
    },
    resetInventoryError: (state) => {
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
        state.transactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create transaction';
      });
  },
});

export const { setSelectedItem, resetInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;