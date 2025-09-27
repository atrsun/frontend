'use client'
import { createContext, useContext } from "react";
import { useClientSession } from "./useClientSession";

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  refreshSession: () => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useClientSession();
  
  // Create a properly typed context value
  const contextValue: AuthContextType = {
    user: session.user || null,
    login: session.login,
    logout: session.logout,
    isLoading: session.isLoading,
    error: session.error,
    refreshSession: session.refreshSession
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 