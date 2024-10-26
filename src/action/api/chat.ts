import { createAsyncThunk } from "@reduxjs/toolkit";
import { AssistantMessage, ChatHistory, Message, UserMessage } from "@/types";
import {
  addMessage,
  clearMessages,
  updateAssistantMessageData,
  updateMessage,
  clearMessagesAfterId,
  removeMessage,
  removeChat,
} from "@/redux/slice/chatbot";
import { Axios } from "./axios";
import { AxiosError, AxiosResponse } from "axios";


export const sendMessage = createAsyncThunk(
  "send_message",
  async (
    { chat_id, message }: { chat_id: string; message: UserMessage },
    { dispatch }
  ): Promise<{ chat_id: string; message: AssistantMessage }> => {
    dispatch(addMessage({ chat_id, message }));

    setTimeout(() => {
      dispatch(updateMessage({ ...message, read: true }));
    }, 1500);

    const assistantMessage: AssistantMessage = {
      id: Date.now().toString(),
      role: "assistant",
      loading: true,
    };

    setTimeout(() => {
      dispatch(addMessage({ chat_id, message: assistantMessage }));
    }, 3000);

    return new Promise(async (resolve, reject) => {
      let res: AxiosResponse, err: AxiosError;
      try {
        res = await Axios.post("/message", {
          chat_id,
          message,
        });
      } catch (e) {
        err = e as AxiosError;
      }
      setTimeout(() => {
        if (err) {
          reject(err);
        } else {
          resolve(res?.data);
        }
      }, 4500);
    });
  }
);

export const getChatHistory = createAsyncThunk(
  "get_chat_history",
  async (_): Promise<ChatHistory> => {
    const res = await Axios.get("/chat");
    return res.data;
  }
);

export const getChatMessages = createAsyncThunk(
  "get_chat_messages",
  async (
    {
      chat_id,
    }: {
      chat_id: string;
    },
    { dispatch }
  ): Promise<{
    messages: Message[];
    chat_id: string;
  }> => {
    if (chat_id === "new") {
      dispatch(clearMessages());
      return {
        chat_id: "new",
        messages: [],
      };
    }

    const res = await Axios.get(`/message/chat/${chat_id}`);
    return res.data;
  }
);

export const saveChat = createAsyncThunk(
  "save_chat",
  async (
    { chat_id, lastMessage }: { chat_id: string; lastMessage: string },
    { dispatch }
  ) => {
    const res = await Axios.post("/chat", {
      chat_id,
      lastMessage, 
    });

    await dispatch(getChatHistory());
    return res.data;
  }
);

export const regenerateMessage = createAsyncThunk(
  "regenerate_message",
  async (
    { message_id }: { message_id: string },
    { dispatch }
  ): Promise<{ chat_id: string; message: AssistantMessage }> => {
    dispatch(clearMessagesAfterId(message_id));
    dispatch(
      updateAssistantMessageData({
        id: message_id,
        data: { loading: true, error: "" },
      })
    );
    return new Promise(async (resolve) => {
      const res = await Axios.post(`/message/${message_id}/regenerate`);
      setTimeout(() => {
        resolve(res.data);
      }, 2000);
    });
  }
);

export const deleteMessage = createAsyncThunk(
  "delete_message",
  async ({ message_id }: { message_id: string }, { dispatch }) => {
    const res = await Axios.delete(`/message/${message_id}`);
    dispatch(removeMessage(message_id));
    if (res.data.deletedAssistantMessage) {
      dispatch(removeMessage(res.data.deletedAssistantMessage.id));
    }
    if (res.data.chatDeleted) {
      dispatch(removeChat(res.data.chat_id)); 
    }
    await dispatch(getChatHistory());

    return res.data;
  }
);

export const deleteChat = createAsyncThunk(
  "delete_chat",
  async({chat_id} : {chat_id : string}, {dispatch}) =>{
    const res = await Axios.delete(`/chat/${chat_id}`);
    dispatch(removeChat(chat_id));
    return res.data;
  }
);

export const renameChat = createAsyncThunk(
  "rename_chat",
  async (
    { chat_id, newTitle }: { chat_id: string; newTitle: string },
    { dispatch }
  ) => {
    const res = await Axios.put(`/chat/${chat_id}`, { title: newTitle });
    dispatch(getChatHistory());
    return res.data;
  }
);

export const submitFeedback = createAsyncThunk(
  "submit_feedback",
  async (
    { messageId, feedback }: { messageId: string; feedback: "up" | "down" },
  ) => {
    const res = await Axios.post("/feedback", { messageId, feedback });
    return  { messageId, feedback }; 
  }
);