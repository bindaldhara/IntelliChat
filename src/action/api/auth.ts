import { createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "./axios";
import { AUTH_TOKEN_KEY } from "@/constants";
import { User } from "@/types";

export const fetchSelf = createAsyncThunk(
  "auth_fetch_self",
  async (defaultToken?: string): Promise<{ user: User | null }> => {
    const token = defaultToken || localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) {
      throw new Error("no_token_found");
    }

    Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const response = await Axios.get("/auth/self");
    return response.data;
  }
);

export const login = createAsyncThunk(
  "auth_login",
  async (
    payload: { email: string; password: string },
    { dispatch }
  ): Promise<{ token: string }> => {
    const response = await Axios.post("/auth/login", payload);

    const token = response.data.token;

    await dispatch(fetchSelf(token));
    return response.data;
  }
);

export const register = createAsyncThunk(
  "auth_register",
  async (
    payload: { email: string; password: string; name: string },
    { dispatch }
  ): Promise<{ token: string }> => {
    const response = await Axios.post("/auth/signup", payload);

    const token = response.data.token;

    await dispatch(fetchSelf(token));
    return response.data;
  }
);
