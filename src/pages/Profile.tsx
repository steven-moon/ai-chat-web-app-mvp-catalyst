
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Settings, History, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import MainLayout from "../components/layout/MainLayout";
import { useUser } from "@/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, updateProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Personal information form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  
  // Preferences form state
  const [defaultProvider, setDefaultProvider] = useState("OpenAI");
  const [historyRetention, setHistoryRetention] = useState("forever");
  
  // Load user data when component mounts
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }
    
    // Parse the name into first and last name
    const nameParts = user.name.split(" ");
    setFirstName(nameParts[0] || "");
    setLastName(nameParts.slice(1).join(" ") || "");
    setEmail(user.email || "");
    
    // Load preferences if they exist
    if (user.preferences) {
      setDefaultProvider(user.preferences.defaultProvider || "OpenAI");
      setHistoryRetention(user.preferences.historyRetention || "forever");
    }
  }, [user, isAuthenticated, navigate]);
  
  const handleSavePersonalInfo = async () => {
    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await updateProfile({ 
        name: fullName,
        email
      });
      
      toast({
        title: "Profile updated",
        description: "Your personal information has been saved",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSavePreferences = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        preferences: {
          defaultProvider,
          historyRetention
        }
      });
      
      toast({
        title: "Preferences saved",
        description: "Your preferences have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  // Calculate user stats
  const joinDate = user ? "January 2023" : ""; // Placeholder - would come from user data in a real app
  const totalChats = 48; // Placeholder - would come from user data in a real app
  const favoriteProvider = user?.preferences?.defaultProvider || "OpenAI";

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
          <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
          
          <div className="grid md:grid-cols-[300px_1fr] gap-6">
            {/* User Info Card */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {user.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">Member since {joinDate}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Stats</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Chats</span>
                      <span className="font-medium">{totalChats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Favorite Provider</span>
                      <span className="font-medium">{favoriteProvider}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <nav className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="/history">
                        <History className="mr-2 h-4 w-4" />
                        Chat History
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div>
              <Alert className="mb-6">
                <AlertDescription>
                  This is a demo application. Profile data is stored in your browser's localStorage and is not secure.
                </AlertDescription>
              </Alert>
              
              <Tabs defaultValue="preferences" className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="account">Account Details</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preferences" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Preferences</CardTitle>
                      <CardDescription>
                        Configure your default settings for AI interactions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="font-medium">Default AI Provider</h3>
                          <p className="text-sm text-muted-foreground">
                            Select which AI provider to use by default in new conversations.
                          </p>
                          <select 
                            className="w-full p-2 rounded-md border border-input bg-background"
                            value={defaultProvider}
                            onChange={(e) => setDefaultProvider(e.target.value)}
                          >
                            <option value="OpenAI">OpenAI</option>
                            <option value="Google Gemini">Google Gemini</option>
                            <option value="Anthropic Claude">Anthropic Claude</option>
                          </select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Chat History</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage how long your chat history is retained.
                          </p>
                          <select 
                            className="w-full p-2 rounded-md border border-input bg-background"
                            value={historyRetention}
                            onChange={(e) => setHistoryRetention(e.target.value)}
                          >
                            <option value="forever">Keep forever</option>
                            <option value="90days">Keep for 90 days</option>
                            <option value="30days">Keep for 30 days</option>
                            <option value="none">Don't save</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="ml-auto"
                        onClick={handleSavePreferences}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Preferences"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="account" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Update your account details and preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">First Name</label>
                            <Input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <Input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        className="ml-auto"
                        onClick={handleSavePersonalInfo}
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Profile;
