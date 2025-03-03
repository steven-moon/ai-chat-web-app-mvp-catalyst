import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "../components/layout/MainLayout";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";
import ChatHeader from "../components/chat/ChatHeader";
import { useChat } from "../contexts/ChatContext";
import { useUser } from "../contexts/UserContext";
import { aiProviders } from "../components/chat/ProviderSelector";
import { Message } from "../types/chat";

const Chat: React.FC = () => {
  const { isAuthenticated } = useUser();
  const { 
    chats, 
    currentChat, 
    setCurrentChat, 
    addChat, 
    addMessage, 
    simulateAiResponse,
    isLoading 
  } = useChat();
  
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");
  const navigate = useNavigate();
  
  // Local state for UI
  const [selectedProvider, setSelectedProvider] = useState(aiProviders[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  // Debug logging for messages
  useEffect(() => {
    if (localMessages.length > 0) {
      console.log("Local messages updated:", localMessages.length);
      localMessages.forEach((msg, i) => {
        console.log(`Local message ${i}: ${msg.sender} - ${msg.content.substring(0, 30)}...`);
      });
    }
  }, [localMessages]);

  // Update local messages when currentChat changes
  useEffect(() => {
    if (currentChat) {
      console.log("Current chat updated, syncing messages:", currentChat.messages.length);
      setLocalMessages([...currentChat.messages]);
    }
  }, [currentChat]);

  // Load chat data when chatId changes
  useEffect(() => {
    if (!isAuthenticated) return;

    if (chatId) {
      const chatToLoad = chats.find(chat => chat.id === chatId);
      if (chatToLoad) {
        console.log("Loading chat:", chatToLoad.id, "with messages:", chatToLoad.messages.length);
        setCurrentChat(chatToLoad);
        
        // Set the selected provider based on the chat's provider
        const providerToSelect = aiProviders.find(p => p.id === chatToLoad.provider) || aiProviders[0];
        setSelectedProvider(providerToSelect);
      } else {
        toast.error("Chat not found");
        navigate("/history");
      }
    } else {
      // If no chatId, create a new chat
      const createNewChat = async () => {
        const newChatId = await addChat(selectedProvider.id);
        if (newChatId) {
          navigate(`/chat?id=${newChatId}`, { replace: true });
        } else {
          toast.error("Failed to create new chat");
        }
      };
      
      createNewChat();
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
    
    const chatId = currentChat.id;
    
    // Create a temporary user message for immediate display
    const tempUserMessage: Message = {
      id: `temp-user-msg-${Date.now()}`,
      content,
      sender: "user",
      timestamp: new Date(),
    };
    
    // Add user message to local messages immediately for UI responsiveness
    setLocalMessages(prevMessages => [...prevMessages, tempUserMessage]);
    
    // Set processing state
    setIsProcessing(true);
    
    try {
      // Add user message to the chat via API
      await addMessage(chatId, {
        content: tempUserMessage.content,
        sender: tempUserMessage.sender,
        timestamp: tempUserMessage.timestamp,
      });
      
      // Simulate AI response
      await simulateAiResponse(chatId, selectedProvider.name);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = async () => {
    const newChatId = await addChat(selectedProvider.id);
    if (newChatId) {
      navigate(`/chat?id=${newChatId}`);
    } else {
      toast.error("Failed to create new chat");
    }
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
        <ChatMessages
          messages={localMessages}
          isProcessing={isProcessing || isLoading}
          aiProvider={selectedProvider}
        />

        {/* Chat Input Area */}
        <div className="container py-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <ChatInput
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing || isLoading}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;

