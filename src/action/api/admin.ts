import { createAsyncThunk } from "@reduxjs/toolkit";
import { Axios } from "./axios";
import { User, ChatHistory, Message } from "@/types";

export const fetchUsers = createAsyncThunk(
  "admin_fetch_users",
  async (): Promise<{ users: User[] }> => {
    const response = await Axios.get("/admin/users");
    return response.data;
  }
);

export const fetchChatsOfUser = createAsyncThunk(
  "admin_fetch_chats_of_user",
  async (
    userId: string
  ): Promise<{ user_id: string; chats: ChatHistory["chats"] }> => {
    const response = await Axios.get(`/admin/users/${userId}/chats`);
    return response.data;
  }
);

export const getMessagesOfChat = createAsyncThunk(
  "admin_get_messages_of_chat",
  async (chatId: string): Promise<{ chat_id: string; messages: Message[] }> => {
    const response = await Axios.get(`/admin/chats/${chatId}/messages`);
    return response.data;
  }
);
