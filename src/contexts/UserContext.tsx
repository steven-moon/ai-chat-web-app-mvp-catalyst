import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    defaultProvider?: string;
    historyRetention?: string;
    apiKeys?: {
      openAI?: string;
      googleGemini?: string;
      anthropic?: string;
    };
  };
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Create context with default values
const UserContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  updateProfile: async () => {},
});

// Custom hook to use the auth context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Debug function to log localStorage state
  const debugLocalStorage = () => {
    try {
      const currentUserJson = localStorage.getItem("currentUser");
      const isAuthenticatedValue = localStorage.getItem("isAuthenticated");
      const usersJson = localStorage.getItem("users");
      
      console.log("UserContext DEBUG - localStorage state:", {
        isAuthenticated: isAuthenticatedValue,
        hasCurrentUser: !!currentUserJson,
        hasUsers: !!usersJson,
        currentUser: currentUserJson ? JSON.parse(currentUserJson) : null,
        users: usersJson ? JSON.parse(usersJson).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          hasPreferences: !!u.preferences,
          hasApiKeys: !!(u.preferences?.apiKeys)
        })) : []
      });
    } catch (error) {
      console.error("Error debugging localStorage:", error);
    }
  };

  // Login functionality - checks credentials against localStorage
  const login = async (email: string, password: string) => {
    // Debug localStorage before login
    console.log("UserContext: Debugging localStorage before login");
    debugLocalStorage();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email exists in localStorage
    const usersJson = localStorage.getItem("users");
    if (!usersJson) {
      throw new Error("Invalid credentials");
    }
    
    const users = JSON.parse(usersJson);
    const foundUser = users.find((u: any) => u.email === email);
    
    if (!foundUser || foundUser.password !== password) {
      throw new Error("Invalid credentials");
    }
    
    // Create user object (without password)
    const authenticatedUser: User = {
      id: foundUser.id,
      name: foundUser.name,
      email: foundUser.email,
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${foundUser.name}`,
      preferences: foundUser.preferences || {}
    };
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
    localStorage.setItem("isAuthenticated", "true");
    
    // Log the loaded user data (safely masked)
    console.log("UserContext: User logged in:", {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      hasPreferences: !!authenticatedUser.preferences,
      hasApiKeys: !!(authenticatedUser.preferences?.apiKeys),
      apiKeys: authenticatedUser.preferences?.apiKeys ? {
        openAI: authenticatedUser.preferences.apiKeys.openAI ? `${authenticatedUser.preferences.apiKeys.openAI.substring(0, 5)}...` : 'not set',
        googleGemini: authenticatedUser.preferences.apiKeys.googleGemini ? `${authenticatedUser.preferences.apiKeys.googleGemini.substring(0, 5)}...` : 'not set',
        anthropic: authenticatedUser.preferences.apiKeys.anthropic ? `${authenticatedUser.preferences.apiKeys.anthropic.substring(0, 5)}...` : 'not set'
      } : 'none'
    });
    
    // Update state
    setUser(authenticatedUser);
    setIsAuthenticated(true);
    
    // Debug localStorage after login
    console.log("UserContext: Debugging localStorage after login");
    debugLocalStorage();
  };

  // Signup functionality - stores user data in localStorage
  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    const usersJson = localStorage.getItem("users");
    const users = usersJson ? JSON.parse(usersJson) : [];
    
    if (users.some((u: any) => u.email === email)) {
      throw new Error("Email already in use");
    }
    
    // Create new user
    const newUser = {
      id: "user-" + Math.floor(Math.random() * 1000),
      name,
      email,
      password, // In a real app, this would be hashed
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${name}`,
      preferences: {
        apiKeys: {
          openAI: "",
          googleGemini: "",
          anthropic: ""
        }
      }
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    
    // Create user object (without password) for state
    const authenticatedUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      preferences: newUser.preferences
    };
    
    // Store in localStorage
    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
    localStorage.setItem("isAuthenticated", "true");
    
    // Log the new user data
    console.log("UserContext: New user created:", {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      hasPreferences: !!authenticatedUser.preferences
    });
    
    // Update state
    setUser(authenticatedUser);
    setIsAuthenticated(true);
  };

  // Logout functionality
  const logout = () => {
    // Clear from localStorage
    localStorage.removeItem("currentUser");
    localStorage.removeItem("isAuthenticated");
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update profile functionality
  const updateProfile = async (userData: Partial<User>) => {
    // Debug localStorage before update
    console.log("UserContext: Debugging localStorage before profile update");
    debugLocalStorage();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Get users array from localStorage
    const usersJson = localStorage.getItem("users");
    if (!usersJson) {
      throw new Error("No users found");
    }
    
    const users = JSON.parse(usersJson);
    
    // Find and update user in the users array
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    // Update user data (except password)
    const updatedUser = {
      ...users[userIndex],
      name: userData.name || users[userIndex].name,
      email: userData.email || users[userIndex].email,
      preferences: {
        ...users[userIndex].preferences,
        ...userData.preferences
      }
    };
    
    // Update avatar if explicitly provided or if name has changed and no avatar is provided
    if (userData.avatar) {
      updatedUser.avatar = userData.avatar;
    } else if (userData.name && userData.name !== users[userIndex].name && !userData.avatar) {
      updatedUser.avatar = `https://api.dicebear.com/6.x/avataaars/svg?seed=${userData.name}`;
    }
    
    // Update users array
    users[userIndex] = updatedUser;
    localStorage.setItem("users", JSON.stringify(users));
    
    // Create user object (without password) for state
    const authenticatedUser: User = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      preferences: updatedUser.preferences
    };
    
    // Update in localStorage
    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
    
    // Log the API keys being saved (safely masked)
    if (authenticatedUser.preferences?.apiKeys) {
      const apiKeys = authenticatedUser.preferences.apiKeys;
      console.log("UserContext: Updated user preferences with API keys:", {
        openAI: apiKeys.openAI ? `${apiKeys.openAI.substring(0, 5)}...` : 'not set',
        googleGemini: apiKeys.googleGemini ? `${apiKeys.googleGemini.substring(0, 5)}...` : 'not set',
        anthropic: apiKeys.anthropic ? `${apiKeys.anthropic.substring(0, 5)}...` : 'not set'
      });
    }
    
    // Update state
    setUser(authenticatedUser);
    
    // Debug localStorage after update
    console.log("UserContext: Debugging localStorage after profile update");
    debugLocalStorage();
  };

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    console.log("UserContext: Checking if user is already logged in");
    debugLocalStorage();
    
    const storedUser = localStorage.getItem("currentUser");
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    
    if (storedUser && storedAuthStatus === "true") {
      const parsedUser = JSON.parse(storedUser);
      
      // Log the loaded user data (safely masked)
      console.log("UserContext: Loaded user from localStorage:", {
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        hasPreferences: !!parsedUser.preferences,
        hasApiKeys: !!(parsedUser.preferences?.apiKeys),
        apiKeys: parsedUser.preferences?.apiKeys ? {
          openAI: parsedUser.preferences.apiKeys.openAI ? `${parsedUser.preferences.apiKeys.openAI.substring(0, 5)}...` : 'not set',
          googleGemini: parsedUser.preferences.apiKeys.googleGemini ? `${parsedUser.preferences.apiKeys.googleGemini.substring(0, 5)}...` : 'not set',
          anthropic: parsedUser.preferences.apiKeys.anthropic ? `${parsedUser.preferences.apiKeys.anthropic.substring(0, 5)}...` : 'not set'
        } : 'none'
      });
      
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, signup, logout, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
};
