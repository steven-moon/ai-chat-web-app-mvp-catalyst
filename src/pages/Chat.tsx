
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BrainIcon, MessageSquareIcon } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";
import ChatHeader from "../components/chat/ChatHeader";
import { useChat } from "../contexts/ChatContext";
import { useUser } from "../contexts/UserContext";
import { aiProviders } from "../components/chat/ProviderSelector";

const Chat: React.FC = () => {
  const { isAuthenticated } = useUser();
  const { chats, currentChat, setCurrentChat, addChat, addMessage } = useChat();
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");
  const navigate = useNavigate();
  
  const [selectedProvider, setSelectedProvider] = useState(aiProviders[0]);
  const [isProcessing, setIsProcessing] = useState(false);

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
        const providerToSelect = aiProviders.find(p => p.id === chatToLoad.provider) || aiProviders[0];
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

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access chat");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSendMessage = async (content: string) => {
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
      // Ensure we're still using the same chat ID
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

  const handleProviderChange = (providerId: string) => {
    const provider = aiProviders.find((p) => p.id === providerId);
    if (provider) setSelectedProvider(provider);
  };

  return (
    <MainLayout>
      <div className="flex flex-col min-h-screen pt-20">
        {/* Chat Header with AI Provider Selector */}
        <ChatHeader
          selectedProvider={selectedProvider}
          onProviderChange={handleProviderChange}
          onNewChat={handleNewChat}
        />

        {/* Chat Messages Area */}
        {currentChat && (
          <ChatMessages
            messages={currentChat.messages}
            isProcessing={isProcessing}
            aiProvider={selectedProvider}
          />
        )}

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
