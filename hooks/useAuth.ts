// hooks/useAuth.tsx
'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  _id?: string;
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  role: 'admin' | 'customer';
  isActive?: boolean;
  isFirstLogin?: boolean;
  package?: {
    _id: string;
    name: string;
    price: number;
    speed: string;
    speedMbps: number;
    slug: string;
  } | null;
  createdAt?: string;
  status?: string;
  isDeleted?: boolean;
  lastPasswordChange?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to refresh user data from API
  const refreshUserData = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const freshUserData = result.data;
          // Transform _id to id for consistency
          const userWithId = {
            ...freshUserData,
            id: freshUserData._id || freshUserData.id,
          };
          setUser(userWithId);
          localStorage.setItem('user', JSON.stringify(userWithId));
          return userWithId;
        }
      } else if (response.status === 401) {
        // Token expired or invalid
        console.warn('Token expired, logging out...');
        logout();
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [token]);

  // Helper function to update user data locally
  const updateUser = useCallback((updatedUser: Partial<User>) => {
    if (user) {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  }, [user]);

  useEffect(() => {
    // Load auth data from localStorage
    const loadAuthData = async () => {
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Verify token is still valid by refreshing user data
          // This also ensures package data is up to date
          const response = await fetch('/api/users/me', {
            headers: {
              'Authorization': `Bearer ${storedToken}`,
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
              const freshUserData = {
                ...result.data,
                id: result.data._id || result.data.id,
              };
              setUser(freshUserData);
              localStorage.setItem('user', JSON.stringify(freshUserData));
            }
          } else if (response.status === 401) {
            // Token is invalid, clear storage
            console.warn('Stored token invalid, clearing...');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
        // Clear invalid data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Auto-refresh user data periodically (every 5 minutes)
  useEffect(() => {
    if (!token || !user) return;

    const intervalId = setInterval(() => {
      refreshUserData();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [token, user, refreshUserData]);

  const login = async (identifier: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Ensure user has consistent id field
    const userData = {
      ...data.data,
      id: data.data._id || data.data.id,
    };

    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(data.token);
    setUser(userData);
    
    // Return user data for any additional handling
    return userData;
  };

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('remember_me');
    setToken(null);
    setUser(null);
    router.push('/login');
  }, [router]);

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      // Update user data to remove first login flag if present
      if (user && user.isFirstLogin) {
        const updatedUser = { ...user, isFirstLogin: false, lastPasswordChange: new Date().toISOString() };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      // Return success message for UI feedback
      return data;
    } catch (error) {
      // Re-throw to be handled by the modal
      throw error;
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';
  const isCustomer = user?.role === 'customer';

  const contextValue: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isCustomer,
    changePassword,
    refreshUserData,
    updateUser,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}