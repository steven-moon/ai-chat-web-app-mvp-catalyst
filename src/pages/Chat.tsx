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
  const { isAuthenticated, user, updateProfile } = useUser();
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
  
  // Find the default provider and model from user preferences or use the first provider
  const getInitialProvider = () => {
    if (user?.preferences?.lastUsedProvider) {
      const savedProvider = aiProviders.find(p => p.id === user.preferences.lastUsedProvider);
      if (savedProvider) {
        return savedProvider;
      }
    }
    return aiProviders[0];
  };

  const getInitialModel = (provider: AIProvider) => {
    if (user?.preferences?.lastUsedModel && 
        provider.models.some(m => m.id === user.preferences.lastUsedModel)) {
      return user.preferences.lastUsedModel;
    }
    return provider.defaultModel;
  };

  // Local state for UI
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(getInitialProvider());
  const [selectedModel, setSelectedModel] = useState<string>(getInitialModel(getInitialProvider()));
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
    } else {
      setLocalMessages([]);
    }
  }, [currentChat]);

  // Update selected provider and model when user changes
  useEffect(() => {
    if (user) {
      const provider = getInitialProvider();
      setSelectedProvider(provider);
      setSelectedModel(getInitialModel(provider));
      
      console.log("Loaded user preferences for provider and model:", {
        provider: provider.id,
        model: getInitialModel(provider),
        fromPreferences: !!user.preferences?.lastUsedProvider
      });
    }
  }, [user]);

  // Load chat data when chatId changes
  useEffect(() => {
    const loadChat = async () => {
      if (chatId) {
        const chat = chats.find(c => c.id === chatId);
        if (chat) {
          setCurrentChat(chat);
          
          // If the chat has a provider and model, use those
          if (chat.provider && chat.model) {
            const provider = aiProviders.find(p => p.id === chat.provider) || aiProviders[0];
            setSelectedProvider(provider);
            setSelectedModel(chat.model);
            
            console.log("Using provider and model from chat:", {
              provider: provider.id,
              model: chat.model
            });
          }
        } else {
          // If chat not found, create a new one with the current provider and model
          const newChatId = await addChat(selectedProvider.id, selectedModel);
          if (newChatId) {
            navigate(`/chat?id=${newChatId}`);
          } else {
            toast.error("Failed to create chat");
            navigate("/");
          }
        }
      } else {
        // No chatId provided, create a new chat with the current provider and model
        const newChatId = await addChat(selectedProvider.id, selectedModel);
        if (newChatId) {
          navigate(`/chat?id=${newChatId}`);
        } else {
          toast.error("Failed to create chat");
          navigate("/");
        }
      }
    };

    if (isAuthenticated) {
      loadChat();
    }
  }, [chatId, chats, isAuthenticated, navigate, addChat, selectedProvider.id, selectedModel]);

  // Check if API key is valid for the selected provider
  useEffect(() => {
    if (selectedProvider.id === "openai") {
      const openAIKey = user?.preferences?.apiKeys?.openAI;
      
      console.log("Chat: Checking OpenAI API key and user preferences:", {
        apiKeysExist: !!user?.preferences?.apiKeys,
        openAIKeyExists: !!openAIKey,
        openAIKeyValid: openAIKey ? openAIKey.startsWith("sk-") : false,
        openAIKeyMasked: openAIKey ? `${openAIKey.substring(0, 5)}...` : 'not set',
        lastUsedProvider: user?.preferences?.lastUsedProvider || 'not set',
        lastUsedModel: user?.preferences?.lastUsedModel || 'not set'
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
                        selectedProvider.id === "claude" ?
                        !!apiKeys.anthropic :
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
        geminiKeyMasked: apiKeys?.googleGemini ? `${apiKeys.googleGemini.substring(0, 5)}...` : 'not set',
        anthropicKeyExists: !!apiKeys?.anthropic,
        anthropicKeyMasked: apiKeys?.anthropic ? `${apiKeys.anthropic.substring(0, 5)}...` : 'not set'
      });
      
      // Generate AI response
      if ((selectedProvider.id === "openai" || selectedProvider.id === "gemini" || selectedProvider.id === "claude") && hasApiKey) {
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

    // Save the selected provider and model to user preferences
    if (user && user.preferences) {
      const updatedPreferences = {
        ...user.preferences,
        lastUsedProvider: providerId,
        lastUsedModel: modelId
      };
      
      // Update user preferences
      updateProfile({
        preferences: updatedPreferences
      }).then(() => {
        console.log("Saved last used provider and model to preferences:", {
          provider: providerId,
          model: modelId
        });
      }).catch(error => {
        console.error("Failed to save provider preferences:", error);
      });
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

