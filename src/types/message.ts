export interface UserMessage {
  role: "user";
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface AssistantMessage {
  role: "assistant";
  id: string;
  timestamp?: number;
  summary?: string;
  result_text?: string;
  result_table_path?: string;
  result_visualization_path?: string;
  error?: string;
  loading?: boolean;
}

export type Message = UserMessage | AssistantMessage;
