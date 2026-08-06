## Why

The documented environment variables do not match what the code actually reads. `.env.example` and the Docker Compose files advertise `DB_*` database variables, but `server/config/db.js` requires `PG_*` variables. `JWT_SECRET` and `CRYPTO_SECRET` are mandatory (the app exits without them) yet appear in no example or compose file, while `HMAC_SECRET`, the BERT endpoint URLs, and the localization table names are read at runtime but completely undocumented. Following the existing docs produces a server that crashes on startup or silently misconfigures security-critical secrets.

## What Changes

- **BREAKING**: Replace `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD` with `PG_HOST`/`PG_PORT`/`PG_DATABASE`/`PG_USER`/`PG_PASSWORD` across `.env.example`, `.env.development`, `docker-compose.yml`, and `docker-compose.prod.yml` to match the variables `server/config/db.js` actually reads.
- Add `JWT_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET` to `.env.example` and both Docker Compose files as required secrets with clear placeholder values.
- Document optional runtime variables the code reads but no example lists: `BERTSENT_ENDPOINT`, `BERTOPIC_ENDPOINT`, `BERTRCLS_ENDPOINT`, `PG_MUNICIPALITIES`, `PG_LOCALIZATION`.
- Remove or correct variables that the code never reads: `CORS_ORIGIN` (code uses `FRONTEND_URL`), `RATE_LIMIT_WINDOW`/`RATE_LIMIT_MAX` (rate limiter is hardcoded), `SENDGRID_API_KEY` (no SendGrid integration exists), `HF_TOKEN_1`/`HF_TOKEN_2` (tokens are passed as API parameters, not read from env).
- Consolidate startup validation so every required variable is checked once, in one place, with a single clear error listing all missing variables — replacing the split, inconsistent checks in `server.js` (only checks `PORT`) and `db.js` (checks `PG_*` + `JWT_SECRET` + `CRYPTO_SECRET` but not `SESSION_SECRET` or `HMAC_SECRET`).
- Fix dotenv load-path inconsistency: `db.js` loads `../../.env` while `server.js` loads the default `.env`; both should resolve to the same file.

## Capabilities

### New Capabilities
- `env-config-validation`: Centralized environment variable validation, documentation, and loading — the single source of truth for what variables the application requires, what they mean, and how they are checked at startup.

### Modified Capabilities
- `session-and-transport-security`: `SESSION_SECRET` becomes a validated required variable (currently undocumented and unchecked at startup), and the CORS requirement's reliance on `FRONTEND_URL` is reflected in the canonical env documentation.

## Impact

- **Config files**: `.env.example`, `.env.development` — rewritten to match actual code usage.
- **Docker**: `docker-compose.yml`, `docker-compose.prod.yml` — environment blocks updated to pass the variables the server actually reads.
- **Server code**: `server/config/db.js` (validation delegation), `server/server.js` (validation delegation), new `server/config/env.js` module.
- **Secrets**: Operators who copied the old `DB_*` variables must rename them to `PG_*` and add `JWT_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET` — a migration note is required.
- **No API or DB schema changes**; this is configuration-layer only.