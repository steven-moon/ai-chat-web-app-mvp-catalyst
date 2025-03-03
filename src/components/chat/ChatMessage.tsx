
import React from "react";
import { motion } from "framer-motion";
import { UserIcon } from "lucide-react";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
  };
  aiProvider?: {
    name: string;
    icon: React.ReactNode;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, aiProvider }) => {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`flex max-w-[80%] md:max-w-[70%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
            isUser ? "ml-3" : "mr-3"
          } ${
            isUser
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {isUser ? (
            <UserIcon className="h-5 w-5" />
          ) : (
            aiProvider?.icon || <div className="h-5 w-5" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          <div className="text-sm">
            {message.content.split("\n").map((text, i) => (
              <React.Fragment key={i}>
                {text}
                {i < message.content.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <div
            className={`text-xs mt-1 ${
              isUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
