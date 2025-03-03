
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProviderCard from "../components/home/ProviderCard";
import MainLayout from "../components/layout/MainLayout";
import { MessageSquareIcon, BrainIcon, ArrowRightIcon, GithubIcon, TwitterIcon } from "lucide-react";

// AI Provider data
const providers = [
  {
    id: "openai",
    name: "OpenAI",
    description: "Access GPT models with advanced reasoning and understanding capabilities.",
    icon: <BrainIcon className="h-8 w-8" />,
  },
  {
    id: "gemini",
    name: "Google Gemini",
    description: "Leverage Google's multimodal AI for text, code, and image understanding.",
    icon: <MessageSquareIcon className="h-8 w-8" />,
  },
  {
    id: "claude",
    name: "Anthropic Claude",
    description: "Engage with Claude's nuanced understanding and helpful responses.",
    icon: <MessageSquareIcon className="h-8 w-8" />,
  },
];

// Features data
const features = [
  {
    title: "Multiple AI Providers",
    description: "Switch seamlessly between different AI models based on your needs.",
    icon: <MessageSquareIcon className="h-6 w-6" />,
  },
  {
    title: "Conversation History",
    description: "Save and revisit your previous chats with complete context.",
    icon: <MessageSquareIcon className="h-6 w-6" />,
  },
  {
    title: "Beautiful UI",
    description: "Enjoy a sleek, responsive interface that adapts to your device.",
    icon: <MessageSquareIcon className="h-6 w-6" />,
  },
];

const Index: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6">
                <span className="text-primary">Unlock</span> the Power of AI Conversations
              </h1>
              <p className="text-lg text-muted-foreground mb-8 md:mb-10">
                A seamless interface to chat with multiple AI models. Experience intelligent conversations with state-of-the-art language models.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/chat">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium"
                  >
                    Start Chatting
                  </motion.button>
                </Link>
                <Link to="/history">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl border border-border text-foreground font-medium"
                  >
                    View History
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-primary/5 to-transparent -z-10"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl -z-10"
        ></motion.div>
      </section>

      {/* Providers Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight mb-4"
            >
              Choose Your AI Provider
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Access multiple AI models through a single, intuitive interface.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider, index) => (
              <ProviderCard
                key={provider.id}
                name={provider.name}
                description={provider.description}
                icon={provider.icon}
                delay={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="container">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground max-w-2xl mx-auto"
            >
              Everything you need for seamless AI interactions
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-6 border border-border"
              >
                <div className="mb-4 text-primary h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass p-8 md:p-12 rounded-2xl"
            >
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Ready to Start Chatting?
              </h2>
              <p className="text-muted-foreground mb-8">
                Begin your AI conversation journey with just a click.
              </p>
              <Link to="/chat">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium inline-flex items-center"
                >
                  Start a New Chat
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="text-2xl font-semibold mb-2">
                <span className="text-primary">AI</span>Chat
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Clever Coding LLC. MIT License <a href="https://www.clevercoding.com" target="_blank" rel="noopener noreferrer">www.clevercoding.com</a>
              </p>
            </div>
            <div className="flex space-x-4">
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <TwitterIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </MainLayout>
  );
};

export default Index;
