## MODIFIED Requirements

### Requirement: Admin/data-mutating routes require authentication
The system SHALL require a valid authenticated session on every admin route that mutates data, consumes paid third-party API quota, or reads admin-only data. The sole exception is the admin provisioning endpoint (`POST /api/auth/register-admin`), which is authenticated by an HMAC signature (`verifyHMAC`) rather than a session cookie because it exists to bootstrap the first admin account and cannot require a pre-existing session. No other route is exempt from session-based `authenticate` middleware for data-mutating admin operations.

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