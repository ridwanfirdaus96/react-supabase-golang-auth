#!/bin/bash

# Start development servers for both frontend and backend

echo "🚀 Starting Golang Authentication Development Servers"
echo "=================================================="

# Function to cleanup processes on exit
cleanup() {
    echo "🛑 Stopping servers..."
    jobs -p | xargs -r kill
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Go backend
echo "🔧 Starting Go backend server on :8080..."
cd backend
export PATH=$PATH:/workspace/repo/go/bin
export GOROOT=/workspace/repo/go
go run . &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start React frontend
echo "⚛️ Starting React frontend on :5173..."
cd ..
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers started!"
echo "📝 Frontend: http://localhost:5173"
echo "🔧 Backend:  http://localhost:8080"
echo ""
echo "🌐 API Endpoints:"
echo "  POST /api/register - User registration"
echo "  POST /api/login    - User login"
echo "  POST /api/logout   - User logout"
echo "  GET  /api/user     - Get current user"
echo "  POST /api/refresh  - Refresh JWT token"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for all background jobs
wait