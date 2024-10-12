import type React from "react";
import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { SendHorizontal } from "lucide-react";

import { Button } from "@ui/button";

import { ChatInput } from "@ui/chat/chat-input";
import { UserMessage } from "@/types";
import { useSelector } from "@/redux/store";
import Loader from "@ui/loader";
import { cn } from "@/lib/utils";

interface ChatBottombarProps {
  sendMessage: (newMessage: UserMessage) => void;
  showInCenter?: boolean;
}

export default function ChatBottombar({
  sendMessage,
  showInCenter,
}: ChatBottombarProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pending = useSelector((state) => state.chatbot.pending);

  const [message, setMessage] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: UserMessage = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        role: "user",
        message: message.trim(),
        read: false,
      };
      sendMessage(newMessage);
      setMessage("");

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <div
      className={cn(
        "p-2 pt-4 absolute bottom-0 z-10 w-full",
        showInCenter &&
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-fit"
      )}
    >
      {showInCenter && (
        <div className="text-center mb-5">
          <p className="text-xl">Some text here</p>
        </div>
      )}
      <div className="flex justify-between w-full items-center gap-2 ">
        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: "spring",
                bounce: 0.15,
              },
            }}
          >
            <ChatInput
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="rounded-full focus-visible:outline-none focus-visible:ring-offset-0 focus-visible:ring-0 min-h-10 p-3"
            />
          </motion.div>

          <motion.div
            key="send_button"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: {
                type: "spring",
                bounce: 0.15,
              },
            }}
          >
            <Button
              className="h-9 w-9 shrink-0"
              onClick={handleSend}
              disabled={!message.trim()}
            >
              {pending ? (
                <Loader className="min-w-4" />
              ) : (
                <SendHorizontal className="min-w-4 h-4" />
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
