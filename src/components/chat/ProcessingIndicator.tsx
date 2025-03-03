
import React from "react";
import { motion } from "framer-motion";

const ProcessingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-center space-x-2 px-4 py-2 rounded-2xl bg-secondary text-secondary-foreground max-w-[80%] md:max-w-[70%]">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
          className="h-2 w-2 bg-primary rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2,
          }}
          className="h-2 w-2 bg-primary rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.4,
          }}
          className="h-2 w-2 bg-primary rounded-full"
        />
      </div>
    </div>
  );
};

export default ProcessingIndicator;
