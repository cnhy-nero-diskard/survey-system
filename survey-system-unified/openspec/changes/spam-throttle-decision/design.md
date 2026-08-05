## Context

`server/middleware/spamthrottle.js` is wired globally in `server/server.js` (`app.use(spamThrottle)`) and is intended to throttle anonymous survey users based on their `anonymous_users.spamcounter`. The current implementation is dead code: it calls `rateLimit({...})` **inside the request handler** (lines 27 and 39), so a brand-new limiter with a fresh in-memory `MemoryStore` is created on every request. The counter resets each time, so `max: 5` / `max: 15` are never reached. The maintainer scrapped it during development because it "worked 1/4th of the time"; the decision is to fix it.

The project uses `express-rate-limit@^7.5.0` (ES modules, `"type": "module"`). The middleware already imports the winston `logger` and the `pool` from `server/config/db.js`.

## Goals / Non-Goals

**Goals:**
- Make the spam throttle actually throttle: request counters MUST persist across requests within the 1-minute window.
- Preserve the existing tiered thresholds based on `spamcounter`:
  - `>= 40` → 5 requests/minute, HTTP 429 with a throttle message.
  - `>= 20` → 15 requests/minute.
  - `< 20` → no throttling.
- Keep fail-open behavior: missing session id, unknown user, or DB error → request proceeds.
- Use the winston `logger` consistently (replace the `console.error` in the catch block).
- Keep the global wiring in `server.js` unchanged.

**Non-Goals:**
- No schema changes (`spamcounter` already exists on `anonymous_users`).
- No new dependencies.
- No changes to how `spamcounter` is incremented (that logic lives elsewhere and is out of scope).
- No per-IP rate limiting or global rate limiting changes (the existing global limiter in `server.js` is separate).
- No multi-instance / distributed rate limiting (single-process deployment; see Risks).

## Decisions

### D1: Hoist two shared limiter instances to module scope
Create two `rateLimit()` instances **once at module load** — one for the high tier (`max: 5`) and one for the moderate tier (`max: 15`) — and reuse them across requests. In `express-rate-limit` v7, the default `MemoryStore` lives for the lifetime of the limiter instance, so counters accumulate across requests within `windowMs`.

**Rationale:** This is the minimal, direct fix for the root cause (per-request limiter creation). It matches the audit's recommendation ("use a persistent store / single shared limiter instance").

**Alternatives considered:**
- *Persistent store (e.g., `rate-limit-redis` or a Postgres-backed store):* More robust across restarts and multi-instance, but adds a dependency and infra. The app is single-process and has never been deployed; overkill for now.
- *Remove the middleware entirely:* Rejected — the maintainer's decision is to fix it.

### D2: Key the limiter by `anonymousUserId` via `keyGenerator`
Both shared limiters use a synchronous `keyGenerator` that returns `req.session.anonymousUserId`. This scopes counters per anonymous user rather than per IP (the v7 default), which is the intended semantic (the throttle is about the user's spam counter, not their IP).

**Rationale:** `express-rate-limit` v7 requires a synchronous `keyGenerator`; `req.session.anonymousUserId` is available synchronously, so this is compatible. Per-user keying is correct because the throttle targets abusive anonymous accounts.

**Alternative considered:** *Default IP keying:* Wrong semantic — a user behind a changing IP would evade the throttle, and a shared IP (NAT) would throttle innocent users.

### D3: Keep the async DB lookup, then delegate to the shared limiter
The middleware stays `async`: it looks up `spamcounter` from `anonymous_users`, then:
- `spamcounter >= 40` → invoke the high-tier shared limiter (`max: 5`, custom 429 handler).
- `spamcounter >= 20` → invoke the moderate-tier shared limiter (`max: 15`).
- otherwise → `next()`.

**Rationale:** Preserves the existing tiered behavior and fail-open semantics with minimal restructuring. The DB lookup happens before the limiter is invoked, so the limiter's `keyGenerator` can safely read the session id.

### D4: Replace `console.error` with the winston `logger`
The catch block currently uses `console.error`; the rest of the file uses the imported winston `logger`. Use `logger.error(...)` for consistency with the project's structured logging.

## Risks / Trade-offs

- [In-memory counters reset on server restart] → Acceptable: the app has never been deployed and runs single-process; a restart simply resets the 1-minute window. If multi-instance deployment happens later, migrate to a shared store (e.g., `rate-limit-redis`).
- [Memory growth from many anonymous users] → `MemoryStore` entries expire after `windowMs` (1 minute), bounding memory. Acceptable for the current scale.
- [DB lookup adds latency to every request] → The query is a single indexed PK lookup (`anonymous_user_id`); the existing code already does this. Fail-open ensures a slow/failed lookup never blocks submissions.
- [Throttle can be evaded by creating a new session] → Out of scope: session creation is governed by `anonymousUserMiddleware`; this change only fixes the throttle mechanics, not session lifecycle.
- [`spamcounter` may be unreliable (audit C2: `is_active` flag issues)] → The throttle reads `spamcounter`, not `is_active`; C2 is tracked separately and does not block this change.

## Migration Plan

1. Rewrite `server/middleware/spamthrottle.js` per D1–D4.
2. No `server.js` changes (wiring already in place).
3. No schema or dependency changes.
4. Rollback: revert the single file; the middleware returns to its previous (non-functional) state, which is no worse than today.

## Open Questions

- None blocking. The tier thresholds (5/15 per minute, 1-minute window) are preserved from the existing code; tuning them is a follow-up if the maintainer wants different limits.