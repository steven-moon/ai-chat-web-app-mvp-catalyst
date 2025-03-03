
import React, { createContext, useContext, useState, ReactNode } from "react";

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create context with default values
const UserContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useUser = () => useContext(UserContext);

// Provider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Mock login functionality - in a real app, this would make an API call
  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: "user-123",
      name: "John Doe",
      email: email,
      avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=John",
    };
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("isAuthenticated", "true");
    
    // Update state
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // Mock signup functionality
  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user data
    const mockUser: User = {
      id: "user-" + Math.floor(Math.random() * 1000),
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${name}`,
    };
    
    // Store in localStorage
    localStorage.setItem("user", JSON.stringify(mockUser));
    localStorage.setItem("isAuthenticated", "true");
    
    // Update state
    setUser(mockUser);
    setIsAuthenticated(true);
  };

  // Logout functionality
  const logout = () => {
    // Clear from localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    
    // Update state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check if user is already logged in (from localStorage)
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
    
    if (storedUser && storedAuthStatus === "true") {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};
