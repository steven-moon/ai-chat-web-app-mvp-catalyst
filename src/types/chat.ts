
// Defines types for chat functionality
export interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
  timestamp: Date;
  provider: string;
}
