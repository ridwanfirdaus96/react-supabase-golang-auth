import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, RegisterRequest, LoginRequest, AuthResponse } from '../../services';

// Register mutation
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['isAuthenticated'] });
    },
    onError: (error) => {
      console.error('Registration failed:', error);
    },
  });
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.invalidateQueries({ queryKey: ['isAuthenticated'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['isAuthenticated'], false);
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Even if logout fails on server, clear local data
      queryClient.clear();
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['isAuthenticated'], false);
    },
  });
};

// Get current user query
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// Check authentication status query
export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: ['isAuthenticated'],
    queryFn: () => authService.isAuthenticated(),
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['user'], data.user);
      queryClient.setQueryData(['isAuthenticated'], true);
    },
    onError: (error) => {
      console.error('Token refresh failed:', error);
      queryClient.setQueryData(['user'], null);
      queryClient.setQueryData(['isAuthenticated'], false);
    },
  });
};