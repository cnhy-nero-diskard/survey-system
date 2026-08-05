## ADDED Requirements

### Requirement: Session cookies are environment-appropriate and consistent
The system SHALL set the `secure` cookie attribute based on the runtime environment (not hardcoded false), set `sameSite` explicitly, and clear cookies on logout with the same attributes used to set them.

#### Scenario: Login in production
- **WHEN** a user logs in with `NODE_ENV=production`
- **THEN** the session cookie is set with `secure: true` and an explicit `sameSite` value

#### Scenario: Logout
- **WHEN** a user logs out
- **THEN** the cookie is cleared using the same `secure`/`sameSite`/`httpOnly` attributes it was set with, so it is fully removed by the browser

### Requirement: CORS fails closed
The system SHALL NOT allow credentialed cross-origin requests from an unrecognized origin, including when `FRONTEND_URL` is unset.

#### Scenario: FRONTEND_URL is not configured
- **WHEN** the server starts without `FRONTEND_URL` set
- **THEN** CORS does not fall back to allowing any origin with credentials enabled

#### Scenario: Request from an unrecognized origin
- **WHEN** a credentialed request arrives from an origin not on the allowlist
- **THEN** the request is rejected by CORS

### Requirement: CSRF protection is deliberately resolved
The system SHALL either enforce CSRF protection on state-changing routes or explicitly remove the unused CSRF dependency — not leave it installed and unwired.

#### Scenario: CSRF dependency is present in the manifest
- **WHEN** `csurf` (or its replacement) is listed as a dependency
- **THEN** it is actively enforced on state-changing routes

#### Scenario: CSRF protection is not adopted
- **WHEN** the team decides not to adopt CSRF middleware for this app
- **THEN** the unused dependency is removed from the manifest
