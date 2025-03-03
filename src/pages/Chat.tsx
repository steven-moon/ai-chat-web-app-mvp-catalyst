
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BrainIcon, MessageSquareIcon, PlusIcon, XIcon, ArrowLeftIcon } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import { Button } from "@/components/ui/button";
import { useChat } from "../contexts/ChatContext";
import { useUser } from "../contexts/UserContext";

// AI providers for the selector
const aiProviders = [
  {
    id: "openai",
    name: "OpenAI",
    icon: <BrainIcon className="h-5 w-5" />,
  },
  {
    id: "gemini",
    name: "Google Gemini",
    icon: <MessageSquareIcon className="h-5 w-5" />,
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    icon: <MessageSquareIcon className="h-5 w-5" />,
  },
];

const Chat: React.FC = () => {
  const { isAuthenticated } = useUser();
  const { chats, currentChat, setCurrentChat, addChat, addMessage } = useChat();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");
  const navigate = useNavigate();
  
  const [selectedProvider, setSelectedProvider] = useState(aiProviders[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat data when chatId changes
  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (chatId) {
      const chatToLoad = chats.find(chat => chat.id === chatId);
      if (chatToLoad) {
        setCurrentChat(chatToLoad);
        
        // Set the selected provider based on the chat's provider
        const providerToSelect = aiProviders.find(p => p.name === chatToLoad.provider) || aiProviders[0];
        setSelectedProvider(providerToSelect);
      } else {
        // If chat not found, redirect to history
        toast.error("Chat not found");
        navigate("/history");
      }
    } else {
      // If no chatId, create a new chat
      const newChatId = addChat(selectedProvider.name);
      navigate(`/chat?id=${newChatId}`, { replace: true });
    }
  }, [chatId, isAuthenticated, chats, setCurrentChat, navigate, addChat]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access chat");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSendMessage = (content: string) => {
    if (!currentChat) return;
    
    // Add user message
    addMessage(currentChat.id, {
      content,
      sender: "user",
      timestamp: new Date(),
    });
    
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      if (currentChat) {
        addMessage(currentChat.id, {
          content: `This is a simulated response from ${selectedProvider.name}. In a real application, this would be a response from the actual AI provider.`,
          sender: "ai",
          timestamp: new Date(),
        });
      }
      setIsProcessing(false);
    }, 1500);
  };

  const handleNewChat = () => {
    const newChatId = addChat(selectedProvider.name);
    navigate(`/chat?id=${newChatId}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen pt-20">
        {/* AI Provider Selector */}
        <div className="container py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/history")}
                className="md:hidden"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Chat</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleNewChat}
                className="flex items-center gap-1"
              >
                <PlusIcon className="h-4 w-4" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
              
              <div className="relative">
                <select
                  value={selectedProvider.id}
                  onChange={(e) => {
                    const provider = aiProviders.find((p) => p.id === e.target.value);
                    if (provider) setSelectedProvider(provider);
                  }}
                  className="appearance-none bg-secondary text-secondary-foreground px-4 py-2 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {aiProviders.map((provider) => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-secondary-foreground opacity-70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages Area */}
        <div className="flex-grow container py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {currentChat?.messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  sender: message.sender,
                  timestamp: new Date(message.timestamp),
                }}
                aiProvider={
                  message.sender === "ai" ? selectedProvider : undefined
                }
              />
            ))}
            <div ref={messagesEndRef} />
            
            {/* Processing indicator */}
            {isProcessing && (
              <div className="flex justify-start mb-4">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground max-w-[80%] md:max-w-[70%]">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="h-2 w-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0.2,
                    }}
                    className="h-2 w-2 bg-primary rounded-full"
                  />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: 0.4,
                    }}
                    className="h-2 w-2 bg-primary rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="container py-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;
