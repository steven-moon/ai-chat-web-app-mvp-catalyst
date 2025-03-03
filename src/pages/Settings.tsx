import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Save, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "../components/layout/MainLayout";
import { useUser } from "@/contexts/UserContext";
import { useNavigate, Link } from "react-router-dom";

const Settings: React.FC = () => {
  const { user, isAuthenticated, updateProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // API keys state
  const [openAIKey, setOpenAIKey] = useState("");
  const [googleGeminiKey, setGoogleGeminiKey] = useState("");
  const [anthropicKey, setAnthropicKey] = useState("");
  
  // Load user data when component mounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    
    // Load API keys if they exist
    if (user.preferences?.apiKeys) {
      setOpenAIKey(user.preferences.apiKeys.openAI || "");
      setGoogleGeminiKey(user.preferences.apiKeys.googleGemini || "");
      setAnthropicKey(user.preferences.apiKeys.anthropic || "");
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleSaveAPIKeys = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        preferences: {
          ...user?.preferences,
          apiKeys: {
            openAI: openAIKey,
            googleGemini: googleGeminiKey,
            anthropic: anthropicKey
          }
        }
      });
      
      toast({
        title: "API Keys saved",
        description: "Your API keys have been securely saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API keys",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // or a loading state
  }

  return (
    <MainLayout>
      <div className="container pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">API Settings</h1>
            <Button variant="outline" asChild>
              <Link to="/profile">Back to Profile</Link>
            </Button>
          </div>
          
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Your API keys are stored locally in your browser and are not sent to our servers. 
              These keys will be used to authenticate requests to the respective AI services.
            </AlertDescription>
          </Alert>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Service API Keys</CardTitle>
              <CardDescription>
                Enter your API keys for the AI services you want to use. 
                These keys will be used to authenticate your requests to these services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI API Key</label>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="sk-..."
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI dashboard</a>.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Gemini API Key</label>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="AIza..."
                    value={googleGeminiKey}
                    onChange={(e) => setGoogleGeminiKey(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from the <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Anthropic Claude API Key</label>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="sk-ant-..."
                    value={anthropicKey}
                    onChange={(e) => setAnthropicKey(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from the <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="underline">Anthropic Console</a>.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto"
                onClick={handleSaveAPIKeys}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save API Keys"}
                {!isLoading && <Save className="ml-2 h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Settings; 