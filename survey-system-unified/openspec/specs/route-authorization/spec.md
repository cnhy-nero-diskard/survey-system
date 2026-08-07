## Purpose

Ensure every admin/data-mutating or quota-consuming route requires authentication, and that survey response retrieval is properly scoped to the requesting user.

## Requirements

### Requirement: Admin/data-mutating routes require authentication
The system SHALL require a valid authenticated session on every admin route that mutates data, consumes paid third-party API quota, or reads admin-only data. Every route registered in the admin route file (`adminRoutes.js`) SHALL require the `authenticate` middleware; no unauthenticated route registrations are permitted in the admin route file. Public survey-support endpoints (e.g. touchpoint lookup, touchpoint localization) SHALL be registered in the client route file (`clientRoutes.js`), not the admin route file, so that the authorization boundary between admin and public routes is unambiguous. The sole exception is the admin provisioning endpoint (`POST /api/auth/register-admin`), which is authenticated by an HMAC signature (`verifyHMAC`) rather than a session cookie because it exists to bootstrap the first admin account and cannot require a pre-existing session. No other route is exempt from session-based `authenticate` middleware for data-mutating admin operations.

#### Scenario: Unauthenticated request to an admin route
- **WHEN** a client without a valid session calls an admin route that mutates data or reads admin-only data (excluding the provisioning endpoint)
- **THEN** the system responds with 401 and performs no action

#### Scenario: Unauthenticated request to a quota-consuming route
- **WHEN** a client without a valid session calls a route that triggers a paid external API call (e.g. sentiment/topic analysis)
- **THEN** the system responds with 401 and does not call the external API

#### Scenario: Admin provisioning endpoint is accessed without a session
- **WHEN** a request is sent to `POST /api/auth/register-admin` without a session cookie but with a valid `x-hmac-signature` header
- **THEN** the system accepts the request, because the provisioning endpoint is authenticated by HMAC signature, not by session

#### Scenario: Admin provisioning endpoint is accessed without an HMAC signature
- **WHEN** a request is sent to `POST /api/auth/register-admin` without a valid `x-hmac-signature` header
- **THEN** the system responds with 403 and does not create an admin account

#### Scenario: Public survey-support endpoint is accessible without admin authentication
- **WHEN** an anonymous survey user calls a touchpoint lookup or localization endpoint (e.g. `GET /api/surveytouchpoints`, `POST /api/touchpointlocal`)
- **THEN** the system processes the request without requiring admin authentication, because the endpoint is registered in the client route file and is intentionally public

#### Scenario: Admin route file contains no unauthenticated routes
- **WHEN** the admin route file is inspected
- **THEN** every route registration includes the `authenticate` middleware; no route is registered without authentication

### Requirement: Operational and monitoring endpoints require admin authentication
The system SHALL require admin authentication (`authenticate` and `authorizeAdmin` middleware) on operational and monitoring endpoints, including the Prometheus metrics endpoint (`GET /metrics`). These endpoints expose internal operational data (request counts, latencies, resource usage) that is not intended for public consumption.

#### Scenario: Unauthenticated request to the metrics endpoint
- **WHEN** a client without a valid admin session calls `GET /metrics`
- **THEN** the system responds with 401 and does not return Prometheus metrics

#### Scenario: Authenticated non-admin request to the metrics endpoint
- **WHEN** a client with a valid non-admin session calls `GET /metrics`
- **THEN** the system responds with 403 and does not return Prometheus metrics

#### Scenario: Authenticated admin request to the metrics endpoint
- **WHEN** a client with a valid admin session calls `GET /metrics`
- **THEN** the system returns the Prometheus metrics in the standard content type

### Requirement: Survey response retrieval is scoped to the requesting user
The system SHALL only return survey response data belonging to the requesting user (by authenticated identity or anonymous session identity), never an arbitrary requested user ID.

#### Scenario: A client requests another user's survey responses
- **WHEN** a client requests survey responses for a `user_id` that does not match their own authenticated/session identity
- **THEN** the system responds with 403/404 and does not return the other user's data

#### Scenario: A client requests their own survey responses
- **WHEN** a client requests survey responses for their own identity
- **THEN** the system returns their data as before
