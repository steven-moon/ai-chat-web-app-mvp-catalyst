
import React from "react";
import { motion } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import HistoryItem from "../components/history/HistoryItem";
import { SearchIcon } from "lucide-react";

// Example chat history data
const chatHistory = [
  {
    id: "chat1",
    title: "Understanding Quantum Computing",
    preview: "Can you explain the basics of quantum computing in simple terms?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    provider: "OpenAI",
  },
  {
    id: "chat2",
    title: "Recipe Recommendations",
    preview: "I need some dinner ideas that are quick and healthy...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    provider: "Gemini",
  },
  {
    id: "chat3",
    title: "JavaScript Help",
    preview: "How do I use async/await in JavaScript?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    provider: "Claude",
  },
  {
    id: "chat4",
    title: "Travel Planning",
    preview: "I'm planning a trip to Japan. What are some must-visit places?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    provider: "OpenAI",
  },
  {
    id: "chat5",
    title: "Book Recommendations",
    preview: "Can you recommend some science fiction books?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    provider: "Gemini",
  },
];

const History: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter chats based on search query
  const filteredChats = chatHistory.filter(
    (chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.preview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="min-h-screen pt-28 pb-16">
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

            {/* History list */}
            {filteredChats.length > 0 ? (
              <div className="space-y-4">
                {filteredChats.map((chat, index) => (
                  <HistoryItem
                    key={chat.id}
                    id={chat.id}
                    title={chat.title}
                    preview={chat.preview}
                    timestamp={chat.timestamp}
                    provider={chat.provider}
                    index={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center py-16"
              >
                <p className="text-muted-foreground">
                  {searchQuery
                    ? "No matching conversations found"
                    : "No chat history yet"}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default History;
