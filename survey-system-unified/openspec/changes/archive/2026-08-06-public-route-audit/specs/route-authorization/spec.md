## MODIFIED Requirements

### Requirement: Admin/data-mutating routes require authentication
The system SHALL require a valid authenticated session on every admin route that mutates data, consumes paid third-party API quota, or reads admin-only data. Every route registered in the admin route file (`adminRoutes.js`) SHALL require the `authenticate` middleware; no unauthenticated route registrations are permitted in the admin route file. Public survey-support endpoints (e.g. touchpoint lookup, touchpoint localization) SHALL be registered in the client route file (`clientRoutes.js`), not the admin route file, so that the authorization boundary between admin and public routes is unambiguous.

#### Scenario: Unauthenticated request to an admin route
- **WHEN** a client without a valid session calls an admin route that mutates data or reads admin-only data
- **THEN** the system responds with 401 and performs no action

#### Scenario: Unauthenticated request to a quota-consuming route
- **WHEN** a client without a valid session calls a route that triggers a paid external API call (e.g. sentiment/topic analysis)
- **THEN** the system responds with 401 and does not call the external API

#### Scenario: Public survey-support endpoint is accessible without admin authentication
- **WHEN** an anonymous survey user calls a touchpoint lookup or localization endpoint (e.g. `GET /api/surveytouchpoints`, `POST /api/touchpointlocal`)
- **THEN** the system processes the request without requiring admin authentication, because the endpoint is registered in the client route file and is intentionally public

#### Scenario: Admin route file contains no unauthenticated routes
- **WHEN** the admin route file is inspected
- **THEN** every route registration includes the `authenticate` middleware; no route is registered without authentication

## ADDED Requirements

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