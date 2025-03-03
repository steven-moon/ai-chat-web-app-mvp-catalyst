
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";

const NotFound: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <h2 className="text-3xl font-semibold mt-4 mb-6">Page not found</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
              >
                <ArrowLeftIcon className="mr-2 h-4 w-4" />
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFound;
