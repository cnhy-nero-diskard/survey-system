# Audit Report: Survey System Unified

**Date:** 2026-08-05
**Scope:** Verify archived Phase 1 (`openspec/changes/archive/2026-08-05-phase-1-security-and-correctness`) against actual code; document the system; surface new risks.
**Method:** Every claim cites concrete evidence (file paths, symbols, line ranges). Verified facts are distinguished from inferences and unknowns. No production code was modified during this audit.

---

## 1. System Overview (Verified)

**Stack:** Node.js 18+ / Express 4.21 (ES modules) backend + React 18 (CRA) frontend, PostgreSQL 16.10, unified Docker deployment.

**Two coexisting auth mechanisms:**

- **Admin:** JWT cookie (`token`) — `server/controllers/authController.js:40` sets it; `server/middleware/authMiddleware.js:5-24` verifies it (`jwt.verify(token, process.env.JWT_SECRET)`).
- **Anonymous survey:** express-session stored in `anonymous_session` table via `connect-pg-simple` (`server/server.js:75-78`); UUID generated server-side (`server/middleware/anonymousUserMiddleware.js:18`).

**Data model** (23 tables, `context/db_template_survey.sql`):
`admin_table`, `anonymous_session`, `anonymous_users`, `est_types`, `establishment_types`, `establishments`, `hf_tokens`, `languages`, `localization00`, `locations`, `municipalities`, `sentiment_analysis`, `survey_feedback`, `survey_questions`, `survey_responses`, `survey_versions`, `tm_contributions`, `tm_top_words`, `tm_topics`, `tourismactivities`, `tourismattraction_localizations`, `tourismattractions`, `users`.

**HF API tokens are encrypted at rest:** `server/services/hfTokenService.js:7` calls `encrypt()` before storing; `:29` calls `decrypt()` before returning. `getHFTokens` (`:19`) returns only `id, label` — never the token value.

**Admin passwords are bcrypt-hashed:** `authController.js:20` uses `bcrypt.compare` for login; `:77` uses `bcrypt.hash` for registration. Direct DB manipulation cannot produce a usable login.

### Deployment posture (resolved 2026-08-05)

- `AI_AGENT_README.md` (lines 13, 276) claimed "Production MVP — Currently serving real users with live data." **This is an obsolete declaration** (confirmed by the maintainer).
- Archived Phase 1 `proposal.md` (line 3) is correct: "The app has never been deployed, so there is no live-user risk yet and no migration constraint."
- **Implication:** Schema changes are cheap (no live data to migrate), and there is no live-user risk. The README has been corrected to reflect this.

---

## 2. Phase 1 Verification — ALL 8 TASK GROUPS VERIFIED

| Task                             | Status | Evidence                                                                                                        |
| -------------------------------- | ------ | --------------------------------------------------------------------------------------------------------------- |
| 1.1 Log-stream auth              | ✅     | `server.js:93` — `app.use('/api/log-stream', authenticate, authorizeAdmin, logstream)`                          |
| 1.2 Password redaction           | ✅     | `hmacMiddleware.js:18-20` — no raw payload logged                                                               |
| 1.3 HF token not logged          | ✅     | `huggingFaceService.js` — token only in `Authorization` header                                                  |
| 1.4 `/verify-cookie` removed     | ✅     | Not present in `server.js`                                                                                      |
| 2.1-2.2 Middleware ordering      | ✅     | `server.js:50` helmet, `:60` CORS, `:67` rate-limit, `:137` errorHandler last                                   |
| 3.1 Auth on admin routes         | ✅     | All referenced routes in `adminRoutes.js` have `authenticate`                                                   |
| 3.2 IDOR fix                     | ✅     | `surveyController.js:53-60` — session-scoped, ignores `:user_id`                                                |
| 4.1 Cookie `secure` conditional  | ✅     | `server.js:84`, `authController.js:34,62`                                                                       |
| 4.2 CORS fail-closed             | ✅     | `server.js:57` — `origin: process.env.FRONTEND_URL \|\| false`                                                  |
| 4.3 CSRF resolved                | ✅     | `csurf` absent from `server/package.json` (removed, not wired)                                                  |
| 5.1 ReferenceError fix           | ✅     | `adminController.js:631` — calls imported `createSurveyResponseService`                                         |
| 5.2 Atomic sentiment txn         | ✅     | `adminController.js:213-243` — dedicated `pool.connect()`, BEGIN/COMMIT/ROLLBACK                                |
| 5.3 Duplicate route removed      | ✅     | Single `POST /api/survey/submit` (`clientRoutes.js:23`)                                                         |
| 5.4 Double-response fix          | ✅     | `surveyController.js:30-35` — per-item errors re-thrown, single response                                        |
| 6.1-6.3 Deps cleaned             | ✅     | `crypto`/`cryptojs`/`expres`/`react-query`/`@chakra-ui/react`/`groq-sdk`/`cheerio` gone; `puppeteer` in devDeps |
| 6.4 Default admin seed removed   | ✅     | Zero `INSERT INTO admin_table` in any `.sql` file repo-wide                                                     |
| 7.1-7.4 Step guard fixed         | ✅     | `SurveyStepGuard.js:28` `let`, `:68` `index > currentStep` only, navigate calls restored                        |
| 8.1 `ProtectedRoute.jsx` deleted | ✅     | Zero references to `ProtectedRoute` in `client/src`                                                             |

**Conclusion:** Phase 1 was genuinely implemented, not just marked done.

---

## 3. New Findings (not yet spec'd)

### 🔴 Security risks

**S1. `registerAdmin` is an intentional API-only provisioning endpoint (maintainer-confirmed).**

- `server/routes/authRoutes.js:11`: `router.post('/api/auth/register-admin', verifyHMAC, registerAdmin)`.
- Searched the entire `client/src` tree: **no client code calls `/api/auth/register-admin` or computes an HMAC.**
- **Maintainer context (2026-08-05):** This is intentional — `registerAdmin` was designed as a "max security" endpoint invoked only via an external API request with the `HMAC_SECRET` token, deliberately kept out of the app UI. Direct DB manipulation won't enable login because admin passwords are bcrypt-hashed (`authController.js:20` `bcrypt.compare`, `:77` `bcrypt.hash`). The maintainer acknowledges this approach is "risque."
- **Residual risk:** The security of this endpoint depends entirely on `HMAC_SECRET` staying secret. If it leaks, anyone can mint admin accounts. `HMAC_SECRET` is also not validated at startup (see S2). Consider documenting the provisioning workflow and/or adding an additional auth factor.

**S2. `HMAC_SECRET` and `SESSION_SECRET` are not validated at startup.**

- `server/config/db.js:17` validates `['PG_USER','PG_HOST','PG_DATABASE','PG_PASSWORD','PG_PORT','JWT_SECRET','CRYPTO_SECRET']` — but NOT `HMAC_SECRET` or `SESSION_SECRET`.
- If `HMAC_SECRET` is unset, `CryptoJS.HmacSHA256(payload, undefined)` (`hmacMiddleware.js:24`) uses an empty key → `registerAdmin` is forgeable.
- If `SESSION_SECRET` is unset, express-session uses `undefined` as the signing secret.

**S3. Secret reuse: `SESSION_SECRET` and `CRYPTO_SECRET` have the same value** in the local `.env` (lines 19-20). Compromising one breaks both session integrity and token encryption. (Values redacted in this document.)

**S4. Express-session cookie lacks explicit `sameSite`** (`server.js:82-85`).

- The `session-and-transport-security` spec requires "set `sameSite` explicitly."
- The JWT cookie (admin) has `sameSite: 'lax'` (`authController.js:35`), but the anonymous session cookie does not. Incomplete fix.

**S5. Three routes lack `authenticate`** (`server/routes/adminRoutes.js`):

- `/metrics` (line 21) — exposes operational metrics.
- `/api/surveytouchpoints` (line 69) — GET, no auth.
- `/api/touchpointlocal` (line 70) — POST, no auth.
- May be intentional for the public survey flow, but violate the `route-authorization` spec unless confirmed public-facing.

**S6. Spam throttle is non-functional — confirmed scrapped by maintainer (2026-08-05).**

- `server/middleware/spamthrottle.js:27-43`: A new `rateLimit()` instance (with a fresh `MemoryStore`) is created on every request. The counter resets each time, so `max: 5` is never reached. Spam users are never actually throttled.
- **Maintainer context:** The spam throttle was scrapped during development because it "worked 1/4th of the time" and the logic couldn't be resolved. The maintainer is not completely opposed to reinstating it. The same development difficulty likely explains why `SurveyStepGuard` was disabled at the time (Phase 1 has since re-enabled and fixed the step guard — Task 7).
- **Status:** Known dead code. Either remove it or fix it (use a persistent store / single shared limiter instance).

**S7. PII logged to the admin-visible SSE log stream.**

- `surveyController.js:12-13` logs full survey payloads.
- `adminController.js:117,142` log feedback text; `:697` logs sentiment results; `:816` logs request bodies.
- The log stream (`server.js:93`) broadcasts these to authenticated admins via SSE. Privacy concern (not credentials).

### 🟠 Correctness bugs

**C1. `autoClassifyRelevanceController` is not atomic — possibly vestigial (maintainer does not recall it).**

- `adminController.js:294-302`: Same bug class Task 5.2 fixed for sentiment analysis. Relevance classification uses `pool.query` per-row with `Promise.all` and no transaction. Partial failure leaves `survey_feedback.relevance` inconsistent.
- **Maintainer context (2026-08-05):** The maintainer does not remember implementing this. It may be unfinished/vestigial code. Still a valid finding — the code exists, is reachable (`adminRoutes.js:82` `router.get('/api/admin/automateclassification', authenticate, autoClassifyRelevanceController)`), and has the non-atomic pattern. If it is vestigial, consider removing it; if it is active, make it atomic (mirror the 5.2 fix).

**C2. `anonymous_users.is_active` is unreliable** (`anonymousUserMiddleware.js:39-49`).

- Each request schedules a 60s `setTimeout` to set `is_active=FALSE`. A user active at t=0 and t=30 gets marked inactive at t=60 (the first timeout fires). Timeouts accumulate (one per request, never cleared). On server restart, pending timeouts vanish (user stuck "active"). The flag cannot be trusted.

**C3. Error handler loses all context** (`server/middleware/errorHandler.js:3`).

- `console.error(err.stack)`: (a) uses `console`, not winston; (b) when controllers call `next("string")` (~20 sites in `adminController.js`), `err.stack` is `undefined` → logged as `undefined`; (c) always returns 500, so client/validation errors get the wrong status code.

**C4. SurveyStepGuard renders content before redirecting** (`client/src/routes/SurveyStepGuard.js:103`).

- `return <StepComponent />` executes immediately while validation is async in `useEffect`. A user jumping ahead briefly sees the guarded step content before the redirect fires. The guard is a post-render redirect, not a true gate.

**C5. HuggingFace retry is unbounded** (`server/services/huggingFaceService.js:22-28`).

- A persistently-unavailable model causes infinite recursion (`queryModel` calls itself). No max-retry limit. `estimatedTime` is hardcoded to 10s, ignoring the API's estimate.

### 🟡 Hygiene / maintainability

**M1. `.env.example` is actively misleading.**

- It documents `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD`, but `db.js:35-39` reads `PG_USER`/`PG_HOST`/`PG_DATABASE`/`PG_PASSWORD`/`PG_PORT`. A new deployer following the example sets the wrong names → app crashes ("Environment variable PG_USER is not set").
- It omits `JWT_SECRET`/`HMAC_SECRET`/`CRYPTO_SECRET`/`BERTSENT_ENDPOINT`/`BERTOPIC_ENDPOINT`/`BERTRCLS_ENDPOINT`.
- It documents `RATE_LIMIT_WINDOW`/`RATE_LIMIT_MAX`/`CORS_ORIGIN` which the code ignores (hardcoded in `server.js:63-66`; reads `FRONTEND_URL` not `CORS_ORIGIN`).

**M2. Dead/unused dependencies.**

- Server: `body-parser` (imported `server.js:17`, never used — `express.json()` instead), `nodemon` (in `dependencies`, should be `devDependencies`), `path`/`events` (Node built-ins — unnecessary npm polyfills).
- Client: `helmet` (server middleware in a client app), `request` (deprecated), `style-components` (typo of `styled-components`), `poppins` (redundant with `@fontsource/poppins`), `fetch` (unneeded polyfill), three charting libraries (`chart.js`+`react-chartjs-2`, `recharts`, `plotly.js`+`react-plotly.js`).

**M3. Inconsistent logging.**

- `console.error`/`console.log` in `errorHandler.js:3`, `adminController.js` (lines 133,158,250,310,854,943,955,974,1124), `authMiddleware.js:57`, `spamthrottle.js:48`, `db.js:27,55,64`, `SurveyStepGuard.js` (8 sites). README claims "Winston for structured logging."

**M4. `next(string)` instead of `next(Error)`** (~20 sites in `adminController.js`).

- Combined with C3, most server-side errors are logged as `undefined` and returned as anonymous 500s.

**M5. Schema enum duplicates.**

- `survey_topic` enum has both `'Accommodation'` and `'ACCOMODATION'` (misspelled) plus case-variant duplicates for most values (`context/db_template_survey.sql:131-146`). `component_category` has `whereStayArrival`/`WHERESTAYARRIVAL`.

**M6. Test endpoint in production** (`adminRoutes.js:90-101`).

- `/api/admin/test` leaks `debugError` to the client (line 99). Authenticated, but shouldn't ship.

**M7. Production SSL depends on relative cert path** (`db.js:48` — `./certs/server-ca.pem`).

- Fragile; crashes if the file is absent in the working directory.

**M8. `openspec` CLI broken in default shell.**

- Default nvm Node is v12.22.12 (no optional chaining support). The CLI requires Node ≥14. Run `nvm use 18` (or similar) before `openspec` commands.

---

## 4. Unknowns (remaining)

1. **`users` table** — distinct from `anonymous_users`; not referenced in the code read during this audit. Purpose unclear.
2. **Are `/api/surveytouchpoints` and `/api/touchpointlocal` intentionally public?** Needed for the survey flow, or an oversight?
3. **Is `autoClassifyRelevanceController` (C1) active or vestigial?** Maintainer does not recall it. If vestigial, remove; if active, make atomic.

> **Resolved 2026-08-05:** Deployment posture — the app has **never been deployed** (confirmed by maintainer). The `AI_AGENT_README.md` "live production" claim was obsolete and has been corrected. Schema changes are cheap; no live-user risk.

---

## 5. Proposed next steps (incremental, OpenSpec-sized)

Each is small and independently testable. Recommended priority order:

1. **`env-config-truth`** — Fix `.env.example` to match actual var names (`PG_*`); add `JWT_SECRET`/`HMAC_SECRET`/`CRYPTO_SECRET`/`BERT*_ENDPOINT`; validate `HMAC_SECRET`/`SESSION_SECRET` at startup; remove unused `RATE_LIMIT_*`/`CORS_ORIGIN` or wire them.
2. **`register-admin-provisioning-docs`** — Document the intentional HMAC-based admin provisioning workflow (S1 is a design decision, not a bug). Optionally add a second auth factor. Ensure `HMAC_SECRET` is validated at startup (part of #1).
3. **`session-cookie-samesite`** — Set explicit `sameSite` on the express-session cookie (close S4).
4. **`public-route-audit`** — Confirm `/metrics`, `/api/surveytouchpoints`, `/api/touchpointlocal` are intentionally public or add auth.
5. **`relevance-controller-decision`** — Determine if `autoClassifyRelevanceController` (C1) is active or vestigial. If active, make it atomic (mirror the 5.2 fix). If vestigial, remove it.
6. **`error-handler-hardening`** — Use winston; handle string errors; preserve status codes; convert `next(string)` sites to `next(Error)`.
7. **`spam-throttle-decision`** — Remove the scrapped spam throttle (S6) or fix it (persistent store / single shared limiter). Maintainer is open to reinstating.
8. **`anonymous-active-flag-fix`** — Replace `setTimeout` with a `last_seen` timestamp + query-time inactivity check.
9. **`dependency-cleanup-2`** — Remove `body-parser`/`nodemon`(→dev)/`path`/`events`/`helmet`(client)/`request`/`style-components`/`poppins`/`fetch`.
10. **`hf-retry-limit`** — Cap HuggingFace retries; respect API-estimated time.
11. **`secret-separation`** — Ensure `SESSION_SECRET` ≠ `CRYPTO_SECRET` (and rotate if they were ever deployed identical).

---

_This document is an audit artifact. No production code was modified to produce it. Maintainer context was incorporated on 2026-08-05._
