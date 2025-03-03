
import React from "react";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 10,
    },
    enter: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.61, 1, 0.88, 1],
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      transition: {
        duration: 0.2,
        ease: [0.61, 1, 0.88, 1],
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        className="flex-grow"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default MainLayout;
