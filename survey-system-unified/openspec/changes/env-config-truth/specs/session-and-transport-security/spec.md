## MODIFIED Requirements

### Requirement: Session cookies are environment-appropriate and consistent
The system SHALL set the `secure` cookie attribute based on the runtime environment (not hardcoded false), set `sameSite` explicitly, and clear cookies on logout with the same attributes used to set them. The system SHALL validate that `SESSION_SECRET` is set at startup before the session middleware is initialized; if it is missing, the server SHALL exit with an error message naming the variable.

#### Scenario: Login in production
- **WHEN** a user logs in with `NODE_ENV=production`
- **THEN** the session cookie is set with `secure: true` and an explicit `sameSite` value

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