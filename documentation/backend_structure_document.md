# Backend Structure Document

## 1. Backend Architecture

Our Golang-based backend follows a clear, modular design that makes it easy to grow, fix, and speed up over time. It uses common patterns and frameworks so any developer can jump in without confusion.

**Key components and patterns:**

- **Web framework:** Gin (or the standard `net/http` library) handles routing, middleware, and request/response logic.
- **Layered structure:**
  - **Router layer** defines HTTP routes and ties them to handler functions.
  - **Service layer** contains business logic, like user registration, login, and token management.
  - **Repository layer** interacts with the database through SQL queries or an ORM.
- **Design patterns:**
  - **Dependency injection** for passing configuration and resources (database connection, JWT settings) into handlers.
  - **Repository pattern** to separate SQL queries from business logic.
  - **Middleware** for cross-cutting concerns such as logging, authentication checks, and error handling.

**How this supports our goals:**

- **Scalability:** We can spin up multiple instances behind a load balancer and share a single PostgreSQL database and Redis cache.
- **Maintainability:** Clear separation between routing, business logic, and data access helps developers locate and update code quickly.
- **Performance:** Go’s concurrency model and compiled binaries ensure low latency. Caching and optimized SQL keep response times fast.

---

## 2. Database Management

Our backend uses PostgreSQL, a proven, open-source relational database. It provides strong consistency, flexible indexing, and built-in support for advanced data types.

**Database type and system:**

- Type: SQL relational database
- System: PostgreSQL (managed via AWS RDS, DigitalOcean Managed DB, or a self-hosted cluster)

**Data handling practices:**

- **Connection pooling:** We use a library like `pgxpool` to manage connections efficiently.
- **Migrations:** Tools such as `golang-migrate` ensure schema changes are applied in a controlled, versioned manner.
- **Backups & replication:** Automated daily backups and a read replica for reporting or failover.
- **Indexing:** Frequently queried columns (e.g., `email` in the users table) receive appropriate indexes to speed up lookups.

---

## 3. Database Schema

Below is a human-readable overview of our user authentication tables, followed by SQL statements for setting them up.

### 3.1 Human-Readable Schema

- **users**: holds account credentials and status
  - `id`: unique identifier
  - `email`: user’s login email
  - `password_hash`: bcrypt-hashed password
  - `created_at`, `updated_at`: timestamps for record tracking
  - `is_active`: flag for soft-blocking accounts

- **refresh_tokens**: manages long-lived session tokens
  - `id`: unique identifier
  - `user_id`: reference to `users.id`
  - `token`: random string stored securely
  - `expires_at`: when the token becomes invalid
  - `created_at`: timestamp for when token was issued

### 3.2 SQL Schema (PostgreSQL)

```sql
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(512) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Optional index for faster lookup
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
``` 

---

## 4. API Design and Endpoints

We use a RESTful approach with JSON payloads. All endpoints live under `/api` and return consistent response structures.

**Authentication endpoints:**

- `POST /api/register`
  - Purpose: Create a new user account.
  - Body: `{ "email": string, "password": string }`
  - Response: 201 Created with basic user info (no passwords).

- `POST /api/login`
  - Purpose: Verify credentials and start a session.
  - Body: `{ "email": string, "password": string }`
  - Response: 200 OK with a short-lived JWT in the body or set as an `httpOnly` cookie.

- `POST /api/logout`
  - Purpose: Invalidate the current refresh token.
  - Body: none (relies on cookie or auth header).
  - Response: 204 No Content.

- `GET /api/user`
  - Purpose: Return the authenticated user’s profile.
  - Headers or Cookies: JWT or session cookie.
  - Response: 200 OK with `{ "id", "email", "is_active" }`.

**Supplemental endpoints (optional):**

- `POST /api/refresh-token`
  - Purpose: Exchange a valid refresh token for a new JWT.
  - Body: `{ "refresh_token": string }` or via cookie.
  - Response: 200 OK with new JWT.

---

## 5. Hosting Solutions

We recommend running the Go service and database in the cloud for reliability and easy scaling. Common choices:

- **AWS:**
  - Compute: Elastic Container Service (ECS) with Fargate or Elastic Beanstalk
  - Database: Amazon RDS for PostgreSQL
- **Google Cloud:**
  - Compute: Cloud Run or GKE (Kubernetes)
  - Database: Cloud SQL for PostgreSQL
- **Heroku / DigitalOcean:**
  - Simpler deployments with managed Postgres and container support

**Why this setup?**

- **Reliability:** Managed services handle OS patches and failover.
- **Scalability:** Auto-scaling for compute and read-replicas for the database.
- **Cost-effectiveness:** Pay for actual usage and avoid upfront hardware investments.

---

## 6. Infrastructure Components

A solid infrastructure improves speed, resilience, and user experience.

- **Load Balancer:** Distributes traffic across multiple Go service instances (AWS ALB, GCP Load Balancer).
- **Caching:** Redis (ElastiCache or Memorystore) for session storage or rate-limiting counters.
- **Content Delivery Network (CDN):** CloudFront or Cloudflare for serving static assets (if any) and API acceleration.
- **Secret Management:** AWS Secrets Manager or Vault for storing database credentials and JWT secrets.
- **CI/CD Pipeline:** GitHub Actions or GitLab CI to build, test, and deploy Docker images automatically.

---

## 7. Security Measures

We follow best practices to protect user data and comply with regulations:

- **Transport security:** HTTPS everywhere, enforced via TLS certificates (ACME / Let’s Encrypt).
- **Password hashing:** bcrypt with a secure work factor.
- **Token management:**
  - JWTs signed with a strong secret or asymmetric key.
  - Refresh tokens stored server-side in Redis or database and rotated on use.
  - `httpOnly` and `Secure` flags on cookies.
- **Input validation:** Validating and sanitizing all incoming JSON payloads using Go validation libraries.
- **Authorization:** Middleware checks for valid JWTs on protected routes.
- **Rate limiting:** Throttle login and registration attempts (e.g., 5 per minute) to prevent brute force.
- **CORS:** Strict origin whitelisting to allow only approved frontend domains.

---

## 8. Monitoring and Maintenance

Keeping the system healthy and up-to-date is crucial:

- **Logging:** Structured logs (JSON) shipped to ELK (Elasticsearch, Logstash, Kibana) or a managed log service.
- **Metrics:** Prometheus exporters for Go and PostgreSQL, with Grafana dashboards to track CPU, memory, request rates, and error counts.
- **Alerting:** PagerDuty or Slack alerts for high error rates, slow responses, or resource exhaustion.
- **Health checks:** Endpoints like `/healthz` and `/readyz` for load balancers and Kubernetes probes.
- **Regular updates:** Scheduled updates for dependencies and base OS images, driven by Dependabot or Renovate.

---

## 9. Conclusion and Overall Backend Summary

This backend is designed to support a modern, secure authentication system built in Go with PostgreSQL. By combining a layered architecture, managed cloud services, and best-in-class security and monitoring tools, we ensure the system can grow with your users, remain maintainable, and deliver fast responses. Key differentiators include:

- A **clear separation** of concerns (routing, business logic, data access).
- **Managed services** for database, caching, and load balancing to reduce operational overhead.
- **Strong security posture** with encrypted transport, hashed passwords, and robust token management.
- **Comprehensive monitoring** and alerting, guaranteeing you see issues before they impact users.

With this structure in place, you have a reliable foundation for delivering user authentication and other business features, both now and as the application evolves.