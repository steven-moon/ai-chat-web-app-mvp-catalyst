
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

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

  // Login functionality - checks credentials against localStorage
  const login = async (email: string, password: string) => {
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
    };
    
    // Store in localStorage for persistence across refreshes
    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
    localStorage.setItem("isAuthenticated", "true");
    
    // Update state
    setUser(authenticatedUser);
    setIsAuthenticated(true);
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
    };
    
    // Store in localStorage
    localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
    localStorage.setItem("isAuthenticated", "true");
    
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

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
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
