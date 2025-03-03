
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageSquareIcon, ArrowRightIcon } from "lucide-react";

interface HistoryItemProps {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  provider: string;
  index: number;
}

const HistoryItem: React.FC<HistoryItemProps> = ({
  id,
  title,
  preview,
  timestamp,
  provider,
  index,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/chat?id=${id}`} className="block">
        <div className="p-5 pr-10 rounded-xl border border-border hover:border-primary/30 bg-card hover:bg-card/60 transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <MessageSquareIcon className="h-5 w-5" />
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-card-foreground line-clamp-1">
                  {title}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {new Date(timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {preview}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                  {provider}
                </span>
                <motion.span
                  whileHover={{ x: 3 }}
                  className="text-primary"
                >
                  <ArrowRightIcon className="h-4 w-4" />
                </motion.span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HistoryItem;
