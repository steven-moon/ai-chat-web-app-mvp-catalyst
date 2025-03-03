import { useState } from "react";
import { ChatSession, Message } from "../types/chat";
import { 
  createWelcomeMessage, 
  saveChatsToStorage, 
  generateTitleFromMessage, 
  generatePreviewFromMessage 
} from "../utils/chatUtils";

export const useChatOperations = (
  userId: string | undefined,
  initialChats: ChatSession[]
) => {
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);

  // Add a new chat
  const addChat = (provider: string): string => {
    if (!userId) return "";

    const newChat: ChatSession = {
      id: "chat-" + Date.now(),
      title: "New Conversation",
      preview: "Start a new conversation...",
      messages: [createWelcomeMessage()],
      timestamp: new Date(),
      provider,
    };

    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setCurrentChat(newChat);
    saveChatsToStorage(updatedChats, userId);
    return newChat.id;
  };

  // Update chat details
  const updateChat = (chatId: string, chatData: Partial<ChatSession>) => {
    if (!userId) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const updatedChat = { ...chat, ...chatData };
        
        // If title is not provided but there are user messages, generate title from first user message
        if (!chatData.title && chat.messages.length > 1 && !chat.title.startsWith("New Conversation")) {
          const firstUserMessage = chat.messages.find(msg => msg.sender === "user");
          if (firstUserMessage) {
            updatedChat.title = generateTitleFromMessage(firstUserMessage.content);
          }
        }
        
        // Update preview with last user message
        if (!chatData.preview) {
          const lastUserMessage = [...chat.messages].reverse().find(msg => msg.sender === "user");
          if (lastUserMessage) {
            updatedChat.preview = generatePreviewFromMessage(lastUserMessage.content);
          }
        }
        
        return updatedChat;
      }
      return chat;
    });

    setChats(updatedChats);
    
    // Also update currentChat if it's the one being modified
    if (currentChat?.id === chatId) {
      const updatedCurrentChat = updatedChats.find(chat => chat.id === chatId) || null;
      setCurrentChat(updatedCurrentChat);
    }
    
    saveChatsToStorage(updatedChats, userId);
  };

  // Delete a chat
  const deleteChat = (chatId: string) => {
    if (!userId) return;

    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    // Reset current chat if the deleted one was active
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
    
    saveChatsToStorage(updatedChats, userId);
  };

  // Add a message to a chat
  const addMessage = (chatId: string, messageData: Omit<Message, "id">) => {
    if (!userId) return;

    const newMessage: Message = {
      id: `msg-${messageData.sender}-${Date.now()}`,
      ...messageData,
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        // Create a map of existing messages by sender and timestamp to detect potential duplicates
        const existingMessageMap = new Map();
        chat.messages.forEach(msg => {
          const key = `${msg.sender}-${msg.timestamp.toString().substring(0, 15)}`;
          existingMessageMap.set(key, true);
        });
        
        // Check if this message might be a duplicate (same sender and similar timestamp)
        const newMessageKey = `${newMessage.sender}-${newMessage.timestamp.toString().substring(0, 15)}`;
        const isDuplicate = existingMessageMap.has(newMessageKey);
        
        // Always preserve all existing messages and add the new one
        // Don't replace any messages, just append
        const updatedMessages = [...chat.messages];
        
        // Only add if it's not a potential duplicate
        if (!isDuplicate) {
          updatedMessages.push(newMessage);
        }
        
        const updatedChat: ChatSession = {
          ...chat,
          messages: updatedMessages,
          timestamp: new Date(),
        };
        
        // Update title if this is the first user message and title is still default
        if (messageData.sender === "user" && 
            (chat.title === "New Conversation" || chat.title === "Start a new conversation...")) {
          updatedChat.title = generateTitleFromMessage(messageData.content);
        }
        
        // Always update preview with latest user message if sender is user
        if (messageData.sender === "user") {
          updatedChat.preview = generatePreviewFromMessage(messageData.content);
        }
        
        return updatedChat;
      }
      return chat;
    });

    setChats(updatedChats);
    
    // Update current chat if it's the one being modified
    const updatedCurrentChat = updatedChats.find(chat => chat.id === chatId) || null;
    if (currentChat?.id === chatId) {
      setCurrentChat(updatedCurrentChat);
    }
    
    saveChatsToStorage(updatedChats, userId);
  };

  return {
    chats,
    currentChat,
    setCurrentChat,
    addChat,
    updateChat,
    deleteChat,
    addMessage
  };
};
