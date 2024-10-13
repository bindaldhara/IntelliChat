import { fetchSelf } from "@/action/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  isSidebarOpen: boolean;
  isAuthDialogOpen: boolean;
}

const initialState: AppState = {
  isSidebarOpen: true,
  isAuthDialogOpen: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleSidebar: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.isSidebarOpen = action.payload;
      } else {
        state.isSidebarOpen = !state.isSidebarOpen;
      }
    },
    toggleAuthDialog: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.isAuthDialogOpen = action.payload;
      } else {
        state.isAuthDialogOpen = !state.isAuthDialogOpen;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchSelf.fulfilled, (state) => {
      state.isAuthDialogOpen = false;
    });
  },
});

export const { toggleSidebar, toggleAuthDialog } = appSlice.actions;

export default appSlice.reducer;
