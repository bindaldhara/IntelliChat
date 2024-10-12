import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  isSidebarOpen: boolean;
}

const initialState: CounterState = {
  isSidebarOpen: true,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean>) => {
      if (action.payload !== undefined) {
        state.isSidebarOpen = action.payload;
      } else {
        state.isSidebarOpen = !state.isSidebarOpen;
      }
    },
  },
});

export const { toggleSidebar } = appSlice.actions;

export default appSlice.reducer;
