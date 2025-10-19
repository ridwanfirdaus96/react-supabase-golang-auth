import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useIsAuthenticated, useRefreshToken } from '../hooks/auth';
import { User } from '../services';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<any>;
  logout: () => Promise<any>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // React Query hooks
  const { data: userData, isLoading: userLoading } = useUser();
  const { data: isAuthenticatedData, isLoading: authLoading } = useIsAuthenticated();
  const refreshMutation = useRefreshToken();

  useEffect(() => {
    if (!userLoading && !authLoading) {
      setIsLoading(false);
      
      if (userData?.user && isAuthenticatedData) {
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, [userData, isAuthenticatedData, userLoading, authLoading]);

  const login = async (email: string, password: string) => {
    const { useLogin } = await import('../hooks/auth');
    const loginMutation = useLogin();
    
    return loginMutation.mutateAsync({ email, password });
  };

  const register = async (email: string, password: string) => {
    const { useRegister } = await import('../hooks/auth');
    const registerMutation = useRegister();
    
    return registerMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    const { useLogout } = await import('../hooks/auth');
    const logoutMutation = useLogout();
    
    return logoutMutation.mutateAsync();
  };

  const refreshAuth = async () => {
    try {
      await refreshMutation.mutateAsync();
    } catch (error) {
      console.error('Failed to refresh authentication:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};