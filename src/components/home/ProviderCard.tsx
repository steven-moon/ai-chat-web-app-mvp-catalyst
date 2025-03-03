
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRightIcon } from "lucide-react";

interface ProviderCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  name,
  description,
  icon,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="glass rounded-xl overflow-hidden h-full"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="mb-4 text-primary flex items-center justify-center h-16 w-16 rounded-xl bg-primary/10">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{name}</h3>
        <p className="text-muted-foreground mb-6 flex-grow">{description}</p>
        <Link
          to="/chat"
          className="inline-flex items-center text-primary font-medium hover:underline"
        >
          Start chatting
          <motion.span
            initial={{ x: 0 }}
            whileHover={{ x: 4 }}
            className="ml-1"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProviderCard;
