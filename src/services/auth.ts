import { apiClient } from './api';
import {
  AuthResponse,
  RegisterRequest,
  LoginRequest,
  User,
} from './types';

class AuthService {
  // Register a new user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/register', data);
    
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  }

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/login', data);
    
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/api/logout');
    localStorage.removeItem('refresh_token');
    return response;
  }

  // Get current user profile
  async getCurrentUser(): Promise<{ user: User }> {
    return apiClient.get('/api/user');
  }

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<AuthResponse>('/api/refresh', {
      refresh_token: refreshToken,
    });
    
    if (response.refresh_token) {
      localStorage.setItem('refresh_token', response.refresh_token);
    }
    
    return response;
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // Try to refresh token if authentication fails
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          await this.refreshToken();
          return true;
        }
      } catch (refreshError) {
        // Refresh failed, user is not authenticated
        localStorage.removeItem('refresh_token');
      }
      return false;
    }
  }

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // Clear stored tokens
  clearTokens(): void {
    localStorage.removeItem('refresh_token');
  }

  // Handle authentication errors and token refresh
  async handleAuthError(error: any): Promise<boolean> {
    // If it's a 401 error, try to refresh the token
    if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
      try {
        await this.refreshToken();
        return true; // Token was successfully refreshed
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        this.clearTokens();
        return false;
      }
    }
    return false; // Not an authentication error
  }
}

export const authService = new AuthService();
export default authService;