import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, BrainIcon, MessageSquareIcon } from "lucide-react";

// AI providers for the selector
export const aiProviders = [
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

interface ProviderSelectorProps {
  selectedProvider: {
    id: string;
    name: string;
    icon: React.ReactNode;
  };
  onProviderChange: (providerId: string) => void;
  onNewChat: () => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
  onNewChat,
}) => {
  return (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        size="sm"
        onClick={onNewChat}
        className="flex items-center gap-1"
      >
        <PlusIcon className="h-4 w-4" />
        <span className="hidden sm:inline">New Chat</span>
      </Button>
      
      <div className="relative">
        <select
          value={selectedProvider.id}
          onChange={(e) => onProviderChange(e.target.value)}
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
  );
};

export default ProviderSelector;
