
import React from "react";
import { motion } from "framer-motion";
import { User, Settings, History, LogOut } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "../components/layout/MainLayout";

const Profile: React.FC = () => {
  // Mock user data for demonstration
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    avatarUrl: "",
    joinDate: "January 2023",
    totalChats: 48,
    favoriteProvider: "OpenAI",
  };

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
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                        {user.name.split(' ').map(name => name[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-muted-foreground">{user.email}</p>
                  <p className="text-sm text-muted-foreground mt-1">Member since {user.joinDate}</p>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Stats</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Chats</span>
                      <span className="font-medium">{user.totalChats}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Favorite Provider</span>
                      <span className="font-medium">{user.favoriteProvider}</span>
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
                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>
            
            {/* Main Content */}
            <div>
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
                          <select className="w-full p-2 rounded-md border border-input bg-background">
                            <option>OpenAI</option>
                            <option>Google Gemini</option>
                            <option>Anthropic Claude</option>
                          </select>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-2">
                          <h3 className="font-medium">Chat History</h3>
                          <p className="text-sm text-muted-foreground">
                            Manage how long your chat history is retained.
                          </p>
                          <select className="w-full p-2 rounded-md border border-input bg-background">
                            <option>Keep forever</option>
                            <option>Keep for 90 days</option>
                            <option>Keep for 30 days</option>
                            <option>Don't save</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
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
                            <input
                              type="text"
                              value="Jane"
                              className="w-full p-2 rounded-md border border-input bg-background"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Last Name</label>
                            <input
                              type="text"
                              value="Doe"
                              className="w-full p-2 rounded-md border border-input bg-background"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <input
                            type="email"
                            value={user.email}
                            className="w-full p-2 rounded-md border border-input bg-background"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="ml-auto">Save Changes</Button>
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
