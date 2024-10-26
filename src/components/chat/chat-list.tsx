import { useEffect, useRef, useState } from "react";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify"; // Import toast
import { ToastContainer } from "react-toastify"; // Import ToastContainer
import "react-toastify/dist/ReactToastify.css";
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
import {
  Bot,
  ChevronDown,
  ChevronUp,
  RefreshCcw,
  UserRound,
  ThumbsUp,
  ThumbsDown,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {  useDispatch } from "@/redux/store";
import { regenerateMessage } from "@/action/api";
import ErrorDialog from "./error-dialog";
import ReactMarkdown from "react-markdown";
import { submitFeedback } from "@/action/api"; 
import { useTheme } from "@/context/themeContext";

interface ChatListProps {
  messages: Message[];
  messageId?: string;
  sendMessage?: (newMessage: UserMessage) => void;
  isLoading?: boolean;
  showBottombar?: boolean;
  giveFeedback?: (messageId: string, feedback: "up" | "down") => void; 
}

const getMessageVariant = (messageRole: Message["role"]) =>
  messageRole === "user" ? "sent" : "received";

export function ChatList({
  messages,
  sendMessage,
  isLoading = false,
  showBottombar = true,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const [openSummary, setOpenSummary] = useState<string[]>([]);
  const [, setFeedbackGiven] = useState<{
    [key: string]: string | null;
  }>({});

  const toggleSummary = (id: string) => {
    setOpenSummary((prev) =>
      prev.includes(id)
        ? prev.filter((summaryId) => summaryId !== id)
        : [...prev, id]
    );
  };

  const handleRegenerate = (id: string) => {
    dispatch(regenerateMessage({ message_id: id }));
  };

  const handleFeedback = (messageId: string, feedback: "up" | "down") => {
    setFeedbackGiven((prev) => ({
      ...prev,
      [messageId]: feedback,
    }));
    dispatch(submitFeedback({ messageId, feedback }));
  };

  const { theme } = useTheme();
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      theme: theme === "dark" ? "dark" : "light",
    });
  };

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const UserAvatar = UserRound;
  const AssistantAvatar = Bot;

  return (
    <>
   <ToastContainer />
    <div className="w-full grow flex flex-col h-0 justify-between relative">
      {isLoading && (
        <div className="h-full w-full absolute top-0 left-0 z-30 backdrop-blur-sm flex justify-center items-center">
          <Loader />
        </div>
      )}
      <ChatMessageList
        ref={messagesContainerRef}
        className={cn("z-0", showBottombar && "mb-16")}
      >
        <AnimatePresence>
          {messages.map((message, index) => {
            const variant = getMessageVariant(message.role);
            const isSummaryOpen = openSummary.includes(message.id);

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
                        "mb-4",
                      message.role === "assistant" &&
                        !!message.error &&
                        message.regenerate_possible &&
                        "mb-6"
                    )}
                  />
                  <div className="w-full">
                    <ChatBubbleMessage
                      variant={variant}
                      isLoading={
                        message.role === "assistant" && message.loading
                      }
                      className={cn(
                        "text-gray-950",
                        message.role === "assistant" &&
                          !!message.error &&
                          "bg-red-50"
                      )}
                    >
                      {message.role === "user" && message.message}
                      {message.role === "assistant" && (
                        <div
                          className={cn(
                            "space-y-1 relative",
                            message.summary && "pr-8"
                          )}
                        >
                          {!!message.error ? (
                            <p className="text-red-500">{message.error}</p>
                          ) : (
                            <>
                              <ReactMarkdown>
                                {message.result_text}
                              </ReactMarkdown>
                              {message.summary && (
                                <Collapsible
                                  open={isSummaryOpen}
                                  onOpenChange={() => toggleSummary(message.id)}
                                >
                                  <CollapsibleTrigger asChild>
                                    {isSummaryOpen ? (
                                      <ChevronUp className="absolute size-5 text-gray-600 hover:text-gray-950 -top-1 right-0 cursor-pointer" />
                                    ) : (
                                      <ChevronDown className="absolute size-5 text-gray-600 hover:text-gray-950 -top-1 right-0 cursor-pointer" />
                                    )}
                                  </CollapsibleTrigger>
                                  <CollapsibleContent className="pt-1">
                                    {message.summary && (
                                      <p className="">
                                        Summary: <br />
                                        {message.summary}
                                      </p>
                                    )}
                                  </CollapsibleContent>
                                </Collapsible>
                              )}
                            </>
                          )}
                        </div>
                      )}
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
                    {message.role === "assistant" && !!message.error && (
                      <p
                        className="text-sm text-gray-500 mt-1 flex items-center gap-1 cursor-pointer"
                        onClick={() => handleRegenerate(message.id)}
                      >
                        Regenerate response <RefreshCcw className="size-4" />
                      </p>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => handleFeedback(message.id, "up")}
                          className={cn("flex items-center p-1 rounded", {
                            "text-green-500": message.feedback === "up",
                            "hover:bg-green-100": message.feedback !== "up",
                          })}
                        >
                          <ThumbsUp className="size-4" />
                        </button>
                        <button
                          onClick={() => handleFeedback(message.id, "down")}
                          className={cn("flex items-center p-1 rounded", {
                            "text-red-500": message.feedback === "down",
                            "hover:bg-red-100": message.feedback !== "down",
                          })}
                        >
                          <ThumbsDown className="size-4" />
                        </button>
                        <button
                          onClick={() => handleCopy(message.result_text || "")} // Ensure a string is passed
                          className="flex items-center p-1 rounded text-gray-600 hover:text-blue-500"
                        >
                          <Copy className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </ChatBubble>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </ChatMessageList>
      {showBottombar && sendMessage && (
        <ChatBottombar
          sendMessage={sendMessage}
          showInCenter={messages.length === 0}
        />
      )}
      <ErrorDialog />
    </div>
    </>
  );
}
