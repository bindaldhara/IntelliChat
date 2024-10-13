import { AUTH_TOKEN_KEY } from "@/constants";
import axios from "axios";

export const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
