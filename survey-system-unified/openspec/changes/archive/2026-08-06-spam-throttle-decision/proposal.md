## Why

The spam throttle middleware (`server/middleware/spamthrottle.js`) is non-functional: it constructs a brand-new `rateLimit()` instance with a fresh in-memory `MemoryStore` on every request (lines 27 and 39), so the request counter resets each time and the `max: 5` / `max: 15` thresholds are never reached. Spam users are never actually throttled. The maintainer scrapped this middleware during development because it "worked 1/4th of the time"; the decision is to fix it rather than remove it.

## What Changes

- Fix `server/middleware/spamthrottle.js` so the rate limiter uses a **single shared limiter instance** (persistent store) instead of creating a new `rateLimit()` per request, making the counters persist across requests.
- Preserve the existing tiered thresholds based on `anonymous_users.spamcounter`:
  - `spamcounter >= 40` → 5 requests per minute (429 response with throttle message).
  - `spamcounter >= 20` → 15 requests per minute.
  - Below 20 → no throttling.
- Replace the `console.error` in the catch block with the existing winston `logger` (consistent with the rest of the middleware).
- Preserve fail-open behavior: if the DB lookup fails or the user is not found, the request proceeds without throttling.
- Keep the middleware wired globally in `server/server.js` (`app.use(spamThrottle)`); no route changes.

## Capabilities

### New Capabilities
- `spam-throttling`: Enforce per-anonymous-user request throttling based on the user's `spamcounter`, with tiered limits and a persistent rate-limit store.

### Modified Capabilities
<!-- No existing spec covers spam/rate limiting. -->

## Impact

- **Code:** `server/middleware/spamthrottle.js` (rewrite of limiter construction), `server/server.js` (unchanged wiring).
- **Dependencies:** `express-rate-limit` (already a dependency; no new packages).
- **Data:** Reads `anonymous_users.spamcounter` (existing column, no schema change).
- **Behavior:** Anonymous users with high spam counters will now actually be throttled (429 responses), which is the intended behavior that was previously dead code.