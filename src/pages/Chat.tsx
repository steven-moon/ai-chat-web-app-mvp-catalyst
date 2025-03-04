import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import MainLayout from "../components/layout/MainLayout";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";
import ChatHeader from "../components/chat/ChatHeader";
import { useChat } from "../contexts/ChatContext";
import { useUser } from "../contexts/UserContext";
import { aiProviders, AIProvider } from "../components/chat/ProviderSelector";
import { Message } from "../types/chat";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Chat: React.FC = () => {
  const { isAuthenticated, user } = useUser();
  const { 
    chats, 
    currentChat, 
    setCurrentChat, 
    addChat, 
    addMessage, 
    simulateAiResponse,
    generateAiResponse,
    updateChatProvider,
    isLoading 
  } = useChat();
  
  const [searchParams] = useSearchParams();
  const chatId = searchParams.get("id");
  const navigate = useNavigate();
  
  // Local state for UI
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(aiProviders[0]);
  const [selectedModel, setSelectedModel] = useState<string>(aiProviders[0].defaultModel);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  // Update local messages when currentChat changes
  useEffect(() => {
    if (currentChat) {
      setLocalMessages([...currentChat.messages]);
      
      // Check for API key errors in messages
      const errorMessages = currentChat.messages
        .filter(msg => msg.sender === "ai" && msg.content.startsWith("Error: Your OpenAI API key is invalid"));
      
      if (errorMessages.length > 0) {
        setApiKeyError("Your OpenAI API key appears to be invalid. Please check your settings.");
      } else {
        setApiKeyError(null);
      }
    }
  }, [currentChat]);

  // Load chat data when chatId changes
  useEffect(() => {
    if (!isAuthenticated) return;

    if (chatId) {
      const chatToLoad = chats.find(chat => chat.id === chatId);
      if (chatToLoad) {
        setCurrentChat(chatToLoad);
        
        // Set the selected provider based on the chat's provider
        const providerToSelect = aiProviders.find(p => p.id === chatToLoad.provider) || aiProviders[0];
        setSelectedProvider(providerToSelect);
        
        // Set the selected model based on the chat's model or use the default
        setSelectedModel(chatToLoad.model || providerToSelect.defaultModel);
      } else {
        toast.error("Chat not found");
        navigate("/history");
      }
    } else {
      // If no chatId, create a new chat
      const createNewChat = async () => {
        const newChatId = await addChat(selectedProvider.id, selectedModel);
        if (newChatId) {
          navigate(`/chat?id=${newChatId}`, { replace: true });
        } else {
          toast.error("Failed to create new chat");
        }
      };
      
      createNewChat();
    }
  }, [chatId, isAuthenticated, chats, setCurrentChat, navigate, addChat]);

  // Check if API key is valid for the selected provider
  useEffect(() => {
    if (selectedProvider.id === "openai") {
      const openAIKey = user?.preferences?.apiKeys?.openAI;
      
      // Log API key status (safely)
      console.log("Chat: Checking OpenAI API key:", {
        userExists: !!user,
        preferencesExist: !!user?.preferences,
        apiKeysExist: !!user?.preferences?.apiKeys,
        openAIKeyExists: !!openAIKey,
        openAIKeyValid: openAIKey ? openAIKey.startsWith("sk-") : false,
        openAIKeyMasked: openAIKey ? `${openAIKey.substring(0, 5)}...` : 'not set'
      });
      
      if (!openAIKey) {
        setApiKeyError("No OpenAI API key found. Please add your API key in Settings.");
      } else if (!openAIKey.startsWith("sk-")) {
        setApiKeyError("Your OpenAI API key appears to be invalid. API keys should start with 'sk-'.");
      } else {
        setApiKeyError(null);
      }
    } else {
      setApiKeyError(null);
    }
  }, [selectedProvider, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access chat");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleSendMessage = async (message: string) => {
    if (!chatId || !message.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Add user message to chat
      await addMessage(chatId, {
        content: message,
        sender: "user",
        timestamp: new Date(),
      });
      
      // Check if we have an API key for the selected provider
      const apiKeys = user?.preferences?.apiKeys;
      const hasApiKey = apiKeys && 
                      (selectedProvider.id === "openai" ? 
                        !!apiKeys.openAI : 
                        selectedProvider.id === "gemini" ? 
                        !!apiKeys.googleGemini : 
                        false);
      
      // Log API key information (safely)
      console.log("Chat: Using API keys for message:", {
        provider: selectedProvider.id,
        model: selectedModel,
        hasApiKeys: !!apiKeys,
        openAIKeyExists: !!apiKeys?.openAI,
        openAIKeyValid: apiKeys?.openAI ? apiKeys.openAI.startsWith("sk-") : false,
        openAIKeyMasked: apiKeys?.openAI ? `${apiKeys.openAI.substring(0, 5)}...` : 'not set',
        geminiKeyExists: !!apiKeys?.googleGemini,
        geminiKeyMasked: apiKeys?.googleGemini ? `${apiKeys.googleGemini.substring(0, 5)}...` : 'not set'
      });
      
      // Generate AI response
      if ((selectedProvider.id === "openai" || selectedProvider.id === "gemini") && hasApiKey) {
        // Use real API
        await generateAiResponse(chatId, selectedProvider.id, selectedModel);
      } else {
        // Use mock response for other providers or if no API key
        await simulateAiResponse(chatId, selectedProvider.id, selectedModel);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewChat = async () => {
    const newChatId = await addChat(selectedProvider.id, selectedModel);
    if (newChatId) {
      navigate(`/chat?id=${newChatId}`);
    } else {
      toast.error("Failed to create new chat");
    }
  };

  const handleProviderChange = (providerId: string, modelId: string) => {
    const provider = aiProviders.find(p => p.id === providerId) || aiProviders[0];
    setSelectedProvider(provider);
    setSelectedModel(modelId);
    
    // If we have a current chat, update its provider and model
    if (currentChat && chatId) {
      updateChatProvider(chatId, providerId, modelId);
      toast.success(`Switched to ${provider.name} with model ${modelId}`);
    }
  };

  const navigateToSettings = () => {
    navigate("/settings");
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        {/* Fixed header area with proper spacing for the navbar */}
        <div className="fixed top-[60px] left-0 right-0 z-40 bg-background">
          <ChatHeader
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onNewChat={handleNewChat}
            onProviderChange={handleProviderChange}
          />
          
          {apiKeyError && (
            <div className="px-4 py-2 bg-background border-b">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400 mr-2" />
                    <span className="text-red-800 dark:text-red-300 text-sm">{apiKeyError}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={navigateToSettings}
                    className="ml-4 text-xs"
                  >
                    Go to Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Scrollable content area with proper spacing */}
        <div className="absolute inset-0 top-[60px] bottom-[80px] mt-[60px] overflow-hidden">
          <div className="h-full overflow-y-auto">
            <ChatMessages 
              messages={localMessages} 
              isProcessing={isLoading || isProcessing}
              aiProvider={selectedProvider}
              modelName={selectedModel}
            />
          </div>
        </div>
        
        {/* Fixed footer area */}
        <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background z-30">
          <div className="max-w-screen-xl mx-auto">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isProcessing={isLoading || isProcessing}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Chat;

