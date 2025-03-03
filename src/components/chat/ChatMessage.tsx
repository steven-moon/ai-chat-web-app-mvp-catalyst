import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserIcon, Copy, CheckIcon } from "lucide-react";
import { AIProvider } from "./ProviderSelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    sender: "user" | "ai";
    timestamp: Date;
  };
  aiProvider?: AIProvider;
  modelName?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, aiProvider, modelName }) => {
  const isUser = message.sender === "user";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
          className={`relative px-4 py-3 rounded-2xl group ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {/* Copy button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={copyToClipboard}
                  className={`absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                    isUser 
                      ? "bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground" 
                      : "bg-secondary-foreground/10 hover:bg-secondary-foreground/20 text-secondary-foreground"
                  }`}
                  aria-label="Copy message"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <CheckIcon className="h-3.5 w-3.5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={5}>
                {copied ? "Copied!" : "Copy message"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Copied notification */}
          <AnimatePresence>
            {copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute -top-8 right-0 px-2 py-1 rounded text-xs ${
                  isUser 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-secondary-foreground text-secondary"
                }`}
              >
                Copied!
              </motion.div>
            )}
          </AnimatePresence>

          {!isUser && modelName && (
            <div className="text-xs text-muted-foreground mb-1 font-medium">
              {aiProvider?.name} • {modelName}
            </div>
          )}
          <div className="text-sm pr-6">
            {message.content.split("\n").map((text, i) => (
              <div key={`${message.id}-line-${i}`} className="message-line">
                {text}
                {i < message.content.split("\n").length - 1 && <br />}
              </div>
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
