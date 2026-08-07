## Why

Secret material is not separated from ordinary configuration anywhere in this repo: `docker-compose.yml` hardcodes working values for `POSTGRES_PASSWORD`, `SESSION_SECRET`, and `PGADMIN_DEFAULT_PASSWORD`; the tracked `.env.development` ships a real `SESSION_SECRET` and `DB_PASSWORD`; and the four cryptographic secrets the server depends on (`JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`) are handled exactly like `PORT` — no distinction of role, no check that they differ from each other, and no barrier to shipping the committed placeholder straight to production. Because these committed defaults *work*, a deployment can succeed end-to-end while every session cookie, admin JWT, and AES-encrypted Hugging Face token in the database is protected by a secret that is public in git history.

## What Changes

- Classify every environment variable as **secret** or **non-secret** in the central config module, so secret-specific rules (strength, distinctness, no-echo) can be enforced in one place rather than per call site.
- **BREAKING**: Remove every functioning secret literal from tracked files. `docker-compose.yml` secret and password entries become required `${VAR}` references with no fallback default; `.env.development` drops `SESSION_SECRET` and `DB_PASSWORD` entirely; `.env.example` carries only obviously non-functional placeholders. Operators who relied on `docker-compose up` working with no `.env` present must now supply values.
- Enforce **role separation** between the four secrets: the server refuses to start if any two of `JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET` share the same value. They protect different things with different blast radii and different rotation costs — `CRYPTO_SECRET` is a data-at-rest key whose rotation requires re-encrypting stored HF tokens, while `JWT_SECRET` can be rotated at will.
- Reject weak and known-placeholder secret values in production: below a minimum length, or matching a value published in this repo or its history (e.g. `docker_dev_secret_change_in_production`, `dev_session_secret_key`, `your_super_secret_session_key_change_this_in_production`), the server exits at startup instead of running with a public key.
- Keep secrets out of the browser bundle: document that `client/.env` is a build-input file whose every `REACT_APP_*` value is published to end users, and add a build-time guard that fails the client build if any `REACT_APP_*` variable name looks like secret material.
- Support file-based secret delivery (`<VAR>_FILE` pointing at a mounted file) so Docker/orchestrator secrets can be used instead of environment values, which are visible to anything that can read the container's process environment.
- Add operator documentation covering how to generate each secret, which secrets can be rotated independently, and what rotating `CRYPTO_SECRET` requires.

## Capabilities

### New Capabilities
- `secret-management`: How secret configuration is separated from ordinary configuration — where secret values may and may not live, per-secret role isolation, startup rejection of weak or publicly-known secrets, file-based secret delivery, and the client-bundle exclusion rule.

### Modified Capabilities
- `credential-logging-hygiene`: Extends the "no secret values in logs" requirement to cover configuration and startup diagnostics — validation failures, config dumps, and health/debug output must name the offending variable without echoing its value.

## Impact

- **Config files**: `docker-compose.yml`, `docker-compose.prod.yml`, `.env.development`, `.env.example`, `client/.env` documentation. `.env.development` becomes non-secret-only and stays tracked; `.env.example` becomes placeholder-only.
- **Server code**: `server/config/env.js` (the central module introduced by the `env-config-truth` change) gains secret classification, distinctness checks, strength/placeholder rejection, and `<VAR>_FILE` resolution. `server/server.js` and `server/config/db.js` read secrets from it rather than `process.env`.
- **Client build**: new guard script wired into the client build; fails on a secret-shaped `REACT_APP_*` name.
- **Operations**: **BREAKING** for anyone running `docker-compose up` without a populated `.env` — the stack will now fail fast rather than start with committed secrets. Existing deployments that used a committed default secret must rotate: rotating `SESSION_SECRET` invalidates live sessions, rotating `JWT_SECRET` invalidates issued admin tokens, and rotating `CRYPTO_SECRET` requires re-encrypting rows in `HF_TOKENS`.
- **Depends on** the `env-config-truth` change, which creates `server/config/env.js` and fixes variable naming; this change layers the secret-vs-config distinction onto that module rather than reintroducing scattered validation.
- **No API or database schema changes**; the only data-layer consequence is the `HF_TOKENS` re-encryption required by a `CRYPTO_SECRET` rotation.
