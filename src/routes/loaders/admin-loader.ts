import { fetchSelf } from "@/action/api";
import { store } from "@/redux/store";
import { User } from "@/types";
import { PayloadAction } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

export const adminLoader = async () => {
  const action = (await store.dispatch(fetchSelf())) as PayloadAction<{
    user: User;
  }>;
  if (
    action.type !== "auth_fetch_self/fulfilled" ||
    action.payload?.user?.role !== "admin"
  ) {
    return redirect("/");
  }
  return null;
};
