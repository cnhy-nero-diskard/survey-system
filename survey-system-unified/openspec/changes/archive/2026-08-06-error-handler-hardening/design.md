## Context

The server currently has a minimal error handler at `server/middleware/errorHandler.js` that:
1. Uses `console.error(err.stack)` — bypassing the project's winston logger (`server/middleware/logger.js`).
2. Always returns HTTP 500 regardless of the actual error type.
3. Logs `undefined` when controllers call `next("string")` (~20 sites in `adminController.js`), because strings have no `.stack` property.

Additionally, multiple server files use `console.error`/`console.log` instead of winston: `adminController.js` (~10 calls), `authMiddleware.js` (1), `spamthrottle.js` (1), `db.js` (3). The project already has a configured winston logger with custom levels (`database`, `admin`, `toclient`) and console + file transports.

This is a cleanup/hardening change: no new features, no API contract changes, no new dependencies. The winston logger already exists and is imported elsewhere in the codebase.

## Goals / Non-Goals

**Goals:**
- Error handler SHALL use winston (`logger.error`) instead of `console.error`
- Error handler SHALL preserve HTTP status codes from upstream errors (via `err.status` or `err.statusCode`)
- Error handler SHALL handle both Error objects and string errors (no more `undefined` in logs)
- All `next("string")` calls in `adminController.js` SHALL become `next(new Error("string"))` so stack traces are available
- All remaining `console.error`/`console.log` calls in server files SHALL be replaced with appropriate winston logger calls

**Non-Goals:**
- Adding structured error types or custom error classes
- Changing the shape of error responses sent to clients (still `{ error: "..." }`)
- Touching client-side error handling (e.g., `SurveyStatsErrorBoundary`, `usePerformance` hooks)
- Fixing the spam throttle (S6) or anonymous active flag (C2) — those are separate changes
- Adding error monitoring/alerting infrastructure
- Refactoring controller logic beyond error propagation calls

## Decisions

### Decision 1: Error handler uses winston `logger.error` directly

**Chosen:** Import winston `logger` from `middleware/logger.js` and call `logger.error()` in the error handler.

**Alternatives considered:**
- **Express-winston middleware**: Adds a dependency; overkill for replacing one `console.error` call. The error handler is already the last middleware in the chain (`server.js:137`), so a separate middleware layer is unnecessary.
- **Custom event emitter**: The logger already emits log events via `logEmitter`; no need for another event layer.

**Rationale:** The logger is already configured with levels, colors, timestamps, console + file transports, and an event emitter for the SSE log stream. Reusing it is free and consistent.

### Decision 2: Status code detection via `err.status` / `err.statusCode`

**Chosen:** Check `err.status` first, then `err.statusCode`, default to 500. Do NOT use `err.statusCode` from pg/DB errors directly (those are driver-internal codes, not HTTP).

**Alternatives considered:**
- **Custom `HttpError` class**: Would require changing all ~20 `next()` sites to use a new class. More typing, more risk of missing a site. The `next(new Error("..."))` pattern is idiomatic Express — controllers that need a non-500 status can set `err.status = 400` before calling `next(err)`.
- **`instanceof` check**: Not reliable across module boundaries in Node.js (different copies of the same class).

**Rationale:** The `err.status` property is the Express convention. Controllers can optionally set it for client errors. All existing `next(err)` calls pass Error objects (which default to 500), so the change is backward-compatible.

### Decision 3: String error handling via fallback

**Chosen:** If `err` is a string, wrap it in `new Error(err)` before logging, and log at `logger.error` level.

**Alternatives considered:**
- **Convert all `next("string")` sites AND add detection**: Doing both covers the case where a missed string slips through (e.g., from a third-party middleware or future code). Defense in depth.
- **Only convert sites, don't add detection**: Brittle — a future developer could add `next("string")` without realizing the log impact.

**Rationale:** The error handler is the last line of defense. It should be resilient to non-Error objects regardless of what controllers do. Converting string errors to Error objects in the handler adds negligible overhead and prevents silent `undefined` logs.

### Decision 4: Console-to-winston replacement is mechanical

**Chosen:** Replace each `console.error`/`console.log` with the equivalent winston level:
- `console.error` → `logger.error`
- `console.log` → `logger.info` (or `logger.debug` for verbose diagnostic output)

**Rationale:** These are 1:1 replacements. No logic changes, no control flow changes. Each file already imports or can import from `middleware/logger.js`.

## Risks / Trade-offs

- **[Risk] Missed `next("string")` site** → Error handler's string-fallback catches it (Decision 3). Logged correctly, still returns 500.
- **[Risk] Winston file transport writes `error.log` to CWD** → Existing behavior (logger.js:52); not changed by this design. If the CWD is the server root, `error.log` accumulates there. This is acceptable — separate concern from this change.
- **[Risk] Log event emitter not consumed** → The logger emits events via `logEmitter` used by the SSE log stream (`adminController.js`). Error logs will now appear in the admin SSE stream, which is desirable (admins can see errors in real-time).
- **[Trade-off] No error classification** → All errors are logged at `error` level. A future change could distinguish operational errors (4xx, `warn`) from programmer errors (5xx, `error`). Out of scope for now.