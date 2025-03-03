
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";
import ProviderSelector from "./ProviderSelector";

interface ChatHeaderProps {
  selectedProvider: {
    id: string;
    name: string;
    icon: React.ReactNode;
  };
  onProviderChange: (providerId: string) => void;
  onNewChat: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  selectedProvider,
  onProviderChange,
  onNewChat,
}) => {
  const navigate = useNavigate();

  return (
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
        
        <ProviderSelector
          selectedProvider={selectedProvider}
          onProviderChange={onProviderChange}
          onNewChat={onNewChat}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
