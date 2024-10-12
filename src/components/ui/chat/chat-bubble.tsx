import * as React from "react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import MessageLoading from "./message-loading";
import { LucideIcon } from "lucide-react";

const VariantContext = React.createContext<
  "sent" | "received" | null | undefined
>("sent");

const useVariant = () => {
  const context = React.useContext(VariantContext);
  if (!context) {
    throw new Error("useVariant is called outside the context");
  }
  return context;
};

// ChatBubble
const chatBubbleVariant = cva(
  "flex gap-2 max-w-[90%] @md:max-w-[80%] items-end relative mx-2",
  {
    variants: {
      variant: {
        received: "self-start",
        sent: "self-end flex-row-reverse",
      },
      layout: {
        default: "",
        ai: "max-w-full w-full items-center",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  }
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, layout, children, ...props }, ref) => (
    <div
      className={cn(chatBubbleVariant({ variant, layout, className }))}
      ref={ref}
      {...props}
    >
      <VariantContext.Provider value={variant}>
        {children}
      </VariantContext.Provider>
    </div>
  )
);
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar

interface ChatBubbleAvatarProps {
  icon: LucideIcon;
  className?: string;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  icon: Icon,
  className,
}) => (
  <Icon className={cn("w-5 h-5 bg-gray-200 p-1 rounded-full", className)} />
);

// ChatBubbleMessage
const chatBubbleMessageVariants = cva("p-4", {
  variants: {
    variant: {
      received: "bg-gray-200/50 text-black rounded-r-lg rounded-tl-lg",
      sent: "bg-[#ebe7fb] text-gray-950 rounded-l-lg rounded-tr-lg",
    },
    layout: {
      default: "",
      ai: "border-t w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "break-words max-w-full whitespace-pre-wrap"
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  )
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div className={cn("text-xs mt-2 text-right", className)} {...props}>
    {timestamp}
  </div>
);

const chatBubbleReadRecieptVariants = cva("text-xs mt-1 text-gray-400", {
  variants: {
    variant: {
      received: "hidden",
      sent: "text-right",
    },
  },
  defaultVariants: {
    variant: "received",
  },
});

// ChatBubbleReadReciept
interface ChatBubbleReadRecieptProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof chatBubbleReadRecieptVariants> {
  readReciept?: boolean;
}

const ChatBubbleReadReciept: React.FC<ChatBubbleReadRecieptProps> = ({
  readReciept,
  className,
  ...props
}) => {
  const variant = useVariant();
  return (
    <p
      className={cn(chatBubbleReadRecieptVariants({ variant, className }))}
      {...props}
    >
      {readReciept ? "Read" : "Sent"}
    </p>
  );
};

export {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  chatBubbleMessageVariants,
  ChatBubbleReadReciept,
  ChatBubbleTimestamp,
  chatBubbleVariant,
};
