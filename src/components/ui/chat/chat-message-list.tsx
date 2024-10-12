import * as React from "react";

import { cn } from "@/lib/utils";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, ...props }, ref) => (
    <div
      className={cn(
        "flex flex-col w-full h-full py-4 @md:px-4 gap-5 overflow-y-auto",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
