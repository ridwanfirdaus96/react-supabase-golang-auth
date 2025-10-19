import { authService } from '../services';

// Utility functions for authentication
export const authUtils = {
  // Check if user is logged in (simple check)
  isLoggedIn: (): boolean => {
    return authService.getRefreshToken() !== null;
  },

  // Get stored refresh token
  getStoredToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },

  // Clear all auth data
  clearAuthData: (): void => {
    authService.clearTokens();
    localStorage.removeItem('refresh_token');
  },

  // Format error message for display
  formatErrorMessage: (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error?.message) {
      // Handle common error messages
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        return 'Your session has expired. Please log in again.';
      }
      if (error.message.includes('403') || error.message.includes('Forbidden')) {
        return 'You do not have permission to perform this action.';
      }
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        return 'The requested resource was not found.';
      }
      if (error.message.includes('409') || error.message.includes('Conflict')) {
        return 'This email is already registered. Please use a different email.';
      }
      if (error.message.includes('422') || error.message.includes('Unprocessable')) {
        return 'Invalid input. Please check your data and try again.';
      }
      if (error.message.includes('500') || error.message.includes('Internal Server')) {
        return 'Server error. Please try again later.';
      }
      
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  },

  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: (password: string): { isValid: boolean; message?: string } => {
    if (password.length < 6) {
      return {
        isValid: false,
        message: 'Password must be at least 6 characters long',
      };
    }
    
    if (password.length > 128) {
      return {
        isValid: false,
        message: 'Password must be less than 128 characters',
      };
    }
    
    return { isValid: true };
  },

  // Handle API errors with token refresh logic
  handleApiError: async (error: any): Promise<boolean> => {
    // Try to handle authentication errors
    const wasRefreshed = await authService.handleAuthError(error);
    
    if (!wasRefreshed) {
      // If it's not an auth error or refresh failed, clear auth data
      authUtils.clearAuthData();
      return false;
    }
    
    return true;
  },
};