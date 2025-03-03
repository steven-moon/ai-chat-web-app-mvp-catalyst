import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ProcessingIndicator from "./ProcessingIndicator";
import { Message } from "../../types/chat";

interface ChatMessagesProps {
  messages: Message[];
  isProcessing: boolean;
  aiProvider: {
    id: string;
    name: string;
    icon: React.ReactNode;
  };
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isProcessing,
  aiProvider,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add debugging log
  useEffect(() => {
    console.log("ChatMessages received messages:", messages.length);
    messages.forEach((msg, index) => {
      console.log(`Message ${index}: ${msg.sender} - ${msg.content.substring(0, 20)}...`);
    });
  }, [messages]);

  return (
    <div className="flex-grow container py-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
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
