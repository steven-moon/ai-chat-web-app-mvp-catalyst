
import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { BrainIcon, MessageSquareIcon } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";

// Example AI providers for the selector
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

// Example initial message
const welcomeMessage = {
  id: "welcome",
  content: "Hello! How can I assist you today?",
  sender: "ai" as const,
  timestamp: new Date(),
};

const Chat: React.FC = () => {
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");
  
  const [messages, setMessages] = useState([welcomeMessage]);
  const [selectedProvider, setSelectedProvider] = useState(aiProviders[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content,
      sender: "user" as const, // Fix: Explicitly type as "user" literal
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `This is a simulated response from ${selectedProvider.name}. In a real application, this would be a response from the actual AI provider.`,
        sender: "ai" as const, // Fix: Explicitly type as "ai" literal
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen pt-20">
        {/* AI Provider Selector */}
        <div className="container py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Chat</h1>
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

        {/* Chat Messages Area */}
        <div className="flex-grow container py-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
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
