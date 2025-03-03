
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useUser } from "./UserContext";

// Define types
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

// Initial welcome message
const createWelcomeMessage = (): Message => ({
  id: "welcome-" + Date.now(),
  content: "Hello! How can I assist you today?",
  sender: "ai",
  timestamp: new Date(),
});

// Sample mock data
const mockChats: ChatSession[] = [
  {
    id: "chat1",
    title: "Understanding Quantum Computing",
    preview: "Can you explain the basics of quantum computing in simple terms?",
    messages: [
      {
        id: "msg1-1",
        content: "Can you explain the basics of quantum computing in simple terms?",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        id: "msg1-2",
        content: "Quantum computing uses quantum bits or qubits, which can exist in multiple states simultaneously thanks to superposition. This allows quantum computers to process complex problems much faster than classical computers for certain tasks like factoring large numbers or simulating quantum systems.",
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 30000), // 30 seconds after
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    provider: "OpenAI",
  },
  {
    id: "chat2",
    title: "Recipe Recommendations",
    preview: "I need some dinner ideas that are quick and healthy...",
    messages: [
      {
        id: "msg2-1",
        content: "I need some dinner ideas that are quick and healthy. I'm vegetarian and have about 20 minutes to cook.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        id: "msg2-2",
        content: "Here are some quick vegetarian dinner ideas:\n\n1. Stir-fried vegetables with tofu and rice\n2. Greek yogurt bowl with chickpeas, cucumber, and olive oil\n3. Quick bean quesadillas with avocado\n4. Veggie pasta with garlic and olive oil\n5. Microwave sweet potato with black beans and salsa",
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 + 45000), // 45 seconds after
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    provider: "Gemini",
  },
  {
    id: "chat3",
    title: "JavaScript Help",
    preview: "How do I use async/await in JavaScript?",
    messages: [
      {
        id: "msg3-1",
        content: "How do I use async/await in JavaScript? I'm struggling with promises.",
        sender: "user",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      },
      {
        id: "msg3-2",
        content: "Async/await is a way to work with promises in a more readable, synchronous-like manner.\n\n```javascript\n// Define an async function\nasync function fetchData() {\n  try {\n    // The await keyword pauses execution until the promise resolves\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error fetching data:', error);\n  }\n}\n\n// Call the async function\nfetchData().then(data => {\n  console.log(data);\n});\n```\n\nKey points:\n1. Mark functions with `async` keyword to use await inside them\n2. Use `await` before promises to wait for their resolution\n3. Error handling with try/catch blocks\n4. Async functions always return promises",
        sender: "ai",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 60000), // 1 minute after
      },
    ],
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    provider: "Claude",
  },
];

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);

  // Load chats from localStorage on initial render and when user changes
  useEffect(() => {
    if (user) {
      const storedChats = localStorage.getItem(`chats-${user.id}`);
      if (storedChats) {
        try {
          // Parse the JSON string and convert string dates back to Date objects
          const parsedChats = JSON.parse(storedChats, (key, value) => {
            if (key === "timestamp" && typeof value === "string") {
              return new Date(value);
            }
            return value;
          });
          setChats(parsedChats);
        } catch (error) {
          console.error("Error parsing stored chats:", error);
          setChats(mockChats);
        }
      } else {
        // Use mock data for new users
        setChats(mockChats);
        saveChatsToStorage(mockChats, user.id);
      }
    } else {
      // Reset to empty if no user
      setChats([]);
      setCurrentChat(null);
    }
  }, [user]);

  // Save chats to localStorage
  const saveChatsToStorage = (updatedChats: ChatSession[], userId: string) => {
    localStorage.setItem(`chats-${userId}`, JSON.stringify(updatedChats));
  };

  // Add a new chat
  const addChat = (provider: string): string => {
    if (!user) return "";

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
    saveChatsToStorage(updatedChats, user.id);
    return newChat.id;
  };

  // Update chat details
  const updateChat = (chatId: string, chatData: Partial<ChatSession>) => {
    if (!user) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const updatedChat = { ...chat, ...chatData };
        
        // If title is not provided but there are user messages, generate title from first user message
        if (!chatData.title && chat.messages.length > 1 && !chat.title.startsWith("New Conversation")) {
          const firstUserMessage = chat.messages.find(msg => msg.sender === "user");
          if (firstUserMessage) {
            // Limit title length to first 30 characters of first user message
            updatedChat.title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
          }
        }
        
        // Update preview with last user message
        if (!chatData.preview) {
          const lastUserMessage = [...chat.messages].reverse().find(msg => msg.sender === "user");
          if (lastUserMessage) {
            updatedChat.preview = lastUserMessage.content.substring(0, 60) + (lastUserMessage.content.length > 60 ? "..." : "");
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
    
    saveChatsToStorage(updatedChats, user.id);
  };

  // Delete a chat
  const deleteChat = (chatId: string) => {
    if (!user) return;

    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    // Reset current chat if the deleted one was active
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
    
    saveChatsToStorage(updatedChats, user.id);
  };

  // Add a message to a chat
  const addMessage = (chatId: string, messageData: Omit<Message, "id">) => {
    if (!user) return;

    const newMessage: Message = {
      id: "msg-" + Date.now(),
      ...messageData,
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const updatedMessages = [...chat.messages, newMessage];
        const updatedChat: ChatSession = {
          ...chat,
          messages: updatedMessages,
          timestamp: new Date(),
        };
        
        // Update title and preview if this is the first or second message
        if (updatedMessages.length <= 2 && chat.title === "New Conversation" && messageData.sender === "user") {
          updatedChat.title = messageData.content.substring(0, 30) + (messageData.content.length > 30 ? "..." : "");
        }
        
        // Always update preview with latest user message if sender is user
        if (messageData.sender === "user") {
          updatedChat.preview = messageData.content.substring(0, 60) + (messageData.content.length > 60 ? "..." : "");
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
    
    saveChatsToStorage(updatedChats, user.id);
  };

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
