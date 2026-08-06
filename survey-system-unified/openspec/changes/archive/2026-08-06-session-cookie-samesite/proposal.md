## Why

The express-session cookie (anonymous survey sessions) is set without an explicit `sameSite` attribute (`server/server.js:82-85`), while the admin JWT cookie already sets `sameSite: 'lax'` (`server/controllers/authController.js:35`). The existing `session-and-transport-security` spec requires "set `sameSite` explicitly," but the implementation is incomplete for the session cookie — a CSRF-defense gap flagged as audit finding S4 (`docs/audit-2026-08-05-phase-1-verification.md`). Without an explicit `sameSite`, browsers default to `Lax` in modern versions but to `None` in older ones, leaving the session cookie's cross-site behavior implicit and inconsistent with the JWT cookie.

## What Changes

- Set `sameSite: 'lax'` explicitly on the express-session cookie configuration in `server/server.js` so it matches the JWT cookie's posture and satisfies the existing spec requirement.
- Tighten the `session-and-transport-security` spec so the "Session cookies are environment-appropriate and consistent" requirement explicitly covers **both** the express-session cookie and the JWT token cookie, and requires a consistent `sameSite` value across all auth/session cookies.
- Add a spec scenario that specifically asserts the express-session cookie carries an explicit `sameSite` attribute (not just the login JWT cookie).

## Capabilities

### New Capabilities
<!-- No new capabilities — this tightens an existing spec. -->

### Modified Capabilities
- `session-and-transport-security`: Tighten the session-cookie requirement to explicitly cover the express-session cookie (not just the JWT token cookie) and require a consistent `sameSite` value across all session/auth cookies.

## Impact

- **Code**: `server/server.js` — add `sameSite: 'lax'` to the `express-session` `cookie` config (one line).
- **Specs**: Delta to `session-and-transport-security` spec — add explicit coverage of the express-session cookie and a consistency requirement across cookies.
- **No API, DB schema, or dependency changes**; no client-side changes. The change is a one-line server config fix plus a spec tightening.