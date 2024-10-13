import { fetchSelf, login, register } from "@/action/api";
import { AUTH_TOKEN_KEY } from "@/constants";
import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types";

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;

      localStorage.removeItem(AUTH_TOKEN_KEY);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;

        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Something went wrong";
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = true;

        localStorage.setItem(AUTH_TOKEN_KEY, action.payload.token);
      })
      .addCase(fetchSelf.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addCase(fetchSelf.rejected, (state, action) => {
        state.isLoggedIn = false;
        if (action.error.message !== "no_token_found") {
          state.error = action.error.message || "Something went wrong";
        }
      })
      .addCase(fetchSelf.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      });
  },
});

export const { logout, clearError } = userSlice.actions;

export default userSlice.reducer;
