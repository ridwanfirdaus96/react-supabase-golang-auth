// API Types matching the Go backend response structures
export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  refresh_token?: string;
  session_id?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  error: string;
  code?: string;
  details?: any;
}