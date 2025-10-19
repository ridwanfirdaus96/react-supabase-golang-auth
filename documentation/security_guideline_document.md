# Security Guidelines for react-supabase-golang-auth

This document provides a comprehensive set of security guidelines tailored to the **react-supabase-golang-auth** starter template. It covers both the React frontend and the custom Golang backend you will build for user authentication. Adhering to these principles will ensure a robust, maintainable, and secure application.

---

## 1. Security by Design & Secure Defaults

- Embed security from day one. Treat every component, configuration, and deployment step as a potential attack surface.  
- Ship with secure defaults:
  - Enforce HTTPS (TLS 1.2+) for all connections (frontend ↔ backend, backend ↔ database).  
  - Disable verbose errors and debug tools in production builds.  
  - Fail closed: if a security control fails, ensure access is denied rather than allowed.

## 2. Authentication & Access Control

### Frontend
- Use `httpOnly` and `Secure` cookies for tokens. Avoid storing JWTs in `localStorage` or `sessionStorage`.  
- Implement automatic token renewal (refresh tokens) with short-lived access tokens.  
- Protect sensitive routes with a React Router wrapper that checks authentication state on every navigation.

### Backend (Golang)
- **Strong Password Policies:** enforce minimum length (e.g., ≥ 12 characters), complexity rules, and rate-limit registration attempts.  
- **Password Hashing:** use `bcrypt` or `Argon2id` with unique per-user salts.  
- **JWT Security:**
  - Choose a strong algorithm (e.g., `HS256` or `RS256`)—never `none`.  
  - Sign tokens with a securely stored secret or private key.  
  - Validate `exp`, `iat`, and audience (`aud`) claims on every request.  
- **Session Management:**
  - Implement idle and absolute timeouts.  
  - Provide logout endpoints that revoke refresh tokens.  
- **Role-Based Access Control (RBAC):**
  - Define immutable roles (e.g., `user`, `admin`) in code or a protected database table.  
  - Enforce role checks server-side on every protected endpoint.
- **Multi-Factor Authentication (MFA):** consider adding TOTP or SMS-based MFA for high-value accounts.

## 3. Input Handling & Validation

- **Client-Side:** continue using React Hook Form + Zod to validate shape and types of every request payload.  
- **Server-Side:** re-validate all incoming JSON against the same Zod-equivalent schemas (e.g., [go-playground/validator](https://github.com/go-playground/validator)).  
- **Prevent Injection Attacks:**
  - Use prepared statements or parameterized queries for PostgreSQL (e.g., `database/sql` with `pgx`).  
  - Never interpolate user input directly into SQL or OS commands.  
- **Prevent Template Injection:** if rendering server-side templates, strictly escape user data.

## 4. Data Protection & Privacy

- **Transport Encryption:** enforce HTTPS with HSTS (`Strict-Transport-Security` header).  
- **At-Rest Encryption:** enable database disk encryption and, if necessary, column-level encryption for sensitive fields.  
- **Secrets Management:**
  - Store API keys, DB credentials, and JWT secrets in a vault (e.g., HashiCorp Vault, AWS Secrets Manager).  
  - Do **not** commit `.env` files with real values.
- **Logging & Error Handling:**
  - Mask PII in logs.  
  - Return generic error messages to clients (e.g., `Invalid credentials`).  
  - Capture full stack traces only in secure, access-controlled log storage.

## 5. API & Service Security

- **Rate Limiting & Throttling:** protect login and registration endpoints from brute-force attacks (e.g., 5 attempts/minute/IP).  
- **CORS Configuration:** allow only trusted origins (e.g., your deployed frontend domain).  
- **HTTP Verbs & Status Codes:** use GET for reads, POST for creates/auth, PUT/PATCH for updates, DELETE for deletes. Return appropriate status codes (`200`, `201`, `400`, `401`, `403`, `429`, `500`).  
- **API Versioning:** prefix routes (e.g., `/api/v1/auth/login`) to allow future changes without breaking clients.

## 6. Web Application Security Hygiene

- **Security Headers:** configure the following in your frontend server (and reverse proxy):
  - `Content-Security-Policy`: restrict script sources, disallow inline scripts/styles.  
  - `X-Frame-Options: DENY` (or `SAMEORIGIN`).  
  - `X-Content-Type-Options: nosniff`.  
  - `Referrer-Policy: no-referrer-when-downgrade` (or stricter).  
- **CSRF Protection:** for state-changing requests (if not purely JWT-based), implement Anti-CSRF tokens.  
- **Subresource Integrity (SRI):** if loading CDN scripts, include integrity hashes.

## 7. Infrastructure & Deployment

- **Server Hardening:** disable unused services, enforce least-privilege file permissions, and remove default accounts.  
- **Dependency Updates:** automate vulnerability scanning (Snyk, GitHub Dependabot).  
- **CI/CD Security:**
  - Store credentials in encrypted secrets.  
  - Run linters, SCA tools, and penetration-test workflows in CI.  
  - Enforce code reviews and branch protection rules.
- **TLS Configuration:** use only strong cipher suites, disable TLS 1.0/1.1.

## 8. Dependency Management

- Use lockfiles (`package-lock.json`, `go.sum`) to ensure reproducible builds.  
- Regularly audit and update dependencies.  
- Avoid bloat: include only the libraries you actively use.

---

Adhering to these guidelines will help you build a solid, secure foundation for your React + Golang authentication system. Security is an ongoing process—review and update these controls regularly as your application evolves.