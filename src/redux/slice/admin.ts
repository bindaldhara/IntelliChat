import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUsers,
  fetchChatsOfUser,
  getMessagesOfChat,
} from "@/action/api/admin";
import { Message, ChatHistory, User } from "@/types";

interface AdminState {
  users: User[];
  chats: {
    user_id: string;
    chats: ChatHistory["chats"];
  };
  messages: {
    chat_id: string;
    messages: Message[];
  };
  selectedUserId: string;
  selectedChatId: string;
}

const initialState: AdminState = {
  users: [],
  chats: {
    user_id: "",
    chats: [],
  },
  messages: {
    chat_id: "",
    messages: [],
  },
  selectedUserId: "",
  selectedChatId: "",
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    setSelectedChatId: (state, action) => {
      state.selectedChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.users;
      })
      .addCase(fetchChatsOfUser.fulfilled, (state, action) => {
        state.chats = action.payload;
      })
      .addCase(getMessagesOfChat.fulfilled, (state, action) => {
        state.messages = action.payload;
      });
  },
});

export const { setSelectedUserId, setSelectedChatId } = adminSlice.actions;

export default adminSlice.reducer;
