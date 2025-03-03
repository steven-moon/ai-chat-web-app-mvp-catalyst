import { Message, ChatSession } from "../types/chat";

// Creates a welcome message for new chats
export const createWelcomeMessage = (): Message => ({
  id: "welcome-" + Date.now(),
  content: "Hello! How can I assist you today?",
  sender: "ai",
  timestamp: new Date(),
});

// Saves chat data to localStorage for persistence
export const saveChatsToStorage = (updatedChats: ChatSession[], userId: string) => {
  localStorage.setItem(`chats-${userId}`, JSON.stringify(updatedChats));
};

// Generates a title from the first user message
export function generateTitleFromMessage(message: string): string {
  // Limit title length to first 30 characters of user message
  return message.substring(0, 30) + (message.length > 30 ? "..." : "");
}

// Generates a preview from a user message
export function generatePreviewFromMessage(message: string): string {
  // Limit preview length to first 60 characters of user message
  return message.substring(0, 60) + (message.length > 60 ? "..." : "");
}

// Format date for display
export function formatDate(date: Date): string {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

// Check if a message is a duplicate
export function isDuplicateMessage(existingMessages: Message[], newMessage: Message): boolean {
  return existingMessages.some(msg => 
    msg.sender === newMessage.sender && 
    msg.content === newMessage.content &&
    Math.abs(new Date(msg.timestamp).getTime() - new Date(newMessage.timestamp).getTime()) < 5000
  );
}
