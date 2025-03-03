import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ProcessingIndicator from "./ProcessingIndicator";
import { Message } from "../../types/chat";
import { AIProvider } from "./ProviderSelector";

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  aiProvider: AIProvider;
  modelName?: string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isProcessing,
  aiProvider,
  modelName,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full px-4">
      <div className="max-w-4xl mx-auto py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="text-4xl mb-4">{aiProvider.icon}</div>
            <h3 className="text-xl font-medium mb-2">Start a conversation with {aiProvider.name}</h3>
            {modelName && (
              <p className="text-sm text-muted-foreground mb-4">
                Using model: <span className="font-medium">{modelName}</span>
              </p>
            )}
            <p className="text-muted-foreground max-w-md">
              Ask a question or start a conversation to get assistance from AI.
            </p>
          </div>
        )}
        
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={{
              id: message.id,
              content: message.content,
              sender: message.sender,
              timestamp: new Date(message.timestamp),
            }}
            aiProvider={
              message.sender === "ai" ? aiProvider : undefined
            }
            modelName={message.sender === "ai" ? modelName : undefined}
          />
        ))}
        <div ref={messagesEndRef} />
        
        {/* Processing indicator */}
        {isProcessing && <ProcessingIndicator />}
      </div>
    </div>
  );
};

export default ChatMessages;
