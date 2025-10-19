import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute, PublicRoute, AuthPage, UserProfile } from './components/auth';
import { Hero } from "./components/ui/animated-hero";
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

// Dashboard component for authenticated users
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.email}</span>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <UserProfile />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">✅ Successfully authenticated with Golang backend</p>
                <p className="text-sm text-gray-600 mt-2">JWT tokens are managed via httpOnly cookies</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Backend Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Connected to Go backend at:</p>
                <p className="text-xs font-mono bg-gray-100 p-2 rounded mt-1">
                  {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

// Landing page component
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Golang Authentication System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Complete user authentication with Go backend and React frontend
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">🔐 Secure Authentication</h3>
              <p className="text-gray-600">JWT tokens with httpOnly cookies and automatic refresh</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">🚀 Go Backend</h3>
              <p className="text-gray-600">Built with Gin framework, PostgreSQL, and bcrypt password hashing</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">⚛️ React Frontend</h3>
              <p className="text-gray-600">TypeScript, TanStack Query, and shadcn/ui components</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// App content with authentication logic
const AppContent: React.FC = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <AuthPage onSuccess={() => setShowAuth(false)} />
            </PublicRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
