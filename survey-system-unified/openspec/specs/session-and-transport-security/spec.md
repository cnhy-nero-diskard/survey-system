## Purpose

Ensure session cookies are configured correctly per environment, CORS fails closed against unrecognized/unconfigured origins, and CSRF protection is deliberately resolved (enforced or removed) rather than left half-installed.

## Requirements

### Requirement: Session cookies are environment-appropriate and consistent
The system SHALL set the `secure` cookie attribute based on the runtime environment (not hardcoded false) on both the express-session cookie (`connect.sid`) and the admin JWT cookie (`token`). The system SHALL set an explicit `sameSite` attribute on both cookies, and the `sameSite` value SHALL be consistent across all session/auth cookies. The system SHALL clear cookies on logout using the same attributes used to set them. The system SHALL validate that `SESSION_SECRET` is set at startup before the session middleware is initialized; if it is missing, the server SHALL exit with an error message naming the variable.

#### Scenario: Login in production
- **WHEN** a user logs in with `NODE_ENV=production`
- **THEN** the admin JWT cookie is set with `secure: true` and an explicit `sameSite` value

#### Scenario: Anonymous session cookie in production
- **WHEN** the server starts with `NODE_ENV=production` and a client makes a request that creates an anonymous session
- **THEN** the express-session cookie (`connect.sid`) is set with `secure: true` and an explicit `sameSite` value

#### Scenario: Session cookie sameSite is explicit
- **WHEN** the express-session middleware is configured
- **THEN** the `cookie.sameSite` option is set to an explicit value (not omitted), matching the `sameSite` value used on the admin JWT cookie

#### Scenario: Logout
- **WHEN** a user logs out
- **THEN** the cookie is cleared using the same `secure`/`sameSite`/`httpOnly` attributes it was set with, so it is fully removed by the browser

#### Scenario: SESSION_SECRET is not set
- **WHEN** the server starts without `SESSION_SECRET` in the environment
- **THEN** the server exits before initializing the session middleware and prints an error message that includes the string `SESSION_SECRET`

### Requirement: CORS fails closed
The system SHALL NOT allow credentialed cross-origin requests from an unrecognized origin, including when `FRONTEND_URL` is unset. The `FRONTEND_URL` environment variable SHALL be the canonical and sole source of the allowed CORS origin; no other variable (including `CORS_ORIGIN`) SHALL be read for this purpose.

#### Scenario: FRONTEND_URL is not configured
- **WHEN** the server starts without `FRONTEND_URL` set
- **THEN** CORS does not fall back to allowing any origin with credentials enabled

#### Scenario: Request from an unrecognized origin
- **WHEN** a credentialed request arrives from an origin not matching `FRONTEND_URL`
- **THEN** the request is rejected by CORS

#### Scenario: FRONTEND_URL is documented as the CORS origin variable
- **WHEN** reviewing `.env.example`
- **THEN** `FRONTEND_URL` is listed as the variable controlling the CORS allowed origin, and `CORS_ORIGIN` is not present because no code path reads it

### Requirement: CSRF protection is deliberately resolved
The system SHALL either enforce CSRF protection on state-changing routes or explicitly remove the unused CSRF dependency — not leave it installed and unwired.

#### Scenario: CSRF dependency is present in the manifest
- **WHEN** `csurf` (or its replacement) is listed as a dependency
- **THEN** it is actively enforced on state-changing routes

#### Scenario: CSRF protection is not adopted
- **WHEN** the team decides not to adopt CSRF middleware for this app
- **THEN** the unused dependency is removed from the manifest
