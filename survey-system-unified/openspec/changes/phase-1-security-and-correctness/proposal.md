## Why

An initial audit of `server/` and `client/src/` found a live, unauthenticated credential-exfiltration channel (an admin log stream with no auth, broadcasting plaintext passwords/API tokens/JWTs), several unauthenticated admin/data routes including an IDOR on survey responses, security middleware (helmet, rate limiting) that is mounted after routes and therefore never runs, and a handful of correctness bugs that are already broken today (a `ReferenceError` on a live admin route, a fake DB transaction, a disabled survey step-sequencing guard). The app has never been deployed, so there is no live-user risk yet and no migration constraint — this is the cheapest point at which to fix all of it. Nothing further (test harness, cleanup, architecture work) should build on top of a codebase with these issues open.

## What Changes

- Require authentication on the admin log-stream endpoint and strip plaintext secrets (passwords, API tokens, JWTs) from all logging.
- Reorder Express middleware so `helmet()`, rate limiting, and the error handler actually apply to API/admin/auth routes.
- Add authentication (and authorization where needed) to admin/data routes that currently have none; fix the IDOR on survey-response retrieval.
- Harden session cookies (conditional `secure`, explicit `sameSite`, matching set/clear attributes), fail CORS closed instead of defaulting to any-origin, and resolve the installed-but-unused `csurf` dependency (wire it in or remove it).
- Fix a live `ReferenceError` on `POST /api/admin/survey-responses`, make the sentiment-analysis "transaction" actually atomic, remove a shadowed duplicate route registration, and stop a possible double-response in survey submission.
- Remove dead/confusing dependencies: `crypto`, `cryptojs`, `expres` (backend); `react-query`, `@chakra-ui/react`, `material`, `rechart`, `groq-sdk`, `cheerio` (frontend, unused); move `puppeteer` to devDependencies. Remove the committed default-admin seed SQL.
- Fix the survey step-sequencing guard: it isn't just disabled, it has a `const` reassignment bug and an overly strict equality check that blocks legitimate backward navigation — both need fixing before the guard is re-enabled.
- Remove a dead, insecure `ProtectedRoute.jsx` that implements an auth pattern (`localStorage` token) the app doesn't actually use anywhere.

## Capabilities

### New Capabilities
- `credential-logging-hygiene`: no endpoint or log line ever exposes a password, API token, or session/JWT value to an unauthenticated caller.
- `security-middleware-pipeline`: security-relevant middleware (helmet, rate limiting, error handling) actually executes on every request it's meant to protect.
- `route-authorization`: every admin/data-mutating and user-scoped route enforces the correct auth check, with no IDOR on user-scoped data.
- `session-and-transport-security`: cookies, CORS, and CSRF protection are configured to fail closed rather than permissively.
- `survey-submission-correctness`: survey/admin data-mutation endpoints behave correctly — no broken references, no fake transactions, no ambiguous duplicate routes, no double-responses.
- `dependency-hygiene`: package manifests contain only dependencies that are actually used, correctly scoped (prod vs dev).
- `survey-step-sequencing`: the frontend step guard correctly blocks forward-skipping while allowing backward navigation, without throwing on its own logic.
- `admin-auth-client-consistency`: the frontend contains exactly one auth-gating pattern (the cookie-based one actually in use), with no dead/contradictory implementations.

### Modified Capabilities
_(none — this is the first change in this repo; no existing specs to modify)_

## Impact

- **Backend**: `server.js`, `middleware/hmacMiddleware.js`, `middleware/authMiddleware.js`, `services/huggingFaceService.js`, `routes/adminRoutes.js`, `routes/clientRoutes.js`, `controllers/adminController.js`, `controllers/authController.js`, `controllers/surveyController.js`, `services/surveyService.js`, `package.json`, `localization_queries/schemacreation/sample_admin123.sql`.
- **Frontend**: `client/src/routes/SurveyStepGuard.js`, `client/src/components/admin/login/ProtectedRoute.jsx`, `client/package.json`.
- **No schema/API contract changes for legitimate clients** — these are hardening and bug fixes, not feature changes. Removing the shadowed duplicate `/api/survey/submit` registration is the one place a caller relying on the currently-dead registration's contract would need to switch (unlikely, since it's unreachable today).
- **Dependencies**: several packages removed from `package.json`/`client/package.json`; `puppeteer` reclassified as a dev dependency.
