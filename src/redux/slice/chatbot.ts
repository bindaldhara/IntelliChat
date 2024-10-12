import {
  getChatHistory,
  getChatMessages,
  sendMessage,
} from "@/action/api/chat";
import { ChatHistory, Message } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  messages: Message[];
  chat_id: string;
  pending: boolean;
  error: string | null;
  chats: ChatHistory["chats"];
}

const initialState: CounterState = {
  messages: [],
  chat_id: "",
  pending: false,
  error: null,
  chats: [],
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{ chat_id: string; message: Message }>
    ) => {
      const { chat_id, message } = action.payload;
      if (state.chat_id !== "new" && chat_id !== state.chat_id) {
        state.chat_id = chat_id;
        state.messages = [];
      }
      state.messages = state.messages
        .filter((message) => message.role === "user" || !message.loading)
        .concat(message);
      state.chat_id = chat_id;
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(
        (Message) => Message.id === action.payload.id
      );
      state.messages[index] = action.payload;
    },
    clearMessages: (state) => {
      state.chat_id = "new";
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.pending = false;
        chatbotSlice.caseReducers.addMessage(state, action);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message ?? "something went wrong";
      })
      // Todo add error cases for these
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.messages = action.payload?.messages;
        state.chat_id = action.payload?.chat_id;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.chats = action.payload?.chats;
      });
  },
});

export const { addMessage, updateMessage, clearMessages } =
  chatbotSlice.actions;

export default chatbotSlice.reducer;
