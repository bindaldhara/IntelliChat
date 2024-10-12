import { createAsyncThunk } from "@reduxjs/toolkit";
import { AssistantMessage, ChatHistory, Message, UserMessage } from "@/types";
import {
  addMessage,
  clearMessages,
  updateMessage,
} from "@/redux/slice/chatbot";

export const sendMessage = createAsyncThunk(
  "send_message",
  async (
    { chat_id, message }: { chat_id: string; message: UserMessage },
    { dispatch }
  ): Promise<{ chat_id: string; message: AssistantMessage }> => {
    dispatch(addMessage({ chat_id, message }));
    // TODO: send message to backend

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

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          chat_id,
          message: {
            role: "assistant",
            id: "a1",
            timestamp: 1682123456990,
            result_text:
              "Today's weather is sunny with a high of 75°F (24°C) and a low of 60°F (16°C). There's a slight breeze and no chance of rain.",
          },
        });
      }, 4500);
    });
  }
);

export const getChatHistory = createAsyncThunk(
  "get_chat_history",
  async (_): Promise<ChatHistory> => {
    // TODO: send message to backend

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          chats: [
            {
              id: "1",
              title: "Chat 1",
            },
            {
              id: "2",
              title: "Chat 2",
            },
            {
              id: "3",
              title: "Chat 3",
            },
            {
              id: "4",
              title: "Chat 4",
            },
            {
              id: "5",
              title: "Chat 5",
            },
            {
              id: "6",
              title: "Chat 6",
            },
            {
              id: "7",
              title: "Chat 7",
            },
            {
              id: "8",
              title: "Chat 8",
            },
          ],
        });
      }, 1000);
    });
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
    // TODO: send message to backend

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          messages: [
            {
              role: "user",
              id: "u1",
              message: "What's the weather like today?",
              timestamp: 1682123456789,
              read: true,
            },
            {
              role: "assistant",
              id: "a1",
              timestamp: 1682123456990,
              result_text:
                "Today's weather is sunny with a high of 75°F (24°C) and a low of 60°F (16°C). There's a slight breeze and no chance of rain.",
            },
            {
              role: "user",
              id: "u2",
              message: "Can you recommend a good Italian restaurant nearby?",
              timestamp: 1682123567890,
              read: false,
            },
            {
              role: "assistant",
              id: "a2",
              timestamp: 1682123568100,
              result_text:
                "I'd recommend 'La Trattoria' on Main Street. It has excellent reviews, authentic Italian cuisine, and a cozy atmosphere. Their homemade pasta and tiramisu are particularly popular.",
            },
            {
              role: "user",
              id: "u3",
              message: "How do I create a simple React component?",
              timestamp: 1682123678901,
              read: true,
            },
            {
              role: "assistant",
              id: "a3",
              timestamp: 1682123679200,
              result_text:
                "Here's a simple example of a React component:\n\n```jsx\nimport React from 'react';\n\nconst SimpleComponent = () => {\n  return (\n    <div>\n      <h1>Hello, World!</h1>\n      <p>This is a simple React component.</p>\n    </div>\n  );\n};\n\nexport default SimpleComponent;\n```\n\nYou can then use this component in your app by importing and rendering it.",
            },
            {
              role: "user",
              id: "u4",
              message: "What's the capital of France?",
              timestamp: 1682123789012,
              read: true,
            },
            {
              role: "assistant",
              id: "a4",
              timestamp: 1682123789200,
              result_text: "The capital of France is Paris.",
            },
            {
              role: "user",
              id: "u5",
              message:
                "Can you generate a simple bar chart of monthly sales data?",
              timestamp: 1682123890123,
              read: true,
            },
            {
              role: "assistant",
              id: "a5",
              timestamp: 1682123890400,
              result_text:
                "Certainly! I've generated a simple bar chart based on hypothetical monthly sales data.",
              result_visualization_path: "/images/monthly_sales_chart.png",
            },
          ],
          chat_id,
        });
      }, 2000);
    });
  }
);
