
import { createSlice } from '@reduxjs/toolkit';

interface LayoutState {
  sidebarOpen: boolean;
}

const initialState: LayoutState = {
  sidebarOpen: true
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    }
  }
});

export const { toggleSidebar, setSidebarOpen } = layoutSlice.actions;
export default layoutSlice.reducer;