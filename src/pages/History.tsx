import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SearchIcon, PlusIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import HistoryItem from "../components/history/HistoryItem";
import { useChat } from "../contexts/ChatContext";
import { useUser } from "../contexts/UserContext";
import { Button } from "@/components/ui/button";

const History: React.FC = () => {
  const { user, isAuthenticated } = useUser();
  const { chats, addChat, deleteChat, isLoading } = useChat();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const navigate = useNavigate();

  // Filter chats based on search query
  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleNewChat = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to start a new chat");
      navigate("/login");
      return;
    }
    
    setIsCreatingChat(true);
    try {
      const newChatId = await addChat("OpenAI", "gpt-3.5-turbo");
      if (newChatId) {
        navigate(`/chat?id=${newChatId}`);
      } else {
        toast.error("Failed to create new chat");
      }
    } catch (error) {
      console.error("Error creating chat:", error);
      toast.error("Failed to create new chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    setIsDeleting(chatId);
    
    try {
      await deleteChat(chatId);
      toast.success("Chat deleted successfully");
    } catch (error) {
      toast.error("Failed to delete chat");
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px)] pt-28 pb-16 overflow-y-auto">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold"
              >
                Chat History
              </motion.h1>

              <div className="flex flex-col md:flex-row gap-3">
                {/* New Chat Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <Button
                    onClick={handleNewChat}
                    disabled={isCreatingChat}
                    className="w-full md:w-auto flex items-center gap-2"
                  >
                    {isCreatingChat ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <PlusIcon className="h-4 w-4" />
                    )}
                    {isCreatingChat ? "Creating..." : "New Chat"}
                  </Button>
                </motion.div>

                {/* Search bar */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative"
                >
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                </motion.div>
              </div>
            </div>

            {/* Loading state */}
            {isLoading && !isDeleting && !isCreatingChat ? (
              <div className="flex justify-center items-center py-16">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading chats...</span>
              </div>
            ) : isAuthenticated ? (
              filteredChats.length > 0 ? (
                <div className="space-y-4">
                  {filteredChats.map((chat, index) => (
                    <div key={chat.id} className="relative group">
                      <HistoryItem
                        id={chat.id}
                        title={chat.title}
                        preview={chat.preview}
                        timestamp={new Date(chat.timestamp)}
                        provider={chat.provider}
                        index={index}
                      />
                      
                      {/* Delete button */}
                      <motion.button
                        initial={{ opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteChat(chat.id)}
                        disabled={isDeleting === chat.id}
                        className="absolute top-1/2 right-3 -translate-y-1/2 p-2 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete chat"
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </motion.button>
                      
                      {isDeleting === chat.id && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-xl">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground mb-4">
                    {searchQuery
                      ? "No matching conversations found"
                      : "No chat history yet"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={handleNewChat} disabled={isCreatingChat}>
                      {isCreatingChat ? (
                        <Loader2Icon className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <PlusIcon className="h-4 w-4 mr-2" />
                      )}
                      {isCreatingChat ? "Creating..." : "Start a new chat"}
                    </Button>
                  )}
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground mb-4">
                  Please log in to view your chat history
                </p>
                <Button onClick={() => navigate("/login")}>
                  Log in
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
