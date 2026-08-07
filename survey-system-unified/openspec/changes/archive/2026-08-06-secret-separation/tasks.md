## 1. Prepare the central config module

- [x] 1.1 Confirm `server/config/env.js` exists (created by the `env-config-truth` change). If it does not, create it with a variable-descriptor list — `{ name, required, secret }` — that loads dotenv once and exports a frozen config object.
- [x] 1.2 Add the `secret: true` flag to the descriptors for `JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, and `PG_PASSWORD`; leave all other descriptors unflagged.
- [x] 1.3 Define the `CRYPTO_SECRETS` distinctness set (`JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`) and the `KNOWN_PUBLIC_SECRETS` deny list (`docker_dev_secret_change_in_production`, `dev_session_secret_key`, `your_super_secret_session_key_change_this_in_production`, `dev_password`, `survey_password`) as named exported constants in `env.js`, each with a comment stating where the value was committed.

## 2. Secret resolution and validation

- [x] 2.1 Implement `<VAR>_FILE` resolution for every secret descriptor: read the file, trim surrounding whitespace, and use the result as the value. Run this before any other validation.
- [x] 2.2 Exit with a clear error naming both forms when `<VAR>` and `<VAR>_FILE` are both set for the same secret.
- [x] 2.3 Exit with an error including the configured path (and no secret value) when `<VAR>_FILE` is set but the file cannot be read.
- [x] 2.4 Implement the deny-list check: exit in every environment, including development, when a secret's resolved value matches `KNOWN_PUBLIC_SECRETS` exactly; the error names the variable and states the value is publicly known.
- [x] 2.5 Implement the minimum-length check (32 characters): exit when `NODE_ENV=production`, warn and continue otherwise. Apply as a warning only for `PG_PASSWORD` per the design's open question.
- [x] 2.6 Implement the distinctness check across `CRYPTO_SECRETS`: group by resolved value and exit with a single error listing every variable in every duplicated group.
- [x] 2.7 Ensure all secret-related failures collect into one report where possible, matching the existing "list all missing variables at once" behaviour, and that no error message or warning contains a secret value.

## 3. Redaction of config diagnostics

- [x] 3.1 Add a `redactedConfig()` (or equivalent) accessor on the config module that returns the config object with every secret-classified value replaced by a fixed-length marker such as `[REDACTED]`.
- [x] 3.2 Audit `server/server.js`, `server/config/db.js`, the health endpoint, and the error handler for any path that logs or serves resolved configuration, and route each through the redacted accessor.

## 4. Route secret reads through the config module

- [x] 4.1 Replace `process.env.SESSION_SECRET` in `server/server.js` with the config module's value.
- [x] 4.2 Replace `process.env.JWT_SECRET` in `server/controllers/authController.js` (sign and verify) and `server/middleware/authMiddleware.js`.
- [x] 4.3 Replace `process.env.CRYPTO_SECRET` in `server/utils/crypto.js` — note this is read at module load, so the import order must guarantee the config module resolves first.
- [x] 4.4 Replace `process.env.HMAC_SECRET` in `server/middleware/hmacMiddleware.js` and remove its now-redundant local `dotenv.config()` call.
- [x] 4.5 Remove the `JWT_SECRET` and `CRYPTO_SECRET` presence checks from `server/config/db.js` so validation lives only in the config module.

## 5. Strip secret literals from tracked files

- [x] 5.1 In `docker-compose.yml`, replace the `POSTGRES_PASSWORD: survey_password` literal and the `survey-app` `SESSION_SECRET: docker_dev_secret_change_in_production` literal with `${VAR}` references carrying no default, and add references for `JWT_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET`.
- [x] 5.2 In `docker-compose.yml`, change `PGADMIN_DEFAULT_PASSWORD: admin` to `${PGADMIN_PASSWORD:?PGADMIN_PASSWORD is required}` since that service has no server-side validation.
- [x] 5.3 In `docker-compose.prod.yml`, confirm every secret entry is a bare `${VAR}` reference with no fallback and add references for `JWT_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET`.
- [x] 5.4 Remove `SESSION_SECRET` and the database password from `.env.development`, leaving only non-secret development defaults, and add a comment directing secrets to the untracked `.env`.
- [x] 5.5 Rewrite the secret entries in `.env.example` as obviously non-functional placeholders (e.g. `JWT_SECRET=<generate: openssl rand -base64 32>`) that the deny list and length rules would reject, and remove `your_super_secret_session_key_change_this_in_production`.
- [x] 5.6 Document the `<VAR>_FILE` alternative for each secret as a commented block in `.env.example`.
- [x] 5.7 Grep the whole tracked tree (`git grep`) for each deny-listed value to confirm none remains in any tracked file, including `README.md`, `docs/`, and `AI_AGENT_README.md`.

## 6. Client bundle guard

- [x] 6.1 Add a Node script (e.g. `client/scripts/check-no-secrets.mjs`) that scans `process.env` and every `client/.env*` file for `REACT_APP_*` names matching `/SECRET|TOKEN|PASSWORD|PRIVATE|CREDENTIAL|API_KEY/i`, exits non-zero listing the offending names, and prints no values.
- [x] 6.2 Wire the script into `client/package.json` as `prebuild` and `prestart` so both the production build and the dev server are covered.
- [x] 6.3 Verify the guard: temporarily set `REACT_APP_HMAC_SECRET` and confirm the build fails naming that variable, then confirm a clean environment with only `REACT_APP_API_HOST`, `REACT_APP_SELF_URL`, and `REACT_APP_MOCK_DATA` passes.
- [x] 6.4 Add a comment block at the top of `client/.env` and a section in the client README stating that every `REACT_APP_*` value is compiled into the published bundle and readable by end users, so secrets must never be placed there.

## 7. Tests

- [x] 7.1 Add unit tests under `server/__tests__` for each rejection path: both-forms-set, unreadable secret file, deny-listed value in development, short secret in production, short secret in development (warns, does not exit), and duplicated secrets.
- [x] 7.2 Add a test that `<VAR>_FILE` resolution trims a trailing newline and satisfies the presence check.
- [x] 7.3 Add a test that the redacted config accessor contains no secret value and reports a fixed-length marker for every secret-classified variable.
- [x] 7.4 Add a test asserting all four cryptographic secrets set to distinct 32+ character values starts cleanly, as the positive control.

## 8. Documentation

- [x] 8.1 Add a secrets section to the README (or `docs/`) with a table of the four secrets: purpose, what a compromise exposes, what rotation invalidates, and whether rotation needs a data migration.
- [x] 8.2 Document the generation command producing a value over the 32-character minimum, and state explicitly that a separate value must be generated for each secret.
- [x] 8.3 Document the `CRYPTO_SECRET` rotation procedure: `HF_TOKENS.apitoken` rows are AES-encrypted under the old value and must be decrypted with the old secret and re-encrypted with the new one, or the tokens re-entered through the admin UI; changing the secret alone renders them undecryptable.
- [x] 8.4 Add a migration note for existing deployments: any secret ever set to a committed value must be treated as disclosed and rotated, and `docker-compose up` now requires a populated `.env`.
- [x] 8.5 Resolve the design's open questions with whoever owns production — the `PG_PASSWORD` length rule and whether any external caller shares `HMAC_SECRET` — and record the answers in the rotation documentation.

## 9. Verification

- [x] 9.1 Run the server test suite and confirm all new and existing tests pass.
- [x] 9.2 Start the stack with a populated `.env` containing four distinct generated secrets and confirm admin login, an anonymous survey session, and an HF-token-backed AI endpoint all work.
- [x] 9.3 Start the stack with no `.env` and confirm it fails fast with a single error naming every missing secret and echoing no values.
- [x] 9.4 Run `openspec validate --change secret-separation` and confirm the change validates.
