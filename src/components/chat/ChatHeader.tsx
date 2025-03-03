import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ProviderSelector, { AIProvider } from "./ProviderSelector";

interface ChatHeaderProps {
  selectedProvider: AIProvider;
  selectedModel: string;
  onProviderChange: (providerId: string, modelId: string) => void;
  onNewChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onNewChat,
}) => {
  const navigate = useNavigate();

  return (
    <div className="py-2 px-4 border-b border-border bg-background shadow-sm">
      <div className="flex items-center justify-between max-w-screen-xl mx-auto">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate("/history")}
            className="md:hidden"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">Current Chat</h2>
        </div>
        
        <div className="relative" style={{ zIndex: 100 }}>
          <ProviderSelector
            selectedProvider={selectedProvider}
            selectedModel={selectedModel}
            onProviderChange={onProviderChange}
            onNewChat={onNewChat}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
