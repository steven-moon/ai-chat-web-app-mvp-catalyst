import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useUser } from "./UserContext";
import { ChatSession, Message } from "../types/chat";
import { mockChats } from "../data/mockChats";
import chatApi from "../api/chatApi";

// Define the context type
interface ChatContextType {
  chats: ChatSession[];
  currentChat: ChatSession | null;
  setCurrentChat: (chat: ChatSession | null) => void;
  isLoading: boolean;
  addChat: (provider: string) => Promise<string>;
  updateChat: (chatId: string, chatData: Partial<ChatSession>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  addMessage: (chatId: string, message: Omit<Message, "id">) => Promise<void>;
  simulateAiResponse: (chatId: string, provider: string) => Promise<void>;
}

// Create context
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  setCurrentChat: () => {},
  isLoading: false,
  addChat: async () => "",
  updateChat: async () => {},
  deleteChat: async () => {},
  addMessage: async () => {},
  simulateAiResponse: async () => {},
});

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chats when user changes
  useEffect(() => {
    const loadChats = async () => {
      if (!user) {
        setChats([]);
        setCurrentChat(null);
        return;
      }

      setIsLoading(true);
      try {
        // Get chats from API
        let userChats = await chatApi.getChats(user.id);
        
        // If no chats found, initialize with mock data
        if (userChats.length === 0) {
          // Save mock chats to storage
          for (const chat of mockChats) {
            await chatApi.updateChat(user.id, chat.id, chat);
          }
          userChats = mockChats;
        }
        
        setChats(userChats);
      } catch (error) {
        console.error("Error loading chats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [user]);

  // Add a new chat
  const addChat = async (provider: string): Promise<string> => {
    if (!user) return "";
    
    setIsLoading(true);
    try {
      const newChat = await chatApi.createChat(user.id, provider);
      setChats(prevChats => [newChat, ...prevChats]);
      setCurrentChat(newChat);
      return newChat.id;
    } catch (error) {
      console.error("Error adding chat:", error);
      return "";
    } finally {
      setIsLoading(false);
    }
  };

  // Update a chat
  const updateChat = async (chatId: string, chatData: Partial<ChatSession>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedChat = await chatApi.updateChat(user.id, chatId, chatData);
      
      if (updatedChat) {
        setChats(prevChats => 
          prevChats.map(chat => chat.id === chatId ? updatedChat : chat)
        );
        
        // Update current chat if it's the one being modified
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Error updating chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const success = await chatApi.deleteChat(user.id, chatId);
      
      if (success) {
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        
        // Reset current chat if the deleted one was active
        if (currentChat?.id === chatId) {
          setCurrentChat(null);
        }
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add a message to a chat
  const addMessage = async (chatId: string, messageData: Omit<Message, "id">): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedChat = await chatApi.addMessage(user.id, chatId, messageData);
      
      if (updatedChat) {
        setChats(prevChats => 
          prevChats.map(chat => chat.id === chatId ? updatedChat : chat)
        );
        
        // Update current chat if it's the one being modified
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

  // Simulate AI response
  const simulateAiResponse = async (chatId: string, provider: string): Promise<void> => {
    if (!user) return;
    
    try {
      const updatedChat = await chatApi.simulateAiResponse(user.id, chatId, provider);
      
      if (updatedChat) {
        setChats(prevChats => 
          prevChats.map(chat => chat.id === chatId ? updatedChat : chat)
        );
        
        // Update current chat if it's the one being modified
        if (currentChat?.id === chatId) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Error simulating AI response:", error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        setCurrentChat,
        isLoading,
        addChat,
        updateChat,
        deleteChat,
        addMessage,
        simulateAiResponse,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
