## Why

The server's error-handling middleware and controller error-propagation patterns are broken in three ways: (1) the error handler uses `console.error` instead of the project's winston logger, (2) ~20 controller sites call `next("string")` instead of `next(new Error(...))`, causing `err.stack` to be `undefined` and logged as the literal string `undefined`, and (3) the error handler always returns HTTP 500 regardless of the actual error type. This means operational errors (validation failures, not-found) are indistinguishable from genuine server crashes, and all error context is lost in production logs.

## What Changes

- **Replace `console.error` with winston** in `errorHandler.js` — use the existing `logger` instance from `middleware/logger.js`.
- **Preserve error status codes** — detect HTTP-style errors (e.g., `err.status`, `err.statusCode`) and return the appropriate status instead of always 500.
- **Convert `next("string")` to `next(new Error("string"))`** at all ~20 sites in `adminController.js` so `err.stack` is populated and the error handler receives a proper Error object.
- **Replace remaining `console.error`/`console.log` calls** in server-side code (`adminController.js`, `authMiddleware.js`, `spamthrottle.js`, `db.js`) with winston logger calls for consistent structured logging.

## Capabilities

### New Capabilities
- `error-handling`: Centralized error handler that uses winston for structured logging, preserves HTTP status codes from upstream errors, and handles both Error objects and string errors gracefully.

### Modified Capabilities
<!-- None — this is a new capability, not modifying existing spec requirements. -->

## Impact

- `server/middleware/errorHandler.js` — rewrite to use winston, preserve status codes, handle string errors
- `server/controllers/adminController.js` — ~20 `next("string")` → `next(new Error("string"))`; ~10 `console.error`/`console.log` → `logger.error`/`logger.info`
- `server/middleware/authMiddleware.js` — 1 `console.error` → `logger.error`
- `server/middleware/spamthrottle.js` — 1 `console.log` → `logger.warn`
- `server/config/db.js` — 3 `console.log` → `logger.info`/`logger.error`
- No API contract changes; no new dependencies