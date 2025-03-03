import { ChatSession, Message } from "../types/chat";
import { createWelcomeMessage, generateTitleFromMessage, generatePreviewFromMessage, isDuplicateMessage } from "../utils/chatUtils";

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Local storage keys
const CHATS_STORAGE_KEY = 'chat_sessions';

class ChatApi {
  // Get all chats for a user
  async getChats(userId: string): Promise<ChatSession[]> {
    await delay(300); // Simulate network delay
    
    try {
      const storedChats = localStorage.getItem(`${CHATS_STORAGE_KEY}_${userId}`);
      if (storedChats) {
        // Parse the JSON string and convert string dates back to Date objects
        return JSON.parse(storedChats, (key, value) => {
          if (key === "timestamp" && typeof value === "string") {
            return new Date(value);
          }
          return value;
        });
      }
    } catch (error) {
      console.error("Error retrieving chats:", error);
    }
    
    return [];
  }
  
  // Get a single chat by ID
  async getChatById(userId: string, chatId: string): Promise<ChatSession | null> {
    await delay(200); // Simulate network delay
    
    try {
      const chats = await this.getChats(userId);
      return chats.find(chat => chat.id === chatId) || null;
    } catch (error) {
      console.error("Error retrieving chat:", error);
      return null;
    }
  }
  
  // Create a new chat
  async createChat(userId: string, provider: string): Promise<ChatSession> {
    await delay(300); // Simulate network delay
    
    const newChat: ChatSession = {
      id: `chat-${Date.now()}`,
      title: "New Conversation",
      preview: "Start a new conversation...",
      messages: [createWelcomeMessage()],
      timestamp: new Date(),
      provider,
    };
    
    try {
      const chats = await this.getChats(userId);
      const updatedChats = [newChat, ...chats];
      await this.saveChats(userId, updatedChats);
      return newChat;
    } catch (error) {
      console.error("Error creating chat:", error);
      return newChat; // Return the new chat even if saving failed
    }
  }
  
  // Update a chat
  async updateChat(userId: string, chatId: string, chatData: Partial<ChatSession>): Promise<ChatSession | null> {
    await delay(300); // Simulate network delay
    
    try {
      const chats = await this.getChats(userId);
      let updatedChat: ChatSession | null = null;
      
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          // If we're updating messages, ensure we're not losing any
          if (chatData.messages && chat.messages) {
            // Create a map of existing message IDs
            const existingMessageIds = new Set(chat.messages.map(msg => msg.id));
            
            // Add any messages from chatData that don't exist in the current chat
            const combinedMessages = [...chat.messages];
            
            chatData.messages.forEach(newMsg => {
              if (!existingMessageIds.has(newMsg.id) && 
                  !isDuplicateMessage(combinedMessages, newMsg)) {
                combinedMessages.push(newMsg);
              }
            });
            
            // Sort messages by timestamp
            combinedMessages.sort((a, b) => 
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );
            
            // Update chatData with combined messages
            chatData.messages = combinedMessages;
          }
          
          updatedChat = { ...chat, ...chatData };
          
          // If title is not provided but there are user messages, generate title from first user message
          if (!chatData.title && chat.messages.length > 1 && chat.title === "New Conversation") {
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
      
      await this.saveChats(userId, updatedChats);
      return updatedChat;
    } catch (error) {
      console.error("Error updating chat:", error);
      return null;
    }
  }
  
  // Delete a chat
  async deleteChat(userId: string, chatId: string): Promise<boolean> {
    await delay(300); // Simulate network delay
    
    try {
      const chats = await this.getChats(userId);
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      await this.saveChats(userId, updatedChats);
      return true;
    } catch (error) {
      console.error("Error deleting chat:", error);
      return false;
    }
  }
  
  // Add a message to a chat
  async addMessage(userId: string, chatId: string, messageData: Omit<Message, "id">): Promise<ChatSession | null> {
    await delay(500); // Simulate network delay
    
    try {
      // Get the current chat
      const chat = await this.getChatById(userId, chatId);
      if (!chat) return null;
      
      // Create a new message with a unique ID
      const newMessage: Message = {
        id: `msg-${messageData.sender}-${Date.now()}`,
        ...messageData,
      };
      
      // Check if this message might be a duplicate
      if (isDuplicateMessage(chat.messages, newMessage)) {
        console.log("Duplicate message detected, not adding:", newMessage);
        return chat;
      }
      
      // Add the message to the chat
      const updatedMessages = [...chat.messages, newMessage];
      
      // Update the chat
      const updatedChat: ChatSession = {
        ...chat,
        messages: updatedMessages,
        timestamp: new Date(),
      };
      
      // Update title if this is the first user message and title is still default
      if (messageData.sender === "user" && chat.title === "New Conversation") {
        updatedChat.title = generateTitleFromMessage(messageData.content);
      }
      
      // Always update preview with latest user message if sender is user
      if (messageData.sender === "user") {
        updatedChat.preview = generatePreviewFromMessage(messageData.content);
      }
      
      // Save the updated chat
      return await this.updateChat(userId, chatId, updatedChat);
    } catch (error) {
      console.error("Error adding message:", error);
      return null;
    }
  }
  
  // Simulate AI response
  async simulateAiResponse(userId: string, chatId: string, provider: string): Promise<ChatSession | null> {
    await delay(1500); // Simulate AI thinking time
    
    try {
      // Get the current chat to ensure we have the latest state
      const chat = await this.getChatById(userId, chatId);
      if (!chat) return null;
      
      // Create AI message
      const aiMessage: Omit<Message, "id"> = {
        content: `This is a simulated response from ${provider}. In a real application, this would be a response from the actual AI provider.`,
        sender: "ai",
        timestamp: new Date(),
      };
      
      // Add the AI message to the chat
      return await this.addMessage(userId, chatId, aiMessage);
    } catch (error) {
      console.error("Error simulating AI response:", error);
      return null;
    }
  }
  
  // Private method to save chats to localStorage
  private async saveChats(userId: string, chats: ChatSession[]): Promise<void> {
    await delay(200); // Simulate network delay
    
    try {
      localStorage.setItem(`${CHATS_STORAGE_KEY}_${userId}`, JSON.stringify(chats));
    } catch (error) {
      console.error("Error saving chats:", error);
    }
  }
}

// Create and export a singleton instance
const chatApi = new ChatApi();
export default chatApi; 