import {
  deleteChat,
  deleteMessage,
  getChatHistory,
  getChatMessages,
  regenerateMessage,
  saveChat,
  sendMessage,
  submitFeedback,
} from "@/action/api/chat";
import { AssistantMessage, ChatHistory, Message } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "./user";

export interface ChatbotState {
  messages: Message[];
  chat_id: string;
  pending: boolean;
  error: string | null;
  chats: ChatHistory["chats"];
}

const initialState: ChatbotState = {
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
    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (message) => message.id !== action.payload
      );
    },
    renameChat: (
      state,
      action: PayloadAction<{ chatId: string; newTitle: string }>
    ) => {
      const { chatId, newTitle } = action.payload;
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].title = newTitle;
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter((chat) => chat.id !== action.payload);
    },

    clearMessages: (state) => {
      state.chat_id = "new";
      state.messages = [];
      state.pending = false;
      state.error = null;
    },
    setChatId: (state, action: PayloadAction<string>) => {
      state.chat_id = action.payload;
    },
    updateAssistantMessageData: (
      state,
      action: PayloadAction<{ id: string; data: Partial<AssistantMessage> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.messages.findIndex((message) => message.id === id);
      if (index !== -1 && state.messages[index].role === "assistant") {
        state.messages[index] = { ...state.messages[index], ...data };
      }
    },
    clearMessagesAfterId: (state, action: PayloadAction<string>) => {
      const index = state.messages.findIndex(
        (message) => message.id === action.payload
      );
      if (index !== -1) {
        state.messages = state.messages.slice(0, index + 1);
      }
    },
    clearError: (state) => {
      state.error = null;
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

        const index = state.messages.findIndex(
          (message) => message.role === "assistant" && message.loading
        );
        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            loading: false,
            error: action.error.message ?? "something went wrong",
            regenerate_possible: false,
          } as AssistantMessage;
        }
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.messages = action.payload?.messages;
        state.chat_id = action.payload?.chat_id;
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.chats = action.payload?.chats;
      })
      .addCase(logout, (state) => {
        state.chats = [];
        state.messages = [];
        state.chat_id = "new";
      })
      .addCase(regenerateMessage.fulfilled, (state, action) => {
        chatbotSlice.caseReducers.addMessage(state, action);
        state.pending = false;
      })
      .addCase(regenerateMessage.pending, (state) => {
        state.pending = true;
        state.error = null;
      })
      .addCase(regenerateMessage.rejected, (state, action) => {
        state.pending = false;
        state.error = action.error.message ?? "something went wrong";
      })
      .addCase(saveChat.rejected, (state, action) => {
        state.error = action.error.message ?? "something went wrong";
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.error.message ?? "Unable to delete the chat";
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(
          (message) => message.id !== action.payload.id
        );
        state.error = "";
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.error.message ?? "Cannot delete the message";
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.messages = state.messages.map((msg) => {
          if (msg.role === "user" || msg.id !== action.payload.messageId)
            return msg;
          return {
            ...msg,
            feedback: action.payload.feedback,
          };
        });
      });
          },
});

export const {
  addMessage,
  updateMessage,
  removeMessage,
  removeChat,
  renameChat,
  clearMessages,
  setChatId,
  updateAssistantMessageData,
  clearMessagesAfterId,
  clearError,
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
