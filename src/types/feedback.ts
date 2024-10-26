export interface Feedback {
  id: string;
  messageId: string;
  feedback: "up" | "down";
  userId?: string; 
  createdAt: string;
  updatedAt: string;
}
