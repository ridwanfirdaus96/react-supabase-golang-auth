# Project Requirements Document: react-supabase-golang-auth

## 1. Project Overview
This project is a starter template for building a modern single-page application (SPA) with user authentication. On the frontend, it uses Vite, React, TypeScript, Tailwind CSS and the `shadcn/ui` component library to provide ready-made login, registration, and profile forms. Although it ships pre-configured for Supabase, the architecture is backend-agnostic—your goal is to swap out Supabase and connect everything to a custom Golang API that handles user auth.

We’re building this to save time and enforce consistency: you get a polished UI, proven form validation (React Hook Form + Zod), and declarative data fetching (TanStack Query) out of the box. The core objectives are to have working login/register flows talking to a Go server, secure token-based sessions (JWT in `httpOnly` cookies), and a clear public vs. protected routing strategy. Success means a user can sign up, log in, stay authenticated across pages, and log out without any guesswork.

## 2. In-Scope vs. Out-of-Scope

**In-Scope (v1.0):**
- Frontend forms and pages for **Register**, **Login**, **Dashboard** (protected), and **Profile**.
- Golang backend endpoints: `/api/register`, `/api/login`, `/api/logout`, `/api/user`.
- Password hashing with bcrypt and JWT generation in Go.
- Storing JWT in a secure, `httpOnly`, `SameSite=Strict` cookie.
- Client-side form validation using Zod schemas.
- Data fetching and mutations via TanStack Query hooks (`useRegister`, `useLogin`, `useUser`, `useLogout`).
- Public vs. protected route handling with React Router DOM and an `AuthProvider` (React Context or Zustand).
- Centralized API client (`axios` or `fetch`) with an interceptor to include auth cookies automatically.
- Responsive and accessible UI built with Tailwind CSS and `shadcn/ui` components.

**Out-of-Scope (later phases):**
- OAuth/social logins (Google, Facebook, etc.).
- Password-reset flows via email.
- Multi-factor authentication.
- Admin dashboards or role-based access control beyond “user.”
- Payment processing or billing.
- Real-time features (WebSockets, chats).
- Mobile-native apps (iOS/Android), analytics, or push notifications.

## 3. User Flow

When a new user arrives, they land on the **Register** page. They fill out an email and password form built with `shadcn/ui` components, and React Hook Form + Zod ensure the email format and password strength meet requirements. On submission, a TanStack Query mutation sends a `POST` to `/api/register`. If it succeeds, the Go server hashes the password, stores the user in PostgreSQL, issues a JWT in an `httpOnly` cookie, and responds with user metadata. The frontend’s `onSuccess` callback saves the user in global state and redirects them to the **Dashboard** page.

An existing user goes to the **Login** page, enters credentials, and submits. A similar mutation calls `/api/login`: if credentials match, the Go service sets the JWT cookie and returns the user object. The React Query hook then updates global auth state, and React Router navigates to **Dashboard**. On any protected route, an `AuthGuard` wrapper checks global state; if no user is found, it redirects back to **Login**. A **Logout** button triggers a call to `/api/logout`, clears the cookie on the server, resets state in the client, and redirects to **Login**.

## 4. Core Features

- **Authentication Endpoints (Golang)**: `/api/register`, `/api/login`, `/api/logout`, `/api/user`.
- **Password Security**: bcrypt hashing, salting, and JWT signing (`github.com/golang-jwt/jwt`).
- **Client-Side Forms**: React Hook Form + Zod for type-safe validation.
- **Data Layer**: TanStack Query (React Query) for queries/mutations, loading/error state.
- **Routing**: React Router DOM with public and protected routes & an `AuthProvider`.
- **API Client**: `axios` or native `fetch` wrapper with cookie support and interceptors.
- **Global Auth State**: React Context or Zustand store exposing `user`, `login()`, `logout()`, `register()`.
- **UI Components**: `shadcn/ui` primitives (Button, Input, Card, Toast) styled by Tailwind CSS.
- **Theming**: Tailwind CSS + `clsx` + `tailwind-merge` for overrides and variants.
- **Animations & Icons**: Framer Motion for transitions, Lucide React for SVG icons.
- **Environment Configuration**: `.env` variables like `VITE_API_BASE_URL=http://localhost:8080/api`.

## 5. Tech Stack & Tools

**Frontend:**
- Vite (fast dev server, HMR)
- React + TypeScript
- React Router DOM
- Tailwind CSS + `shadcn/ui`
- TanStack Query (React Query)
- React Hook Form + Zod
- Framer Motion (animations)
- Lucide React (icons)
- clsx + tailwind-merge (class merging)
- Axios or built-in `fetch`
- Vitest + React Testing Library (unit / integration tests)

**Backend (Golang):**
- Go 1.18+ (standard `net/http` or framework like Gin/Echo/Chi)
- PostgreSQL (hosted or local)
- `golang.org/x/crypto/bcrypt` (password hashing)
- `github.com/golang-jwt/jwt` (JWT generation and validation)
- CORS middleware (to allow requests from `localhost:5173`)
- Environment management (`GO_ENV`, `JWT_SECRET`, `DB_URL`)

**Dev Tools & IDE:**
- Node.js 16+ & Go toolchain
- VS Code with ESLint, Prettier, Go and TypeScript extensions
- Postman or Insomnia for API testing
- dotenv for managing env vars locally

## 6. Non-Functional Requirements

- **Performance:** Initial page load under 200 ms, API responses under 500 ms.
- **Security:** HTTPS by default, CSP headers, XSS/CSRF mitigation, JWT in `httpOnly`/`SameSite=Strict` cookies.
- **Reliability:** 99.9% uptime expectation for auth endpoints.
- **Usability & Accessibility:** WCAG AA compliance, mobile-responsive design, clear error messages.
- **Scalability:** Stateless Go API ready for horizontal scaling, React Query caching to reduce server load.
- **Maintainability:** TypeScript + Go types to ensure end-to-end type safety.

## 7. Constraints & Assumptions

- A running PostgreSQL database and Go environment are available.
- The Golang API must run on `http://localhost:8080/api` (or update `VITE_API_BASE_URL`).
- Developers use modern browsers supporting ES6 and cookies.
- No third-party auth providers in this phase (Supabase will be removed).
- CORS is configured to allow the frontend origin.
- JWT secret and DB credentials are stored in secure environment variables.

## 8. Known Issues & Potential Pitfalls

- **CORS Errors:** Forgetting to allow `http://localhost:5173` on the Go server will block API calls. Mitigate by adding proper CORS middleware.
- **Cookie Scope:** Cookies may not send if domains/ports mismatch. Ensure front and back end share a domain or configure `SameSite=None; Secure` for cross-site cookies.
- **Token Expiry:** Expired JWTs must be handled in the client—catch 401 responses in the API client and force logout or token refresh.
- **Validation Drift:** Zod schemas on the client must match Go structs exactly. Keep them in sync to avoid mismatch errors.
- **Environment Misconfig:** Forgetting to update `.env` can point the app to Supabase. Ensure variables are overwritten with the Go API URL.
- **Race Conditions:** Rapid API calls can trigger stale state in React Query; use query invalidation where appropriate.

With this document, the AI model has a clear blueprint to generate all subsequent materials—detailed tech-stack docs, frontend guidelines, backend structure, file layouts, routing rules, and testing plans—without ambiguity.