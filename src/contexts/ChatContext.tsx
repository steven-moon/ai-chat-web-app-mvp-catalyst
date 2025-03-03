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
  addChat: (provider: string, model: string) => Promise<string | null>;
  updateChat: (chatId: string, chatData: Partial<ChatSession>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  addMessage: (chatId: string, message: Omit<Message, "id">) => Promise<void>;
  simulateAiResponse: (chatId: string, provider: string, model: string) => Promise<void>;
  generateAiResponse: (chatId: string, provider: string, model: string) => Promise<void>;
  updateChatProvider: (chatId: string, provider: string, model: string) => Promise<void>;
}

// Create context
const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  setCurrentChat: () => {},
  isLoading: false,
  addChat: async () => null,
  updateChat: async () => {},
  deleteChat: async () => {},
  addMessage: async () => {},
  simulateAiResponse: async () => {},
  generateAiResponse: async () => {},
  updateChatProvider: async () => {},
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
  const addChat = async (provider: string, model: string): Promise<string | null> => {
    if (!user) return null;
    
    try {
      const newChat = await chatApi.createChat(user.id, provider, model);
      if (newChat) {
        setChats(prevChats => [newChat, ...prevChats]);
        setCurrentChat(newChat);
        return newChat.id;
      }
      return null;
    } catch (error) {
      console.error("Error creating chat:", error);
      return null;
    }
  };

  // Update a chat
  const updateChat = async (chatId: string, chatData: Partial<ChatSession>): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedChat = await chatApi.updateChat(user.id, chatId, chatData);
      
      if (updatedChat) {
        // Update chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId ? updatedChat : chat
          )
        );
        
        // Update current chat if it's the one being updated
        if (currentChat && currentChat.id === chatId) {
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
        // Remove from chats list
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
        
        // Clear current chat if it's the one being deleted
        if (currentChat && currentChat.id === chatId) {
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
    
    setIsLoading(true);
    try {
      const updatedChat = await chatApi.addMessage(user.id, chatId, messageData);
      
      if (updatedChat) {
        // Update chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId ? updatedChat : chat
          )
        );
        
        // Update current chat if it's the one being updated
        if (currentChat && currentChat.id === chatId) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI response using the appropriate provider
  const generateAiResponse = async (chatId: string, provider: string, model: string): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Log API key information (safely)
      const apiKey = user.preferences?.apiKeys?.openAI;
      if (provider === 'openai' && apiKey) {
        const maskedKey = apiKey.length > 14 
          ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`
          : 'invalid-key-format';
        console.log(`ChatContext: Using OpenAI API key: ${maskedKey}`);
        console.log(`ChatContext: Using model: ${model}`);
      }
      
      const updatedChat = await chatApi.generateAiResponse(
        user.id, 
        chatId, 
        provider,
        model,
        user.preferences?.apiKeys
      );
      
      if (updatedChat) {
        // Update chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId ? updatedChat : chat
          )
        );
        
        // Update current chat if it's the one being updated
        if (currentChat && currentChat.id === chatId) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate AI response (legacy method, kept for backward compatibility)
  const simulateAiResponse = async (chatId: string, provider: string, model: string): Promise<void> => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock AI response
      const mockResponse = `This is a simulated response from ${provider} using the ${model} model. In a real application, this would be a response from the actual AI provider.`;
      
      // Add the AI message to the chat
      const aiMessage: Omit<Message, "id"> = {
        content: mockResponse,
        sender: "ai",
        timestamp: new Date(),
      };
      
      const updatedChat = await chatApi.addMessage(user.id, chatId, aiMessage);
      
      if (updatedChat) {
        // Update chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId ? updatedChat : chat
          )
        );
        
        // Update current chat if it's the one being updated
        if (currentChat && currentChat.id === chatId) {
          setCurrentChat(updatedChat);
        }
      }
    } catch (error) {
      console.error("Error simulating AI response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add updateChatProvider function
  const updateChatProvider = async (chatId: string, provider: string, model: string): Promise<void> => {
    if (!user) return;
    
    try {
      const chat = await chatApi.getChatById(user.id, chatId);
      if (!chat) return;
      
      const updatedChat: ChatSession = {
        ...chat,
        provider,
        model,
        timestamp: new Date(),
      };
      
      const result = await chatApi.updateChat(user.id, chatId, updatedChat);
      
      if (result) {
        // Update chats list
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId ? result : chat
          )
        );
        
        // Update current chat if it's the one being updated
        if (currentChat && currentChat.id === chatId) {
          setCurrentChat(result);
        }
      }
    } catch (error) {
      console.error("Error updating chat provider:", error);
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
        generateAiResponse,
        updateChatProvider,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);
