import {
  fetchSelf,
  login,
  register,
  forgotPassword,
  verifyOtpAndResetPassword,
} from "@/action/api";
import { AUTH_TOKEN_KEY } from "@/constants";
import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types";

export interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  forgotPasswordSuccess: boolean;
  otpSuccess: boolean;
}

const initialState: UserState = {
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  forgotPasswordSuccess: false,
  otpSuccess: false,
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
    clearForgotPasswordState: (state) => {
      state.forgotPasswordSuccess = false;
      state.error = null;
      state.otpSuccess = false; 
    },
    setForgotPasswordSuccess: (state, action) => {
      state.forgotPasswordSuccess = action.payload;
    },
    setOTPSuccess: (state, action) => {
      state.otpSuccess = action.payload; 
    },
    setError: (state, action) => {
      state.error = action.payload;
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
        state.isLoading = false;
        state.isLoggedIn = true;
      })
      .addCase(fetchSelf.rejected, (state, action) => {
        state.isLoggedIn = false;
        state.isLoading = false;
        if (action.error.message !== "no_token_found") {
          state.error = action.error.message || "Something went wrong";
        }
      })
      .addCase(fetchSelf.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.forgotPasswordSuccess = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.forgotPasswordSuccess = true;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to send reset link";
      })
      .addCase(verifyOtpAndResetPassword.rejected, (state, action) => {
        state.error = action.error.message || "Verification failed";
      })
      .addCase(verifyOtpAndResetPassword.fulfilled, (state) => {
        state.otpSuccess = true;
      });
      
  },
});

export const { logout, clearError, clearForgotPasswordState, setOTPSuccess , setError} = userSlice.actions;

export default userSlice.reducer;
