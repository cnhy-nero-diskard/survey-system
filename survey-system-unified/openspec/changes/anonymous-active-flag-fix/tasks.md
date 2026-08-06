## 1. Database Migration

- [x] 1.1 Add a migration SQL file (beside `server/localization_queries/schemacreation/`) that adds a `last_active_at TIMESTAMP` column to `anonymous_users`
- [x] 1.2 In the migration, backfill `last_active_at` from `created_at` for existing rows and set `is_active` from the derived inactivity window

## 2. Middleware Rework

- [x] 2.1 Update `handleAnonymousUser` in `server/middleware/anonymousUserMiddleware.js` to insert new users with `is_active = TRUE`
- [x] 2.2 Replace the per-request `UPDATE ... SET is_active = TRUE` + `setTimeout` logic with a single `UPDATE anonymous_users SET last_active_at = NOW() WHERE anonymous_user_id = $1` on each public request
- [x] 2.3 Remove the `setTimeout`/inactivity-marking code block from `handleAnonymousUser`
- [x] 2.4 Delete the dead `server/middleware/updateAnonymousUserActivity.js` file and confirm no imports reference it

## 3. Admin Query Update

- [x] 3.1 Update `fetchAnonymousUsers` in `server/services/adminService.js` to select a derived `is_active` from `last_active_at` (falling back to `created_at` on `NULL`) within the 1-minute window
- [x] 3.2 Update the query ordering to `ORDER BY is_active DESC, created_at DESC` using the derived active state

## 4. Verification

- [x] 4.1 Confirm no references to `updateAnonymousUserActivity` or an `anonymousUserId` cookie remain in the server code
- [x] 4.2 Verify `GET /api/admin/anonymous-users` returns the same response shape with active users first
- [ ] 4.3 Manually verify in the admin UI that a new anonymous user appears active and remains active during continuous browsing beyond 1 minute
