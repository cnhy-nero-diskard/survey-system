## Purpose

Ensure security-relevant middleware (helmet, rate limiting) and central error handling apply consistently across all API routes, including auth routes.

## Requirements

### Requirement: Security headers apply to all API routes
The system SHALL apply `helmet()` security headers to every API/admin/auth route.

#### Scenario: Request to any API route
- **WHEN** a client makes a request to any `/api/*` route
- **THEN** the response includes helmet's standard security headers (e.g. `X-Content-Type-Options`)

### Requirement: Rate limiting applies to all API routes
The system SHALL apply the configured rate limiter to every API/admin/auth route.

#### Scenario: Request volume exceeds the configured limit
- **WHEN** a client exceeds the configured request rate against an API route
- **THEN** the system responds with a rate-limit rejection (429) rather than processing the request

### Requirement: Errors from any route are handled centrally
The system SHALL route errors thrown by any registered route (including auth routes) through the central error handler.

#### Scenario: An error is thrown inside an auth route
- **WHEN** login, logout, or registration throws an error
- **THEN** the central error handler formats and returns the response, not Express's default error page
