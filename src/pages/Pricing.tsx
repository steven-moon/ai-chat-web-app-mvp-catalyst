
import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    toast("Sign up feature coming soon!", {
      description: "We're working on our authentication system."
    });
    navigate("/profile");
  };

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started with AI chat",
      features: [
        "10 AI messages per day",
        "Basic chat history",
        "Text-only responses",
        "Standard response time"
      ],
      highlighted: false,
      buttonVariant: "outline" as const,
    },
    {
      name: "Starter",
      price: "$9.99",
      period: "per month",
      description: "Ideal for regular users who need more capabilities",
      features: [
        "100 AI messages per day",
        "Advanced chat history",
        "Text and image responses",
        "Faster response time",
        "Save favorite conversations"
      ],
      highlighted: true,
      buttonVariant: "default" as const,
    },
    {
      name: "Pro",
      price: "$19.99",
      period: "per month",
      description: "For power users who need maximum capability",
      features: [
        "Unlimited AI messages",
        "Complete chat history",
        "Text, image, and file responses",
        "Priority response time",
        "Custom AI model settings",
        "API access",
        "24/7 support"
      ],
      highlighted: false,
      buttonVariant: "outline" as const,
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
        >
          Choose the right plan for <span className="text-primary">you</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto"
        >
          Get started with our AI chat platform today. Upgrade anytime to unlock more features.
        </motion.p>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      >
        {plans.map((plan) => (
          <motion.div key={plan.name} variants={itemVariants}>
            <Card className={`h-full flex flex-col ${
              plan.highlighted 
                ? "border-primary shadow-lg shadow-primary/20" 
                : ""
            }`}>
              <CardHeader>
                {plan.highlighted && (
                  <div className="py-1 px-3 bg-primary/10 text-primary text-sm rounded-full font-medium w-fit mb-4">
                    Most Popular
                  </div>
                )}
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="mr-2 h-5 w-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full group"
                  variant={plan.buttonVariant}
                  onClick={handleSignup}
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <h2 className="text-2xl font-bold mb-4">Need a custom solution?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Contact our team to discuss enterprise plans tailored to your organization's specific needs.
        </p>
        <Button variant="outline" onClick={() => toast("Enterprise inquiry feature coming soon!")}>
          Contact Sales
        </Button>
      </motion.div>
    </div>
  );
};

export default PricingPage;
