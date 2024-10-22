import { AUTH_TOKEN_KEY } from "@/constants";
import axios from "axios";

export const Axios = axios.create({
  baseURL: "http://65.2.69.3",
});


Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      error.payload = {
        status: error.response.status,
        message: error.response.data.message || "An error occurred",
      };

      error.message = error.response.data.message;
    } else if (error.request) {
      // The request was made but no response was received
      error.payload = {
        status: 0,
        message: "No response received from server",
      };

      error.message = "No response received from server";
    } else {
      // Something happened in setting up the request that triggered an Error
      error.payload = {
        status: 0,
        message: error.message || "An unexpected error occurred",
      };

      error.message = "An unexpected error occurred";
    }
    return Promise.reject(error);
  }
);
