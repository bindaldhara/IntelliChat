import * as React from "react";

import { Textarea } from "@ui/textarea";

import { cn } from "@/lib/utils";

interface ChatInputProps {
  className?: string;
  value?: string;
  onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, value, onKeyDown, onChange, placeholder, ...props }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
    }, [value]);

    return (
      <Textarea
        autoComplete="off"
        value={value}
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
          textareaRef.current = node;
        }}
        onKeyDown={onKeyDown}
        onChange={onChange}
        name="message"
        placeholder={placeholder}
        rows={1}
        className={cn(
          "min-h-12 max-h-16 h-fit px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center resize-none",
          className
        )}
        {...props}
      />
    );
  }
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
