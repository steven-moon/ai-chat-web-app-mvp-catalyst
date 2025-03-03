
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useUser } from "./UserContext";
import { ChatSession, Message } from "../types/chat";
import { saveChatsToStorage } from "../utils/chatUtils";
import { mockChats } from "../data/mockChats";
import { useChatOperations } from "../hooks/useChatOperations";

// Define the context type
interface ChatContextType {
  chats: ChatSession[];
  currentChat: ChatSession | null;
  setCurrentChat: (chat: ChatSession | null) => void;
  addChat: (provider: string) => string;
  updateChat: (chatId: string, chatData: Partial<ChatSession>) => void;
  deleteChat: (chatId: string) => void;
  addMessage: (chatId: string, message: Omit<Message, "id">) => void;
}

// Create context
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  setCurrentChat: () => {},
  addChat: () => "",
  updateChat: () => {},
  deleteChat: () => {},
  addMessage: () => {},
});

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();

  // Load initial chats
  const loadInitialChats = (): ChatSession[] => {
    if (!user) return [];

    const storedChats = localStorage.getItem(`chats-${user.id}`);
    if (storedChats) {
      try {
        // Parse the JSON string and convert string dates back to Date objects
        return JSON.parse(storedChats, (key, value) => {
          if (key === "timestamp" && typeof value === "string") {
            return new Date(value);
          }
          return value;
        });
      } catch (error) {
        console.error("Error parsing stored chats:", error);
        // Use mock data if parsing fails
        saveChatsToStorage(mockChats, user.id);
        return mockChats;
      }
    } else {
      // Use mock data for new users
      saveChatsToStorage(mockChats, user.id);
      return mockChats;
    }
  };

  // Initialize chat operations with user ID and initial chats
  const {
    chats,
    currentChat,
    setCurrentChat,
    addChat,
    updateChat,
    deleteChat,
    addMessage
  } = useChatOperations(user?.id, loadInitialChats());

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        addChat,
        updateChat,
        deleteChat,
        addMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
