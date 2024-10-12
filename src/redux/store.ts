import { configureStore } from "@reduxjs/toolkit";
import reducer from "./slice";
import logger from "redux-logger";
import { useSelector as useReduxSelector, useDispatch as useReduxDispatch } from "react-redux";

export const store = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useSelector = useReduxSelector.withTypes<RootState>();
export const useDispatch = useReduxDispatch.withTypes<AppDispatch>();
