## 1. Create centralized env config module

- [x] 1.1 Create `server/config/env.js` that calls `dotenv.config()` once with `path.resolve(__dirname, '../../.env')`
- [x] 1.2 Define `REQUIRED_VARS` array: `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, `PORT`
- [x] 1.3 Define `OPTIONAL_VARS` array: `NODE_ENV`, `FRONTEND_URL`, `BERTSENT_ENDPOINT`, `BERTOPIC_ENDPOINT`, `BERTRCLS_ENDPOINT`, `PG_MUNICIPALITIES`, `PG_LOCALIZATION`
- [x] 1.4 Implement startup validation loop that collects all missing required vars and exits with a single error message listing all of them
- [x] 1.5 Export a frozen `env` object populated from `process.env` with all required and optional variable values

## 2. Update db.js to delegate to env.js

- [x] 2.1 Remove `dotenv.config()` call and `requiredEnvVars` validation loop from `server/config/db.js`
- [x] 2.2 Import `env` from `./env.js` and replace `process.env.PG_USER`/`PG_HOST`/`PG_DATABASE`/`PG_PASSWORD`/`PG_PORT` with `env.PG_USER`/`env.PG_HOST`/`env.PG_DATABASE`/`env.PG_PASSWORD`/`env.PG_PORT`
- [x] 2.3 Replace `process.env.NODE_ENV` check with `env.NODE_ENV`

## 3. Update server.js to delegate to env.js

- [x] 3.1 Remove `dotenv.config()` call and `requiredEnvVars` validation loop from `server/server.js`
- [x] 3.2 Import `env` from `./config/env.js` and replace `process.env.FRONTEND_URL` with `env.FRONTEND_URL`
- [x] 3.3 Replace `process.env.SESSION_SECRET` with `env.SESSION_SECRET`
- [x] 3.4 Replace `process.env.NODE_ENV` checks with `env.NODE_ENV`
- [x] 3.5 Replace `process.env.PORT` with `env.PORT`

## 4. Update remaining modules to use env.js

- [x] 4.1 Update `server/controllers/authController.js`: import `env`, replace `process.env.JWT_SECRET` and `process.env.NODE_ENV` with `env.*`
- [x] 4.2 Update `server/middleware/authMiddleware.js`: import `env`, replace `process.env.JWT_SECRET` with `env.JWT_SECRET`
- [x] 4.3 Update `server/middleware/hmacMiddleware.js`: import `env`, replace `process.env.HMAC_SECRET` with `env.HMAC_SECRET`
- [x] 4.4 Update `server/utils/crypto.js`: import `env`, replace `process.env.CRYPTO_SECRET` with `env.CRYPTO_SECRET`
- [x] 4.5 Update `server/controllers/adminController.js`: import `env`, replace `process.env.BERTSENT_ENDPOINT`/`BERTOPIC_ENDPOINT`/`BERTRCLS_ENDPOINT`/`NODE_ENV`/`FRONTEND_URL` with `env.*`
- [x] 4.6 Update `server/controllers/clientController.js`: import `env`, replace `process.env.PG_MUNICIPALITIES`/`PG_LOCALIZATION` with `env.*`
- [x] 4.7 Update `server/services/clientService.js`: import `env`, replace `process.env.PG_MUNICIPALITIES`/`PG_LOCALIZATION` with `env.*`

## 5. Rewrite environment documentation

- [x] 5.1 Rewrite `.env.example` with all required vars (`PG_*`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, `PORT`) grouped by category with comments
- [x] 5.2 Add optional vars to `.env.example` (`NODE_ENV`, `FRONTEND_URL`, `BERTSENT_ENDPOINT`, `BERTOPIC_ENDPOINT`, `BERTRCLS_ENDPOINT`, `PG_MUNICIPALITIES`, `PG_LOCALIZATION`) with comments indicating they are optional
- [x] 5.3 Remove phantom vars from `.env.example` (`DB_*`, `CORS_ORIGIN`, `RATE_LIMIT_*`, `SENDGRID_API_KEY`, `HF_TOKEN_*`, `LOG_LEVEL`)
- [x] 5.4 Rewrite `.env.development` with matching variable names and development-appropriate values

## 6. Update Docker Compose files

- [x] 6.1 Update `docker-compose.yml` environment block: replace `DB_*` with `PG_*` vars, add `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`
- [x] 6.2 Update `docker-compose.prod.yml` environment block: replace `DB_*` with `PG_*` vars, add `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET` using `${VAR}` interpolation

## 7. Verify and test

- [ ] 7.1 Start server locally with `.env.development` and verify it starts without errors and connects to the DB
- [x] 7.2 Start server with a required variable missing (e.g., `JWT_SECRET` unset) and verify the error message lists the missing variable name
- [x] 7.3 Start server with multiple required variables missing and verify the error message lists all missing variable names in one message
- [x] 7.4 Verify no `process.env` reads remain in application code (excluding `node_modules`) by searching for `process.env` in `server/` directory
