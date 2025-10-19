# Golang + React Authentication System

A complete user authentication system built with Golang backend and React frontend, featuring JWT tokens, PostgreSQL database, and modern UI components.

## 🏗️ Architecture

### Backend (Golang)
- **Framework**: Gin HTTP framework
- **Database**: PostgreSQL with pgx driver
- **Authentication**: JWT tokens with httpOnly cookies
- **Password Hashing**: bcrypt
- **Session Management**: In-memory session tracking with refresh tokens

### Frontend (React + TypeScript)
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation
- **Type Safety**: Full TypeScript implementation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Go 1.21+
- PostgreSQL (optional, defaults to in-memory for development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd react-supabase-golang-auth
```

### 2. Start Development Servers

#### Option A: Using the development script
```bash
./dev.sh
```

#### Option B: Manual setup

**Backend:**
```bash
cd backend
export PATH=$PATH:/workspace/repo/go/bin
export GOROOT=/workspace/repo/go
go run .
```

**Frontend:**
```bash
npm install
npm run dev
```

### 3. Access the Applications
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080

## 📁 Project Structure

```
├── backend/                    # Go backend application
│   ├── main.go                # Main server file
│   ├── auth.go                # JWT and authentication logic
│   ├── database.go            # PostgreSQL database operations
│   ├── session.go             # Session management
│   ├── .env                   # Environment variables
│   ├── go.mod                 # Go module file
│   └── migrations/            # Database migrations
├── src/                       # React frontend
│   ├── components/
│   │   ├── auth/              # Authentication components
│   │   └── ui/                # shadcn/ui components
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API client services
│   └── utils/                 # Utility functions
├── .env                       # Frontend environment variables
└── dev.sh                     # Development startup script
```

## 🔐 Authentication Features

### Backend Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login  
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user profile
- `POST /api/refresh` - Refresh JWT token

### Security Features
- ✅ JWT tokens with httpOnly cookies
- ✅ Automatic token refresh
- ✅ Session management and tracking
- ✅ Secure password hashing with bcrypt
- ✅ CORS configuration
- ✅ Input validation and sanitization
- ✅ Environment-based security settings

### Frontend Features
- ✅ React Hook Form with Zod validation
- ✅ TanStack Query for caching and state management
- ✅ Protected routes and authentication guards
- ✅ Automatic token refresh handling
- ✅ User-friendly error messages
- ✅ Loading states and skeletons
- ✅ Responsive design with Tailwind CSS

## 🛠️ Configuration

### Backend Environment (.env)
```env
PORT=8080
ENVIRONMENT=development
JWT_SECRET=your-secret-key-change-this-in-production
DATABASE_URL=postgres://user:password@localhost:5432/authdb
```

### Frontend Environment (.env)
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_ENVIRONMENT=development
```

## 📊 Database Schema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

## 🔄 Development Workflow

1. **Backend Development**: 
   - Run `go run .` in the `backend/` directory
   - Test endpoints with curl or Postman
   - Check browser developer tools for cookies

2. **Frontend Development**:
   - Run `npm run dev` in the root directory
   - Access http://localhost:5173
   - Login/Register forms will work with the backend

3. **Both Servers**:
   - Use `./dev.sh` to start both servers simultaneously
   - Frontend will automatically proxy API requests to backend

## Project Structure

```
codeguide-vite-supabase/
├── src/                # Source files
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── hooks/        # Custom hooks
│   └── types/        # TypeScript types
├── public/            # Static assets
└── documentation/     # Generated documentation from CodeGuide
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Documentation Setup

To implement the generated documentation from CodeGuide:

1. Create a `documentation` folder in the root directory:

   ```bash
   mkdir documentation
   ```

2. Place all generated markdown files from CodeGuide in this directory:

   ```bash
   # Example structure
   documentation/
   ├── project_requirements_document.md
   ├── app_flow_document.md
   ├── frontend_guideline_document.md
   └── backend_structure_document.md
   ```

3. These documentation files will be automatically tracked by git and can be used as a reference for your project's features and implementation details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
