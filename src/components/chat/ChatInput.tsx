
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SendIcon, MicIcon, PaperclipIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isProcessing = false,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage("");
      
      // Reset height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="relative border border-border bg-background rounded-xl shadow-sm p-2"
    >
      <div className="flex items-end">
        {/* Attachment button */}
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Attach file"
        >
          <PaperclipIcon className="h-5 w-5" />
        </button>

        {/* Textarea input */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-grow resize-none bg-transparent border-0 focus:ring-0 focus:outline-none py-2 px-3 max-h-[150px] overflow-y-auto"
          disabled={isProcessing}
        />

        {/* Voice input button */}
        <button
          type="button"
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Voice input"
        >
          <MicIcon className="h-5 w-5" />
        </button>

        {/* Send button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={`p-2 rounded-lg ${
            message.trim() && !isProcessing
              ? "text-white bg-primary"
              : "text-muted-foreground bg-muted"
          } transition-colors`}
          disabled={!message.trim() || isProcessing}
          aria-label="Send message"
        >
          <SendIcon className="h-5 w-5" />
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ChatInput;
