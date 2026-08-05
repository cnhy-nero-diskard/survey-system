## 1. Refactor spam throttle middleware

- [ ] 1.1 Hoist two shared `rateLimit()` instances to module scope in `server/middleware/spamthrottle.js`: one high-tier limiter (`max: 5`, `windowMs: 60 * 1000`, custom 429 handler) and one moderate-tier limiter (`max: 15`, `windowMs: 60 * 1000`), so the `MemoryStore` persists across requests.
- [ ] 1.2 Add a synchronous `keyGenerator` to both shared limiters that returns `req.session.anonymousUserId` so counters are scoped per anonymous user.
- [ ] 1.3 Update the `spamThrottle` handler to look up `spamcounter`, then delegate to the high-tier limiter when `spamcounter >= 40`, the moderate-tier limiter when `spamcounter >= 20`, and `next()` otherwise.
- [ ] 1.4 Preserve fail-open behavior: `next()` when there is no `anonymousUserId`, when the user is not found, or when the DB query throws.
- [ ] 1.5 Replace the `console.error` in the catch block with the imported winston `logger.error(...)`.

## 2. Verify

- [ ] 2.1 Confirm `server/server.js` still wires `app.use(spamThrottle)` with no changes needed.
- [ ] 2.2 Run the server test suite (`npm test` in `server/`) to confirm no regressions.
- [ ] 2.3 Manually verify throttling: a user with `spamcounter >= 40` receives HTTP 429 after 5 requests within a minute, and the counter persists across requests (not reset per request).