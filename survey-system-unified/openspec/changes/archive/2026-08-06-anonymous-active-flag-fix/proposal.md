## Why

The `is_active` flag on `anonymous_users` is unreliable: new anonymous users are inserted with `is_active = false` (contradicting the code comment), and the inactivity mechanism uses per-request `setTimeout` timers that are never cancelled, so a stale timer can mark an actively browsing user as inactive. This makes the admin "active users" ordering in `fetchAnonymousUsers` (which sorts by `is_Active DESC`) misleading.

## What Changes

- Fix `handleAnonymousUser` so a newly created anonymous user is inserted with `is_active = TRUE` instead of `FALSE`.
- Replace the flawed per-request `setTimeout` inactivity mechanism with a correct activity model:
  - Track the last activity timestamp per anonymous user (e.g., `last_active_at` column) instead of relying on fire-and-forget timers.
  - Derive "active" from `last_active_at` within a defined inactivity window, or maintain a single cancellable timer per session.
- Remove the dead `updateAnonymousUserActivity` middleware, which reads a never-set `anonymousUserId` cookie and is not wired into any route.
- Update the admin anonymous-users query to use the corrected activity model for ordering.

## Capabilities

### New Capabilities
- `anonymous-user-activity`: Correct lifecycle of the anonymous user `is_active` flag — new users start active, activity is tracked accurately, and inactive state is derived or set without stale timers.

### Modified Capabilities
<!-- No existing spec covers anonymous user activity tracking; no requirement changes to existing specs. -->

## Impact

- `server/middleware/anonymousUserMiddleware.js` — fix insert value and rework inactivity handling.
- `server/middleware/updateAnonymousUserActivity.js` — remove dead middleware.
- `server/services/adminService.js` — update `fetchAnonymousUsers` ordering to match the corrected activity model.
- `server/localization_queries/schemacreation/anonymousUsers.sql` and related migration SQL — add `last_active_at` column (or equivalent) if the timestamp-based approach is chosen.
- `server/server.js` — no wiring change required (dead middleware was never registered), but verify no references remain.
- Admin UI (`client/src/components/datamanager/AnonymousUsersHandler.jsx`) — no API contract change expected; ordering behavior improves.