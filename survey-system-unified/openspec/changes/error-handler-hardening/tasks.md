## 1. Harden the error-handling middleware

- [ ] 1.1 Import winston `logger` from `middleware/logger.js` in `server/middleware/errorHandler.js`
- [ ] 1.2 Replace `console.error(err.stack)` with `logger.error(err.message, { stack: err.stack })` — handle both Error objects and string errors (wrap strings in `new Error()`)
- [ ] 1.3 Detect HTTP status code from `err.status` or `err.statusCode`, default to 500
- [ ] 1.4 Return `{ error: err.message || "Internal Server Error" }` in the response body

## 2. Convert string errors to Error objects in adminController.js

- [ ] 2.1 Replace all `next("ERROR ON ...")` calls with `next(new Error("ERROR ON ..."))` — approximately 20 sites across CRUD handlers (localization, establishments, tourism attractions, survey responses, survey questions, sentiment analysis, touchpoints, survey feedback, locations, establishment types)
- [ ] 2.2 Replace `next("ERROR ON SENDING A RESPONSE: ...")` with `next(new Error("ERROR ON SENDING A RESPONSE: ..."))`
- [ ] 2.3 Verify no remaining `next("string")` patterns exist in the file

## 3. Replace console logging with winston in server files

- [ ] 3.1 In `server/controllers/adminController.js`: replace all `console.error` calls with `logger.error` and `console.log` calls with `logger.info` (approximately 10 sites)
- [ ] 3.2 In `server/middleware/authMiddleware.js`: replace `console.error` with `logger.error` (1 site)
- [ ] 3.3 In `server/middleware/spamthrottle.js`: replace `console.log` with `logger.warn` (1 site)
- [ ] 3.4 In `server/config/db.js`: replace `console.log` calls with `logger.info`/`logger.error` as appropriate (3 sites)

## 4. Verification

- [ ] 4.1 Start the server and trigger an error route to confirm error logs appear via winston (timestamped, colorized) instead of raw console output
- [ ] 4.2 Verify that a controller error with `err.status = 400` returns HTTP 400 instead of 500
- [ ] 4.3 Verify that `error.log` file receives error-level log entries
- [ ] 4.4 Run existing server tests (`server/__tests__/`) to confirm no regressions