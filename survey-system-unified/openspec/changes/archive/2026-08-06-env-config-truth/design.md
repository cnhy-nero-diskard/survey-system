## Context

The survey-system-unified server reads environment variables from `process.env` across multiple modules: `server/config/db.js`, `server/server.js`, `server/controllers/authController.js`, `server/controllers/adminController.js`, `server/controllers/clientController.js`, `server/middleware/authMiddleware.js`, `server/middleware/hmacMiddleware.js`, `server/services/clientService.js`, and `server/utils/crypto.js`. There is no single module that owns the list of required variables — each file independently reads what it needs, and validation is split between `db.js` (which checks `PG_*`, `JWT_SECRET`, `CRYPTO_SECRET`) and `server.js` (which only checks `PORT`).

The `.env.example` and `.env.development` files document `DB_*` database variables that no code path reads. The Docker Compose files pass `DB_*` variables into the container, so a Docker deployment will start the server but the database pool will fail because `PG_*` variables are unset. Security-critical secrets (`JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`) are either undocumented or unvalidated at startup.

The project uses ES modules (`"type": "module"` in `server/package.json`), so any new module must use `import`/`export` syntax.

## Goals / Non-Goals

**Goals:**
- Establish a single `server/config/env.js` module that loads dotenv, defines the canonical list of required and optional environment variables, validates them at startup, and exports typed accessors.
- Make `.env.example` and `.env.development` match the actual variable names the code reads.
- Update `docker-compose.yml` and `docker-compose.prod.yml` to pass the correct variables.
- Remove phantom variables (`DB_*`, `CORS_ORIGIN`, `RATE_LIMIT_*`, `SENDGRID_API_KEY`, `HF_TOKEN_*`) from documentation and Docker configs.
- Ensure the server fails fast with a single, clear error message listing all missing required variables.

**Non-Goals:**
- Changing the application's runtime behavior (rate limits, CORS logic, session config) — only the configuration layer.
- Adding new features that use the previously-undocumented variables (e.g., wiring up `LOG_LEVEL` to the logger).
- Modifying the database schema or API contracts.
- Introducing a schema-validation library (e.g., Joi, Zod) — plain JS checks suffice for env var presence.
- Supporting multiple `.env` files per environment (e.g., `.env.staging`) — the project already uses `.env` and `.env.development`.

## Decisions

### Decision 1: Single `env.js` module owns all env var definitions and validation

**Choice:** Create `server/config/env.js` that calls `dotenv.config()` once, defines a `REQUIRED_VARS` and `OPTIONAL_VARS` array, validates all required vars in a single loop, and exports a frozen `env` object with named fields.

**Rationale:** Currently `db.js` and `server.js` each call `dotenv.config()` independently (with different paths) and each validate a subset of variables. A single module eliminates the double-load, the path inconsistency, and the split validation. It also gives every other module a single import point for env values, replacing scattered `process.env.X` reads.

**Alternatives considered:**
- *Keep validation in `db.js` and `server.js`, just fix the variable lists.* Rejected because new modules would still need to know which file validates which variable, and the dotenv double-load remains.
- *Use a validation library (Joi/Zod).* Rejected as over-engineering for presence checks; the project has no existing schema-validation dependency.

### Decision 2: `env.js` exports a frozen object, not raw `process.env`

**Choice:** `env.js` exports `Object.freeze({ PG_HOST, PG_PORT, ... })` populated from `process.env` at startup.

**Rationale:** Freezing the object prevents runtime mutation of config values. Named exports make it obvious which variables exist, and IDE autocomplete works. Modules import `{ env }` and read `env.PG_HOST` instead of `process.env.PG_HOST`, making the config surface explicit.

**Alternatives considered:**
- *Export individual constants (`export const PG_HOST = process.env.PG_HOST`).* Rejected because it doesn't convey the full set of variables in one place and makes the "required" list less visible.
- *Keep using `process.env` directly everywhere.* Rejected because it provides no single source of truth and no validation.

### Decision 3: `db.js` and `server.js` delegate validation to `env.js`

**Choice:** `db.js` imports `env` from `./env.js` and uses `env.PG_USER`, `env.PG_HOST`, etc. instead of `process.env.PG_*`. It removes its own `requiredEnvVars` check and `dotenv.config()` call. `server.js` does the same — imports `env`, removes its own `requiredEnvVars` loop and `dotenv.config()` call.

**Rationale:** Validation happens once, at the top of `env.js`, before any module reads a value. If a required variable is missing, the server exits with a single error message listing all missing variables, rather than failing on the first one and leaving the operator to fix-and-restart repeatedly.

**Alternatives considered:**
- *Keep validation in `db.js` but have `env.js` just define the list.* Rejected because it reintroduces the split-validation problem.

### Decision 4: Dotenv loads from the repository root `.env`

**Choice:** `env.js` calls `dotenv.config()` with no explicit path, which defaults to `process.cwd()/.env`. Since the server is started from the `server/` directory (per `server/package.json` scripts), we resolve the path relative to the module: `path.resolve(__dirname, '../../.env')` — the same pattern `db.js` already uses.

**Rationale:** The project root `.env` is the natural location for a unified repo. `db.js` already loads from `../../.env`; `server.js` loads from the default (which is `server/.env` if cwd is `server/`, or root `.env` if cwd is root). Making `env.js` use the `__dirname`-relative path to root `.env` is consistent with the existing `db.js` approach and works regardless of where `npm start` is invoked from.

**Alternatives considered:**
- *Load from `server/.env`.* Rejected because the project root is the unified entry point and `.env.example` lives at root.
- *Support `.env.development` automatically.* Rejected — `dotenv` doesn't do environment-specific loading natively; the project uses `NODE_ENV` for environment detection, not separate dotenv files.

### Decision 5: `.env.example` is the canonical documentation; `.env.development` mirrors it with dev values

**Choice:** Rewrite `.env.example` to list every variable the code reads, grouped by category (Database, Auth/Security, Server, AI Endpoints, DB Table Names), with comments explaining each. Rewrite `.env.development` to use the same variable names with development-appropriate values.

**Rationale:** `.env.example` is what new developers copy. It must be the complete, accurate list. `.env.development` is a convenience for local dev and should not diverge in variable names.

### Decision 6: Docker Compose files pass the correct `PG_*` variables

**Choice:** Update `docker-compose.yml` and `docker-compose.prod.yml` environment blocks to pass `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, `NODE_ENV`, `PORT`, and optionally `FRONTEND_URL` and the BERT endpoints.

**Rationale:** The container must receive the variables the code reads. The current `DB_*` variables are silently ignored by the code.

## Risks / Trade-offs

- **[Breaking change for operators]** → Anyone who copied the old `DB_*` variables into their `.env` or Docker env will find the server failing to start. Mitigation: the startup error message will list the missing `PG_*` variables by name, and the migration plan below documents the rename.
- **[Secrets in Docker Compose]** → `docker-compose.yml` will contain placeholder secrets. Mitigation: use obviously-fake placeholder values (`change_me_in_production`) and document that real secrets must be injected via Docker secrets or environment variables at deploy time. `docker-compose.prod.yml` already uses `${VAR}` interpolation, which we preserve.
- **[Refactoring `process.env` reads across many files]** → Touching `db.js`, `server.js`, `authController.js`, `authMiddleware.js`, `hmacMiddleware.js`, `crypto.js`, `adminController.js`, `clientController.js`, `clientService.js` is a wide change. Mitigation: the change is mechanical (`process.env.X` → `env.X`), and each file's behavior is unchanged. Tests (if any) should still pass.
- **[Optional variables left unset]** → `BERTSENT_ENDPOINT`, `BERTOPIC_ENDPOINT`, `BERTRCLS_ENDPOINT`, `PG_MUNICIPALITIES`, `PG_LOCALIZATION` are read at runtime but may be unset in some deployments. Mitigation: `env.js` treats them as optional (not in `REQUIRED_VARS`), and the code that reads them already has fallback behavior (e.g., `adminController.js` checks `if (!process.env.BERTSENT_ENDPOINT)` before calling the AI).

## Migration Plan

1. **Create `server/config/env.js`** with the full variable list, validation, and frozen export.
2. **Update `server/config/db.js`** to import `env`, remove its own `dotenv.config()` and `requiredEnvVars` check, and use `env.PG_*` / `env.NODE_ENV`.
3. **Update `server/server.js`** to import `env`, remove its own `dotenv.config()` and `requiredEnvVars` check, and use `env.PORT` / `env.FRONTEND_URL` / `env.SESSION_SECRET` / `env.NODE_ENV`.
4. **Update remaining modules** (`authController.js`, `authMiddleware.js`, `hmacMiddleware.js`, `crypto.js`, `adminController.js`, `clientController.js`, `clientService.js`) to import `env` and use `env.X` instead of `process.env.X`.
5. **Rewrite `.env.example`** with the canonical variable list.
6. **Rewrite `.env.development`** with matching variable names and dev values.
7. **Update `docker-compose.yml`** environment block.
8. **Update `docker-compose.prod.yml`** environment block.
9. **Test:** Start the server locally with the new `.env.development` and verify it connects to the DB and starts without errors. Start with a missing required variable and verify the error message lists it.

**Rollback:** Revert all changed files. Since no DB schema or API changes are involved, rollback is a pure `git revert` with no data migration.

## Open Questions

- Should `LOG_LEVEL` be wired into the logger (it's currently in `.env.example` but the logger doesn't read it)? For now, removing it from `.env.example` since no code reads it. If the team wants log-level control, that's a separate change.
- Should `FRONTEND_URL` be required in production? Currently optional (unified deployment serves from same origin). Keeping it optional — the CORS spec already covers the fail-closed behavior.