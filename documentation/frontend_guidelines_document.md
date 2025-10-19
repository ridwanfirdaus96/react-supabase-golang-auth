# Frontend Guideline Document

This document outlines the frontend setup for the **react-supabase-golang-auth** starter template. It describes the architecture, design principles, styling, component structure, state management, routing, performance, testing, and how everything works together to build a scalable, maintainable, and high-quality authentication interface.

---

## 1. Frontend Architecture

### 1.1 Overview
- **Build Tool**: Vite provides a lightning-fast development server with hot-module replacement and minimal configuration.  
- **UI Framework**: React (with TypeScript) for declarative, component-driven development.  
- **Styling**: Tailwind CSS utility–first framework, paired with `clsx` and `tailwind-merge` for dynamic class merging.  
- **UI Components**: shadcn/ui delivers accessible, reusable primitives (buttons, inputs, cards).  
- **Data Fetching**: TanStack Query (React Query) handles server state, caching, and mutation logic.  
- **Form Handling**: React Hook Form + Zod for type-safe, client-side validation.  
- **Animations & Icons**: Framer Motion for smooth transitions; Lucide React for consistent icons.

### 1.2 Scalability, Maintainability, & Performance
- **Component-Driven**: Isolated components promote reuse and easier testing.  
- **TypeScript**: Strong typing catches errors early and documents data contracts (especially between frontend and Golang API).  
- **Aliased Imports**: Path aliases (defined in `vite.config.ts`) keep imports clean as the project grows.  
- **Code Splitting & Lazy Loading**: Vite and React’s `React.lazy` support on-demand loading of routes and large dependencies.  
- **Caching & Prefetching**: TanStack Query minimizes redundant network calls and prefetches data for a snappy UI.  

---

## 2. Design Principles

### 2.1 Core Principles
1. **Usability**: Interfaces should be intuitive—clear labels, consistent layouts, and helpful feedback (e.g., inline validation messages).  
2. **Accessibility**: All interactive elements use proper ARIA roles, focus management, and keyboard navigation support.  
3. **Responsiveness**: Mobile-first design ensures layouts adapt fluidly across devices, using Tailwind’s responsive utility classes.  
4. **Consistency**: A unified look and feel—spacing, color, typography—reinforces brand identity and reduces cognitive load.

### 2.2 Applying Principles
- **Component Library**: By building on shadcn/ui, you inherit consistent spacing, focus states, and accessible markup.  
- **Feedback Patterns**: Use Toasts or inline alerts for success, error, and loading states.  
- **Form Flow**: Inline validation with Zod ensures users fix mistakes before submitting.  
- **Responsive Utilities**: Tailwind prefixes like `sm:`, `md:`, `lg:` let you adjust layouts without writing custom media queries.

---

## 3. Styling and Theming

### 3.1 Styling Approach
- **Utility-First CSS**: Tailwind CSS encourages composing small, single-purpose classes instead of global CSS files.  
- **Dynamic Class Merging**: `clsx` + `tailwind-merge` handle conditional styling and avoid duplication.  
- **No Pre-processor** beyond Tailwind—you write (`.tsx`) files with inline class names.

### 3.2 Theming
- **Tailwind Config** (`tailwind.config.js`): Extend the default theme with custom colors, spacing, and component variants.  
- **CSS Variables**: For runtime theming (light/dark), define colors as CSS variables in the root and switch them via a class on `<html>` or `<body>`.

### 3.3 Visual Style
- **Design Style**: Modern flat design with subtle glassmorphism effects on cards and modals (semi-transparent backgrounds, light blur).  
- **Font**: ‘Inter’ (or system-ui fallbacks) for clean, legible text across devices.

### 3.4 Color Palette
- **Primary**: #3B82F6 (Tailwind `blue-500`)  
- **Primary Dark**: #1E40AF (Tailwind `blue-800`)  
- **Secondary**: #6366F1 (Tailwind `indigo-500`)  
- **Success**: #10B981 (Tailwind `green-500`)  
- **Warning**: #F59E0B (Tailwind `amber-500`)  
- **Error**: #EF4444 (Tailwind `red-500`)  
- **Background**: #F3F4F6 (gray-100) / #FFFFFF (white)  
- **Surface Cards**: rgba(255,255,255,0.7) with `backdrop-filter: blur(10px)`  
- **Text Primary**: #111827 (gray-900), **Text Secondary**: #6B7280 (gray-500)

---

## 4. Component Structure

### 4.1 Organization
```
src/
 ├─ components/
 │   ├─ auth/            # LoginForm.tsx, RegisterForm.tsx, PasswordInput.tsx
 │   └─ ui/              # Button.tsx, Input.tsx, Card.tsx, Toast.tsx
 ├─ contexts/           # AuthContext.tsx (global auth state)
 ├─ hooks/              # useAuth.ts, useFetchUser.ts
 ├─ pages/              # LoginPage.tsx, RegisterPage.tsx, DashboardPage.tsx
 ├─ services/           # api-client.ts, auth.ts (mutations & queries)
 └─ App.tsx             # Routes & layout
```

### 4.2 Reusability & Maintainability
- **Presentational vs Container**: UI components live under `ui/` (pure markup + styling). Logic-wrapping components (data fetching, state) go in `auth/` or `services/`.  
- **Single Responsibility**: Each component handles one piece of UI or logic, making it easy to test and replace.

---

## 5. State Management

### 5.1 Server State: TanStack Query
- **Queries**: `useQuery` for fetching current user or profile data.  
- **Mutations**: `useMutation` for login, register, logout endpoints.  
- **Caching & Invalidation**: On successful login, invalidate user queries to refresh protected data.

### 5.2 Client State: React Context (or Zustand)
- **AuthContext**: Stores `{ user, isAuthenticated, login(), logout() }`.  
- **Usage**: Wrap `<App />` in `<AuthProvider>`, then any component can call `useAuth()` to check status or trigger redirects.

---

## 6. Routing and Navigation

### 6.1 Library
- **React Router DOM** for declarative route definitions, nested layouts, and dynamic params.

### 6.2 Route Structure
```jsx
<BrowserRouter>
  <Routes>
    {/* Public */}
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />

    {/* Protected */}
    <Route element={<ProtectedRoute />}>  
      <Route path="/dashboard" element={<DashboardPage />} />
      {/* more protected pages */}
    </Route>
  </Routes>
</BrowserRouter>
```

- **ProtectedRoute**: Checks `isAuthenticated`; redirects to `/login` if false.
- **Navigation**: Use `<Link>` for client-side transitions, keeping the app a true SPA.

---

## 7. Performance Optimization

- **Lazy Loading**: Use `React.lazy` + `Suspense` for route-based code splitting.  
- **Tree Shaking**: Vite + ES modules remove unused code automatically.  
- **CSS Purge**: Tailwind removes unused utility classes in production builds.  
- **Image Optimization**: Serve compressed images and use `loading="lazy"`.  
- **HTTP Caching**: Leverage browser caching and CDN headers for static assets.  
- **Prefetch & Preload**: Hint next page data or large assets via `<link rel="prefetch">` if needed.

---

## 8. Testing and Quality Assurance

### 8.1 Testing Strategies
1. **Unit Tests**: Vitest + React Testing Library for components (`Button`, `LoginForm`) and hooks (`useAuth`).  
2. **Integration Tests**: Simulate full login flow (filling form, mocking API response, redirect).  
3. **End-to-End (E2E)**: Cypress or Playwright to test real browser interactions (register → login → dashboard).  

### 8.2 Tooling
- **Vitest**: Fast test runner compatible with Vite projects.  
- **React Testing Library**: Encourages testing based on user behavior.  
- **ESLint & Prettier**: Enforce code style and catch common mistakes early.  
- **TypeScript**: Compile-time type checking prevents many runtime errors.

---

## 9. Conclusion and Overall Frontend Summary

This frontend guideline lays out a clear, modern setup for building a secure authentication system:
- **Architecture**: Vite + React + TypeScript ensures speed and reliability.  
- **Design**: Focus on usability, accessibility, and responsiveness, with a cohesive, flat design.  
- **Components & State**: Modular, reusable components combined with TanStack Query and Context make data flow predictable.  
- **Routing & Security**: Public vs. protected routes with token-based session handling keep users safe.  
- **Performance & QA**: Lazy loading, code splitting, and comprehensive testing deliver a smooth, bug-free experience.

With this foundation, you can confidently swap out Supabase for your Golang backend. Simply point the API client to your new endpoints, implement JWT or cookie-based auth, and the rest of the stack—forms, UI, and state logic—works without friction.