## 1. Credential logging hygiene

- [ ] 1.1 Add `authenticate`/`authorizeAdmin` middleware to `/api/log-stream`; move its mount below session/auth setup (`server.js:59`)
- [ ] 1.2 Redact sensitive fields (password) before logging request bodies on auth endpoints (`middleware/hmacMiddleware.js:16,19`)
- [ ] 1.3 Remove/redact the Hugging Face API token log line (`services/huggingFaceService.js:5`)
- [ ] 1.4 Remove the unauthenticated `/verify-cookie` debug endpoint (`server.js:106,109`)

## 2. Security middleware pipeline

- [ ] 2.1 Move `helmet()`, rate limiter, and session/cookie setup before all `app.use('/api/...')` route mounts (`server.js`)
- [ ] 2.2 Move `errorHandler` to the end of the middleware chain, after every route is mounted (`server.js`)
- [ ] 2.3 Smoke-test client, admin, and auth route groups after reordering to confirm no behavior regressions

## 3. Route authorization

- [ ] 3.1 Add `authenticate` (+ `authorizeAdmin` where appropriate) to the unprotected admin routes (`routes/adminRoutes.js` lines 28, 30, 31, 32, 77, 80, 83)
- [ ] 3.2 Fix the IDOR: scope survey-response retrieval to the caller's own identity or require a possession token (`routes/clientRoutes.js:24`, `controllers/surveyController.js:55-65`, `services/surveyService.js:62-72`)

## 4. Session, CORS, and CSRF hardening

- [ ] 4.1 Make cookie `secure` conditional on `NODE_ENV`, set `sameSite` explicitly, and match logout-clear attributes to login-set attributes (`server.js:71`, `controllers/authController.js:34-38,63-67`)
- [ ] 4.2 Fail CORS closed instead of defaulting to `origin: true` when `FRONTEND_URL` is unset (`server.js:49-53`)
- [ ] 4.3 Decide and implement: wire `csurf` into state-changing routes, or remove the unused dependency
- [ ] 4.4 Verify local dev login flow still works after the `NODE_ENV`-conditional cookie change

## 5. Survey submission correctness

- [ ] 5.1 Fix the `ReferenceError`: import and call `createSurveyResponseService` instead of the undefined `createSurveyResponse` (`controllers/adminController.js:626`)
- [ ] 5.2 Make the sentiment-analysis batch update atomic using a dedicated `pool.connect()` client (`controllers/adminController.js:210-238`)
- [ ] 5.3 Remove the shadowed duplicate `POST /api/survey/submit` registration, keeping one contract (`routes/clientRoutes.js:23`, `routes/adminRoutes.js:22`)
- [ ] 5.4 Fix the double-response risk in the per-item batch loop (`controllers/surveyController.js:24-41`)

## 6. Dependency hygiene

- [ ] 6.1 Remove `crypto`, `cryptojs`, `expres` from `server/package.json`
- [ ] 6.2 Remove `react-query`, `@chakra-ui/react`, `material`, `rechart`, `groq-sdk`, `cheerio` from `client/package.json` (grep the whole `client/` tree, not just `src/`, before removing)
- [ ] 6.3 Move `puppeteer` to `devDependencies` in `client/package.json`
- [ ] 6.4 Remove or gate out `localization_queries/schemacreation/sample_admin123.sql` from setup automation
- [ ] 6.5 Run a full `npm install` + build after dependency changes to confirm nothing silently relied on a removed package

## 7. Survey step sequencing

- [ ] 7.1 Fix `const parentPath` reassignment bug — change to `let` (`client/src/routes/SurveyStepGuard.js:28,31`)
- [ ] 7.2 Change the strict-equality block to only block forward skips (`index > currentStep`), allowing backward navigation (`client/src/routes/SurveyStepGuard.js:68`)
- [ ] 7.3 Restore/fix the conditional-block fallback-index logic (`client/src/routes/SurveyStepGuard.js:53-56`)
- [ ] 7.4 Restore the `navigate()` redirect calls now that the underlying logic is fixed (`client/src/routes/SurveyStepGuard.js:42,63,82`)
- [ ] 7.5 Manually click through the survey to confirm forward-skip is blocked and backward navigation to a completed step is allowed

## 8. Admin auth client consistency

- [ ] 8.1 Delete the dead `ProtectedRoute.jsx` (confirmed unreferenced elsewhere) (`client/src/components/admin/login/ProtectedRoute.jsx`)
