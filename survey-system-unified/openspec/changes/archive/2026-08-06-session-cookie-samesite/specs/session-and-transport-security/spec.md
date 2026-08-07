## MODIFIED Requirements

### Requirement: Session cookies are environment-appropriate and consistent
The system SHALL set the `secure` cookie attribute based on the runtime environment (not hardcoded false) on both the express-session cookie (`connect.sid`) and the admin JWT cookie (`token`). The system SHALL set an explicit `sameSite` attribute on both cookies, and the `sameSite` value SHALL be consistent across all session/auth cookies. The system SHALL clear cookies on logout using the same attributes used to set them.

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