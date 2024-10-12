import { useEffect, useRef } from "react";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "framer-motion";

import Loader from "@ui/loader";

import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  ChatBubbleReadReciept,
  ChatBubbleTimestamp,
} from "../ui/chat/chat-bubble";

import ChatBottombar from "./chat-bottombar";
import { Message, UserMessage } from "@/types";
import { Bot, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelector } from "@/redux/store";

interface ChatListProps {
  messages: Message[];
  sendMessage: (newMessage: UserMessage) => void;
  isLoading?: boolean;
}

const getMessageVariant = (messageRole: Message["role"]) =>
  messageRole === "user" ? "sent" : "received";

export function ChatList({
  messages,
  sendMessage,
  isLoading = false,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const UserAvatar = UserRound;
  const AssistantAvatar = Bot;

  return (
    <div className="w-full grow flex flex-col h-0 justify-between relative">
      {isLoading && (
        <div className="h-full w-full absolute top-0 left-0 z-30 backdrop-blur-sm flex justify-center items-center">
          <Loader />
        </div>
      )}
      <ChatMessageList ref={messagesContainerRef} className="mb-16 z-0">
        <AnimatePresence>
          {messages.map((message, index) => {
            const variant = getMessageVariant(message.role);
            return (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: "spring",
                    bounce: 0.3,
                    duration: index * 0.05 + 0.2,
                  },
                }}
                style={{ originX: 0.5, originY: 0.5 }}
                className="flex flex-col gap-2"
              >
                <ChatBubble variant={variant}>
                  <ChatBubbleAvatar
                    icon={
                      message.role === "user" ? UserAvatar : AssistantAvatar
                    }
                    className={cn(
                      "min-w-6 h-6 p-1.5",
                      index === messages.length - 1 &&
                        message.role === "user" &&
                        "mb-4"
                    )}
                  />
                  <div className="w-full">
                    <ChatBubbleMessage
                      variant={variant}
                      isLoading={
                        message.role === "assistant" && message.loading
                      }
                      className="text-gray-950"
                    >
                      {message.role === "user" && message.message}
                      {message.role === "assistant" && message.result_text}
                      {message.timestamp && (
                        <ChatBubbleTimestamp
                          timestamp={new Date(
                            message.timestamp
                          ).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                          className="text-gray-500"
                        />
                      )}
                    </ChatBubbleMessage>
                    {index === messages.length - 1 &&
                      message.role === "user" && (
                        <ChatBubbleReadReciept readReciept={message.read} />
                      )}
                  </div>
                </ChatBubble>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatMessageList>
      <ChatBottombar
        sendMessage={sendMessage}
        showInCenter={messages.length === 0}
      />
    </div>
  );
}
