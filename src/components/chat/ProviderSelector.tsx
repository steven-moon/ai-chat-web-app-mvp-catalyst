import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, BrainIcon, MessageSquareIcon, ChevronDownIcon } from "lucide-react";

// Define model types
export interface AIModel {
  id: string;
  name: string;
  description?: string;
}

// Define provider interface
export interface AIProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  models: AIModel[];
  defaultModel: string;
}

// AI providers for the selector
export const aiProviders: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: <BrainIcon className="h-5 w-5" />,
    models: [
      { id: "gpt-4o", name: "GPT-4o", description: "Most capable model, best for complex tasks" },
      { id: "gpt-4o-mini", name: "GPT-4o Mini", description: "Smaller, faster version of GPT-4o" },
      { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and efficient for most tasks" },
      { id: "o1", name: "o1", description: "Advanced reasoning capabilities" },
      { id: "o1-mini", name: "o1-mini", description: "Smaller version of o1" },
      { id: "o1-preview", name: "o1-preview", description: "Preview version of o1" },
    ],
    defaultModel: "gpt-3.5-turbo",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    icon: <MessageSquareIcon className="h-5 w-5" />,
    models: [
      { id: "gemini-pro", name: "Gemini Pro", description: "Google's most capable text model" },
      { id: "gemini-pro-vision", name: "Gemini Pro Vision", description: "Handles both text and images" },
      { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Advanced multimodal capabilities" },
      { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Fast and efficient model" },
    ],
    defaultModel: "gemini-pro",
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    icon: <MessageSquareIcon className="h-5 w-5" />,
    models: [
      { id: "claude-3-opus", name: "Claude 3 Opus", description: "Most powerful Claude model" },
      { id: "claude-3-sonnet", name: "Claude 3 Sonnet", description: "Balanced performance and speed" },
      { id: "claude-3-haiku", name: "Claude 3 Haiku", description: "Fast and efficient" },
    ],
    defaultModel: "claude-3-sonnet",
  },
];

interface ProviderSelectorProps {
  selectedProvider: AIProvider;
  selectedModel: string;
  onProviderChange: (providerId: string, modelId: string) => void;
  onNewChat: () => void;
}

const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onNewChat,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the current model object
  const currentModel = selectedProvider.models.find(model => model.id === selectedModel) || 
                      { id: selectedModel, name: selectedModel };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  // Handle model selection
  const handleModelSelect = (providerId: string, modelId: string) => {
    console.log(`Selected model: ${providerId} - ${modelId}`);
    onProviderChange(providerId, modelId);
    setShowDropdown(false);
  };

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
      
      <div className="relative" ref={dropdownRef}>
        <Button 
          variant="secondary" 
          className="flex items-center gap-2 px-3 py-2"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          {selectedProvider.icon}
          <span className="hidden sm:inline">{selectedProvider.name}</span>
          <span className="text-xs text-muted-foreground hidden md:inline">
            {currentModel.name}
          </span>
          <ChevronDownIcon className="h-4 w-4 opacity-70" />
        </Button>

        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-64 rounded-md shadow-lg bg-popover border border-border z-50 max-h-[400px] overflow-y-auto">
            <div className="p-2">
              <h3 className="text-sm font-medium mb-2 text-muted-foreground">AI Providers</h3>
              <div className="space-y-4">
                {aiProviders.map((provider) => (
                  <div key={provider.id} className="space-y-1">
                    <div className={`flex items-center px-2 py-1.5 text-sm font-medium rounded-sm ${
                      provider.id === selectedProvider.id ? "bg-secondary" : ""
                    }`}>
                      {provider.icon}
                      <span className="ml-2">{provider.name}</span>
                    </div>
                    
                    <div className="ml-6 space-y-1 border-l pl-2">
                      {provider.models.map((model) => (
                        <button
                          key={model.id}
                          className={`w-full text-left px-2 py-1 text-sm rounded-sm hover:bg-accent ${
                            provider.id === selectedProvider.id && model.id === selectedModel
                              ? "bg-accent/50"
                              : ""
                          }`}
                          onClick={() => handleModelSelect(provider.id, model.id)}
                        >
                          <div>
                            <div>{model.name}</div>
                            {model.description && (
                              <div className="text-xs text-muted-foreground">
                                {model.description}
                              </div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderSelector;
