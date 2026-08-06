## Context

The `anonymous_users` table tracks anonymous survey participants. Administrators inspect these users through the `AnonymousUsersHandler` UI, which is backed by `fetchAnonymousUsers` in `server/services/adminService.js`. That query orders results by `is_Active DESC, created_at DESC`, so the `is_active` flag directly controls which users appear as "active" first.

The current activity mechanism lives in `server/middleware/anonymousUserMiddleware.js` (`handleAnonymousUser`), registered globally in `server.js`:

- On a new session it inserts the user with `is_active = FALSE` (a bug — the comment says it should be `TRUE`).
- On subsequent requests it sets `is_active = TRUE` and schedules a 1-minute `setTimeout` that flips `is_active = FALSE`.
- Because each request schedules a new timer without cancelling previous ones, stale timers mark actively browsing users as inactive.

There is also `server/middleware/updateAnonymousUserActivity.js`, which is dead code: it is never imported, and it reads `req.cookies.anonymousUserId`, a cookie that is never set (the ID lives in the session, not a cookie).

Constraints: the server runs as a single Node process with a Postgres-backed session store (`connect-pg-simple`). No new external dependencies should be introduced.

## Goals / Non-Goals

**Goals:**
- New anonymous users are immediately active (`is_active = TRUE`).
- Active state accurately reflects continued use — a user browsing for longer than 1 minute is not spuriously marked inactive.
- Eliminate the fire-and-forget `setTimeout` timers and the dead `updateAnonymousUserActivity` middleware.
- Keep the admin anonymous-users ordering meaningful under the corrected activity model.

**Non-Goals:**
- Not changing the public API contract of `GET /api/admin/anonymous-users` (the response shape stays the same).
- Not redesigning the survey/submission flow or spam detection.
- Not introducing a separate presence/websocket tracking system.

## Decisions

### Decision 1: Timestamp-based activity tracking instead of timers

Add a `last_active_at TIMESTAMP` column to `anonymous_users`. On every public request for an anonymous user, run:

```sql
UPDATE anonymous_users
SET last_active_at = NOW()
WHERE anonymous_user_id = $1;
```

"Active" is then derived: a user is active if `last_active_at` is within an inactivity window (e.g., 1 minute) of `NOW()`. The `fetchAnonymousUsers` query becomes:

```sql
SELECT *,
       (last_active_at >= NOW() - INTERVAL '1 minute') AS is_active
FROM anonymous_users
ORDER BY is_active DESC, created_at DESC;
```

**Rationale:** This removes per-request timers entirely, so there is no stale-timer bug and no risk of accumulating timers in the process. It is idempotent (a simple `UPDATE` on each request) and stateless across requests. The existing `is_active` column is kept and recomputed from `last_active_at` so the frontend contract is unchanged.

**Alternatives considered:**
- *Single cancellable timer stored on the session* — works but couples timer lifecycle to session objects and is more code to keep correct; timestamp derivation is simpler and event-driven by the DB.
- *Keep timers but clear them before scheduling* — still fragile (e.g., a timer may fire between requests) and doesn't aid the admin ordering query.

### Decision 2: Backfill and schema via existing migration SQL

Add a migration that creates `last_active_at` and backfills it from `created_at` for existing rows, then sets `is_active` from the derived window. This lives beside the existing schema SQL in `server/localization_queries/schemacreation/`.

**Rationale:** The project already stores schema DDL and `ALTER TABLE` statements as SQL files (e.g., `survey_responses.sql`). Following that convention keeps the migration discoverable and consistent with how the schema is managed.

### Decision 3: Remove the dead `updateAnonymousUserActivity` middleware

Delete `server/middleware/updateAnonymousUserActivity.js`. It is not imported anywhere (`server.js` only imports `handleAnonymousUser`), and it reads a cookie that is never set.

**Rationale:** Dead code is a maintenance and security liability (it performs DB writes using an unvalidated cookie value). Removing it reduces confusion and confirms `handleAnonymousUser` is the single source of truth for activity.

## Risks / Trade-offs

- **Stale `last_active_at` accuracy** → `last_active_at` is only as fresh as the last request. Users who close their tab remain "active" until the window elapses on the next read. This is acceptable: the window is short (1 minute) and the flag is derived at query time, so reads are always consistent with the current threshold.
- **Missing column on existing deployments** → [Risk] Existing DBs lack `last_active_at`; queries referencing it fail. → Mitigation: ship the migration SQL and backfill in the same change; the query falls back to treating `NULL` as inactive via `COALESCE(last_active_at, created_at)`.
- **Behavior change for admin ordering** → The ordering semantics shift from a timer-flipped boolean to a derived window. This is the intended fix; the frontend requires no change because the API shape is preserved.
- **Single-process assumption** → In-process timers were the current implementation; moving state to the DB makes the flag correct even if the app later scales to multiple instances. No new risk introduced.

## Migration Plan

1. Apply the SQL migration: add `last_active_at TIMESTAMP` to `anonymous_users`, backfill from `created_at`, and initialize `is_active` from the derived window.
2. Deploy the server changes: rework `handleAnonymousUser` to insert with `is_active = TRUE` and update `last_active_at` on each request; remove the dead middleware; update `fetchAnonymousUsers`.
3. Verify via the admin UI that active users sort first and remain active during continuous browsing.

**Rollback:** Revert the server code changes and the migration (drop `last_active_at`). The previous timer-based behavior resumes; no data loss.

## Open Questions

- Should the inactivity window (currently 1 minute) be configurable via environment variable? The current code hard-codes 60,000 ms; a `const` constant is sufficient for now rather than adding config surface.