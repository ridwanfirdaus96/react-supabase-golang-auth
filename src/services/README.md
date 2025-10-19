# Authentication API Client

This directory contains the frontend API client and authentication services for communicating with the Golang backend.

## Files Overview

### Services
- **`api.ts`** - Main API client with request/response handling
- **`auth.ts`** - Authentication service with login, register, logout, and token refresh
- **`types.ts`** - TypeScript interfaces matching the Go backend API
- **`index.ts`** - Main exports for easy importing

### Hooks
- **`hooks/auth/useAuth.ts`** - React Query hooks for authentication operations
- **`hooks/auth/index.ts`** - Auth hooks exports

### Components
- **`components/auth/ProtectedRoute.tsx`** - Route protection components
- **`contexts/AuthContext.tsx`** - Authentication context for global state management

### Utils
- **`utils/auth.ts`** - Authentication utilities and error handling

## Usage

### Basic Authentication
```typescript
import { authService } from '../services';
import { useLogin, useRegister, useLogout } from '../hooks/auth';

// In a component
const { mutate: login, isPending } = useLogin();

const handleLogin = (email, password) => {
  login({ email, password }, {
    onSuccess: (data) => {
      console.log('Login successful:', data.user);
    },
    onError: (error) => {
      console.error('Login failed:', error);
    }
  });
};
```

### Protected Routes
```typescript
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

### Authentication Context
```typescript
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Your app content */}
      </Router>
    </AuthProvider>
  );
}

function ProfileComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

## Features

- ✅ JWT token management with httpOnly cookies
- ✅ Automatic token refresh
- ✅ Error handling with user-friendly messages
- ✅ TypeScript support with proper type definitions
- ✅ React Query integration for caching and state management
- ✅ Protected routes
- ✅ Authentication context for global state
- ✅ Automatic logout on token expiration
- ✅ Input validation and error formatting

## API Endpoints

The client connects to these Golang backend endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `POST /api/refresh` - Token refresh
- `GET /api/user` - Get current user profile