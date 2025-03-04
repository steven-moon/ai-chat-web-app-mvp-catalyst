import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Save, AlertCircle, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
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
  
  // Password visibility state
  const [showOpenAIKey, setShowOpenAIKey] = useState(false);
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);
  
  // Validation state
  const [openAIKeyValid, setOpenAIKeyValid] = useState<boolean | null>(null);
  const [geminiKeyValid, setGeminiKeyValid] = useState<boolean | null>(null);
  const [anthropicKeyValid, setAnthropicKeyValid] = useState<boolean | null>(null);
  
  // Load user data when component mounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    
    // Debug localStorage when component mounts
    console.log("Settings: Component mounted, checking localStorage");
    debugLocalStorage();
    
    // Load API keys if they exist
    if (user.preferences?.apiKeys) {
      const storedOpenAIKey = user.preferences.apiKeys.openAI || "";
      setOpenAIKey(storedOpenAIKey);
      validateOpenAIKey(storedOpenAIKey);
      
      const storedGeminiKey = user.preferences.apiKeys.googleGemini || "";
      setGoogleGeminiKey(storedGeminiKey);
      validateGeminiKey(storedGeminiKey);
      
      const storedAnthropicKey = user.preferences.apiKeys.anthropic || "";
      setAnthropicKey(storedAnthropicKey);
      validateAnthropicKey(storedAnthropicKey);
      
      console.log("Settings: Loaded API keys from user object:", {
        openAI: storedOpenAIKey ? `${storedOpenAIKey.substring(0, 5)}...` : 'not set',
        googleGemini: storedGeminiKey ? `${storedGeminiKey.substring(0, 5)}...` : 'not set',
        anthropic: storedAnthropicKey ? `${storedAnthropicKey.substring(0, 5)}...` : 'not set'
      });
    } else {
      console.log("Settings: No API keys found in user object");
    }
  }, [user, isAuthenticated, navigate]);
  
  // Validate OpenAI API key format
  const validateOpenAIKey = (key: string): boolean => {
    const isValid = key === "" || key.startsWith("sk-");
    setOpenAIKeyValid(key === "" ? null : isValid);
    return isValid;
  };
  
  // Validate Gemini API key format
  const validateGeminiKey = (key: string): boolean => {
    const isValid = key === "" || key.startsWith("AIza");
    setGeminiKeyValid(key === "" ? null : isValid);
    return isValid;
  };
  
  // Validate Anthropic API key format
  const validateAnthropicKey = (key: string): boolean => {
    const isValid = key === "" || key.startsWith("sk-ant");
    setAnthropicKeyValid(key === "" ? null : isValid);
    return isValid;
  };
  
  // Handle OpenAI key change
  const handleOpenAIKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setOpenAIKey(newKey);
    validateOpenAIKey(newKey);
  };
  
  // Handle Gemini key change
  const handleGeminiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setGoogleGeminiKey(newKey);
    validateGeminiKey(newKey);
  };
  
  // Handle Anthropic key change
  const handleAnthropicKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setAnthropicKey(newKey);
    validateAnthropicKey(newKey);
  };
  
  const handleSaveAPIKeys = async () => {
    setIsLoading(true);
    try {
      // Trim whitespace from keys
      const trimmedOpenAIKey = openAIKey.trim();
      const trimmedGeminiKey = googleGeminiKey.trim();
      const trimmedAnthropicKey = anthropicKey.trim();
      
      // Validate OpenAI key format
      if (trimmedOpenAIKey && !validateOpenAIKey(trimmedOpenAIKey)) {
        toast({
          title: "Invalid OpenAI API Key",
          description: "OpenAI API keys should start with 'sk-'",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Validate Gemini key format
      if (trimmedGeminiKey && !validateGeminiKey(trimmedGeminiKey)) {
        toast({
          title: "Invalid Google Gemini API Key",
          description: "Google Gemini API keys should start with 'AIza'",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Validate Anthropic key format
      if (trimmedAnthropicKey && !validateAnthropicKey(trimmedAnthropicKey)) {
        toast({
          title: "Invalid Anthropic API Key",
          description: "Anthropic API keys should start with 'sk-ant'",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Log the API keys being saved (safely)
      console.log("Settings: Saving API keys:", {
        openAI: trimmedOpenAIKey ? `${trimmedOpenAIKey.substring(0, 5)}...` : 'not set',
        googleGemini: trimmedGeminiKey ? `${trimmedGeminiKey.substring(0, 5)}...` : 'not set',
        anthropic: trimmedAnthropicKey ? `${trimmedAnthropicKey.substring(0, 5)}...` : 'not set'
      });
      
      // Debug localStorage before update
      console.log("Settings: Checking localStorage before update");
      debugLocalStorage();
      
      // Create the updated preferences object
      const updatedPreferences = {
        ...user?.preferences,
        apiKeys: {
          openAI: trimmedOpenAIKey,
          googleGemini: trimmedGeminiKey,
          anthropic: trimmedAnthropicKey
        }
      };
      
      // Update the user profile with the new preferences
      await updateProfile({
        preferences: updatedPreferences
      });
      
      // Direct update to localStorage as a fallback
      try {
        const currentUserJson = localStorage.getItem("currentUser");
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson);
          
          // Ensure preferences object exists
          if (!currentUser.preferences) {
            currentUser.preferences = {};
          }
          
          // Ensure apiKeys object exists
          if (!currentUser.preferences.apiKeys) {
            currentUser.preferences.apiKeys = {};
          }
          
          // Update API keys
          currentUser.preferences.apiKeys.openAI = trimmedOpenAIKey;
          currentUser.preferences.apiKeys.googleGemini = trimmedGeminiKey;
          currentUser.preferences.apiKeys.anthropic = trimmedAnthropicKey;
          
          // Save back to localStorage
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          
          console.log("Settings: Directly updated API keys in localStorage as fallback");
        }
        
        // Also update the users array in localStorage
        const usersJson = localStorage.getItem("users");
        if (usersJson && user) {
          const users = JSON.parse(usersJson);
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          
          if (userIndex !== -1) {
            // Ensure preferences object exists
            if (!users[userIndex].preferences) {
              users[userIndex].preferences = {};
            }
            
            // Ensure apiKeys object exists
            if (!users[userIndex].preferences.apiKeys) {
              users[userIndex].preferences.apiKeys = {};
            }
            
            // Update API keys
            users[userIndex].preferences.apiKeys.openAI = trimmedOpenAIKey;
            users[userIndex].preferences.apiKeys.googleGemini = trimmedGeminiKey;
            users[userIndex].preferences.apiKeys.anthropic = trimmedAnthropicKey;
            
            // Save back to localStorage
            localStorage.setItem("users", JSON.stringify(users));
            
            console.log("Settings: Directly updated API keys in users array as fallback");
          }
        }
      } catch (error) {
        console.error("Error directly updating localStorage:", error);
      }
      
      // Verify the keys were saved by checking localStorage directly
      const verifyUserJson = localStorage.getItem("currentUser");
      if (verifyUserJson) {
        const verifyUser = JSON.parse(verifyUserJson);
        const savedKeys = verifyUser.preferences?.apiKeys;
        
        console.log("Settings: Verified saved API keys in localStorage:", {
          openAI: savedKeys?.openAI ? `${savedKeys.openAI.substring(0, 5)}...` : 'not set',
          googleGemini: savedKeys?.googleGemini ? `${savedKeys.googleGemini.substring(0, 5)}...` : 'not set',
          anthropic: savedKeys?.anthropic ? `${savedKeys.anthropic.substring(0, 5)}...` : 'not set'
        });
      }
      
      // Debug localStorage after update
      console.log("Settings: Checking localStorage after update");
      debugLocalStorage();
      
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
      console.error("Error saving API keys:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Debug function to log localStorage state
  const debugLocalStorage = () => {
    try {
      const currentUserJson = localStorage.getItem("currentUser");
      const isAuthenticatedValue = localStorage.getItem("isAuthenticated");
      const usersJson = localStorage.getItem("users");
      
      console.log("Settings DEBUG - localStorage state:", {
        isAuthenticated: isAuthenticatedValue,
        hasCurrentUser: !!currentUserJson,
        hasUsers: !!usersJson,
        currentUser: currentUserJson ? JSON.parse(currentUserJson) : null,
        users: usersJson ? JSON.parse(usersJson).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          hasPreferences: !!u.preferences,
          hasApiKeys: !!(u.preferences?.apiKeys),
          apiKeys: u.preferences?.apiKeys ? {
            openAI: u.preferences.apiKeys.openAI ? `${u.preferences.apiKeys.openAI.substring(0, 5)}...` : 'not set'
          } : 'none'
        })) : []
      });
    } catch (error) {
      console.error("Error debugging localStorage:", error);
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
                  <div className="relative flex-1">
                    <Input
                      type={showOpenAIKey ? "text" : "password"}
                      placeholder="sk-..."
                      value={openAIKey}
                      onChange={handleOpenAIKeyChange}
                      className={openAIKeyValid === false ? "border-red-500" : ""}
                    />
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {openAIKeyValid === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {openAIKeyValid === false && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowOpenAIKey(!showOpenAIKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showOpenAIKey ? "Hide API key" : "Show API key"}
                    >
                      {showOpenAIKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {openAIKeyValid === false && (
                  <p className="text-xs text-red-500">
                    Invalid API key format. OpenAI API keys should start with "sk-".
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI dashboard</a>.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Google Gemini API Key</label>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="relative flex-1">
                    <Input
                      type={showGeminiKey ? "text" : "password"}
                      placeholder="AIza..."
                      value={googleGeminiKey}
                      onChange={handleGeminiKeyChange}
                      className={geminiKeyValid === false ? "border-red-500" : ""}
                    />
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {geminiKeyValid === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {geminiKeyValid === false && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowGeminiKey(!showGeminiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showGeminiKey ? "Hide API key" : "Show API key"}
                    >
                      {showGeminiKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {geminiKeyValid === false && (
                  <p className="text-xs text-red-500">
                    Invalid API key format. Google Gemini API keys should start with "AIza".
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Get your API key from the <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>.
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Anthropic Claude API Key</label>
                <div className="flex items-center space-x-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <div className="relative flex-1">
                    <Input
                      type={showAnthropicKey ? "text" : "password"}
                      placeholder="sk-ant-..."
                      value={anthropicKey}
                      onChange={handleAnthropicKeyChange}
                      className={anthropicKeyValid === false ? "border-red-500" : ""}
                    />
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      {anthropicKeyValid === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {anthropicKeyValid === false && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showAnthropicKey ? "Hide API key" : "Show API key"}
                    >
                      {showAnthropicKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                {anthropicKeyValid === false && (
                  <p className="text-xs text-red-500">
                    Invalid API key format. Anthropic API keys should start with "sk-ant".
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Get your API key from the <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="underline">Anthropic Console</a>.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="ml-auto"
                onClick={handleSaveAPIKeys}
                disabled={isLoading || openAIKeyValid === false || geminiKeyValid === false || anthropicKeyValid === false}
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