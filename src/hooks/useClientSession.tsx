'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/api/client';
import { SessionData } from '@/lib/sessionConfig';

export function useClientSession() {
  const [user, setUser] = useState<SessionData['user'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch session data from the API
  const fetchSession = async () => {
    try {
      const data = await authService.getCurrentUser();
      
      if (data.isLoggedIn && data.user) {
        setUser(data.user);
        return data;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setError('Failed to fetch session');
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login({ email, password });
      
      setUser(data.user);
      router.push("/dashboard");
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      
      setUser(null);
      router.push("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      setError('Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Check session on mount
  useEffect(() => {
    fetchSession();
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    refreshSession: fetchSession
  };
} 