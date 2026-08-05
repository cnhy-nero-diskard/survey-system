## Context

The app has never been deployed — no live users, no production data, no migration risk. That changes the calculus: fix things directly rather than defensively (feature-flag, dual-write, gradual rollout). Findings below come from direct code inspection of `server/` (~31 files) and `client/src/` (~234 files), not inference.

## Goals / Non-Goals

**Goals:**
- Close every credential-exposure and access-control gap found in the audit.
- Fix bugs that are already broken in the current code path (not hypothetical edge cases).
- Leave the dependency manifests accurate — what's listed is what's used.

**Non-Goals:**
- Test harness / coverage strategy (separate change).
- Dead code / doc consolidation / legacy folder archival (separate change).
- Architecture rework — god components, state-management consolidation (6+ React contexts vs 77 direct `localStorage` reads for language), a real API client layer adoption. Explicitly deferred; feature velocity is a later concern.

## Decisions

### `credential-logging-hygiene`
- **`server.js:59`** mounts `/api/log-stream` before session/auth middleware; handler at `controllers/adminController.js:318-337` has no auth check and broadcasts every Winston log line via SSE. **Fix:** add `authenticate`/`authorizeAdmin`, move the mount below auth middleware setup.
- **`middleware/hmacMiddleware.js:16,19`**: `verifyHMAC` logs `JSON.stringify(req.body)` on `POST /api/auth/register-admin`, which contains a plaintext password. **Fix:** redact sensitive fields before logging; never log raw bodies on auth endpoints.
- **`services/huggingFaceService.js:5`**: logs the decrypted HF API token on every call. **Fix:** remove/redact.
- **`server.js:106,109`**: `/verify-cookie` debug endpoint logs the JWT in plaintext and has no auth. **Fix:** remove the endpoint entirely.

### `security-middleware-pipeline`
- **`server.js`**: `helmet()` (~line 96) and the rate limiter (~lines 99-104) are registered *after* `clientRoutes`/`adminRoutes`/`authRoutes` (lines 85, 88, 92) — Express executes middleware in registration order, so these never run on real routes. **Fix:** move helmet/rate-limit/session setup before any `app.use('/api/...')`.
- **`server.js:89`**: `errorHandler` is registered before `authRoutes` (line 92), so errors thrown in login/logout/register skip it. **Fix:** move `errorHandler` to the very end of the chain.

### `route-authorization`
- **`routes/adminRoutes.js`** lines 28, 30, 31, 32, 77, 80, 83: no `authenticate` middleware; some have comments acknowledging the gap. **Fix:** add `authenticate` (+ `authorizeAdmin` where the action is admin-only).
- **IDOR**: `routes/clientRoutes.js:24` → `controllers/surveyController.js:55-65` → `services/surveyService.js:62-72` — query is `WHERE sr.user_id = $1 OR sr.anonymous_user_id = $2`, no auth, arbitrary `user_id` in the URL. **Fix:** require auth/session and scope the query to the caller's own identity, or require a possession token instead of a guessable ID.

### `session-and-transport-security`
- **`server.js:71`**, **`controllers/authController.js:34-38`**: `secure: false` hardcoded (comment: `//TRUE IF IN PRODUCTION`, never made conditional); `sameSite` commented out. Logout (`authController.js:63-67`) clears with different attributes (`secure: true, sameSite: 'none'`) than login set (`secure: false`, no `sameSite`) — mismatched attributes can leave the cookie only partially cleared. **Fix:** `secure: process.env.NODE_ENV === 'production'`, explicit `sameSite`, matching set/clear attributes.
- **`server.js:49-53`**: `origin: process.env.FRONTEND_URL || true` with `credentials: true` — when `FRONTEND_URL` is unset (the code explicitly supports this "unified deployment" case), this allows any origin with credentials. **Fix:** fail closed — require `FRONTEND_URL` or an explicit allowlist in every environment.
- **`csurf`** is a listed dependency, never imported anywhere (confirmed by grep). **Decision needed at implementation time:** wire it into state-changing routes, or remove it. Don't leave it ambiguous.

### `survey-submission-correctness`
- **`controllers/adminController.js:626`**: calls undefined `createSurveyResponse`; the real export is `createSurveyResponseService` (`services/adminCRUD.js:350`). **Fix:** import and call the correct function.
- **`controllers/adminController.js:210-238`**: `autoAnalyzeSentimentController` does `pool.query('BEGIN')` then several more `pool.query(...)` calls — each may run on a different pooled connection, so there's no real atomicity. Contrast with the correct pattern already used in `services/clientService.js` and `services/analyticsCRUD.js` (`pool.connect()` → dedicated client → `BEGIN/COMMIT/ROLLBACK` → `finally { client.release() }`). **Fix:** mirror that pattern.
- **`routes/clientRoutes.js:23`** vs **`routes/adminRoutes.js:22`**: `POST /api/survey/submit` registered twice with incompatible body contracts; since `clientRoutes` mounts first, the `adminRoutes` registration (with validation middleware) is dead. **Fix:** pick one contract, delete the other registration.
- **`controllers/surveyController.js:24-41`**: inside a `.map()` loop, a per-item catch can call `res.status(404).json(...)` and then re-throw, risking "headers already sent" if more than one item fails. **Fix:** return immediately after the first response is sent; don't also throw past it.

### `dependency-hygiene`
- Backend: remove `crypto` (deprecated placeholder, Node's builtin always wins anyway), `cryptojs` (unused; `crypto-js` is what's actually imported), `expres` (typo, never imported).
- Frontend: remove `react-query`, `@chakra-ui/react`, `material`, `rechart` (zero imports in `src/`, confirmed by grep); remove `groq-sdk`, `cheerio` (unused in `src/` — confirm no other tooling depends on them before removing); move `puppeteer` to `devDependencies` (only used by `client/screenshot.mjs`, a standalone script outside `src/`).
- Remove `localization_queries/schemacreation/sample_admin123.sql` (seeds `admin`/`admin@example.com` with a bcrypt hash that's a well-known tutorial example) or gate it out of any setup automation.

### `survey-step-sequencing`
- **`client/src/routes/SurveyStepGuard.js:28,31`**: `const parentPath` is reassigned at line 31 — throws `TypeError: Assignment to constant variable`, silently swallowed by the `catch` at line 88. **Fix:** `let parentPath`.
- **Line 68**: `index !== currentStep` (exact equality) blocks backward navigation identically to forward-skipping — this is almost certainly the actual source of "impeded too much" (per user confirmation this guard was disabled for exactly this reason, not as a deliberate product decision to drop sequencing). **Fix:** only block forward skips, e.g. `index > currentStep`; allow `index <= currentStep` through.
- **Lines 53-56**: the backward-walk logic that finds the correct fallback step for a conditional block is commented out; the code instead just POSTs the current index as the new `currentStep`, silently accepting wherever the user landed. **Fix:** restore/fix that logic.
- **Lines 42, 63, 82**: all `navigate()` redirect calls are commented out. **Fix:** restore these only after the above three fixes land — re-enabling blind redirects on the current buggy logic is explicitly not the fix.

### `admin-auth-client-consistency`
- **`client/src/components/admin/login/ProtectedRoute.jsx`**: implements a `localStorage`-token auth check; nothing ever calls `localStorage.setItem('token', ...)`, and this component is never imported anywhere else (confirmed by grep). The real, live auth flow (`AuthContext.js`, `AdminRoutes.jsx`) correctly uses `withCredentials: true` against a server-checked `/api/auth/check`. **Fix:** delete the dead file.

## Risks / Trade-offs

- **[Risk] Fixing CORS/cookie `secure` conditionals could break local dev if `NODE_ENV` isn't set consistently** → Mitigation: verify `.env`/`.env.development` set `NODE_ENV` correctly before flipping the conditional; test a full local dev login flow after the change.
- **[Risk] Reordering middleware in `server.js` could change behavior for routes that implicitly relied on the old order** → Mitigation: this app has never been deployed, so there's no production behavior to preserve; smoke-test all route groups (client, admin, auth) after reordering.
- **[Risk] Fixing the step-guard's `index > currentStep` rule without also considering conditional/optional blocks could reintroduce false blocks for routes with `conditionalBlock`** → Mitigation: fix and test the conditional-block fallback logic (spec item 3 under `survey-step-sequencing`) in the same pass, not separately.
- **[Risk] Removing `groq-sdk`/`cheerio` could break a dev script or CI step not surfaced by a `src/`-scoped grep** → Mitigation: grep the whole `client/` tree (not just `src/`) and CI workflow files before removing, not just application source.

## Migration Plan

No production deployment exists, so there is no rollback/migration concern in the traditional sense. Suggested implementation order: backend P0 (credential exposure, middleware ordering, route authorization) → backend P1 (session/CORS/CSRF, correctness bugs) → backend P2 (dependency cleanup) → frontend P0 (step-guard fixes) → frontend P1 (dead `ProtectedRoute.jsx`) → frontend P2 (dependency cleanup). Each capability can be implemented and verified independently; there is no strict cross-capability dependency other than backend-before-frontend given the severity gap between the two audits.

## Open Questions

- `csurf`: wire it in, or remove it? Needs a decision at implementation time (see `session-and-transport-security`).
- `groq-sdk`/`cheerio` removal: confirm no dev/CI tooling outside `src/` depends on them before deleting from the manifest.
