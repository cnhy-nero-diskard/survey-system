## Context

The server depends on four cryptographic secrets with genuinely different roles:

| Variable | Role | Protects | Rotation cost |
| --- | --- | --- | --- |
| `SESSION_SECRET` | Session cookie signing (`express-session`, `server/server.js`) | Anonymous survey sessions | All live sessions dropped |
| `JWT_SECRET` | Admin token signing (`authController.js`, `authMiddleware.js`) | Admin authentication | Issued admin tokens invalidated |
| `CRYPTO_SECRET` | AES key for data at rest (`server/utils/crypto.js`, used by `hfTokenService.js`) | Hugging Face API tokens stored in `HF_TOKENS` | Requires decrypt-with-old / re-encrypt-with-new migration |
| `HMAC_SECRET` | Request signature verification (`hmacMiddleware.js`, guards `POST /api/auth/register-admin`) | Admin provisioning endpoint | Callers must be re-keyed in lockstep |

Today all four are read directly from `process.env` at their point of use, with no shared handling. `server/config/db.js` checks presence for `JWT_SECRET` and `CRYPTO_SECRET` only; `SESSION_SECRET` and `HMAC_SECRET` are unchecked and fail at request time instead of startup. Meanwhile `docker-compose.yml` supplies a working `SESSION_SECRET` literal, `.env.development` supplies another, and `.env.example` a third — all in git.

The `env-config-truth` change introduces `server/config/env.js` as the single module that loads dotenv once, defines required and optional variables, validates presence, and exports a frozen object. That module is the correct and only place to add the secret-vs-config distinction, so this change extends it rather than adding a parallel validation layer.

## Goals / Non-Goals

**Goals:**
- Make it impossible to run this system on a secret that is public in the repository, in any environment.
- Give secrets a distinct handling path from ordinary config, keyed off an explicit classification rather than name-sniffing at call sites.
- Enforce that the four secrets are independent values, so one disclosure does not compromise all four.
- Move all secret material out of tracked files, and support supplying it through mounted files rather than the process environment.
- Guarantee no secret can reach the browser bundle, enforced at build time rather than by convention.
- Document generation and rotation, including the data migration that `CRYPTO_SECRET` rotation implies.

**Non-Goals:**
- Adopting an external secret manager (Vault, AWS Secrets Manager, SOPS). The `<VAR>_FILE` convention is the integration point if one is adopted later; wiring one up is out of scope.
- Purging the committed secrets from git history (`filter-repo`/BFG). The deny list neutralises them functionally, which is what this change guarantees; history rewriting is a separate coordinated operation.
- Automating secret rotation, key versioning, or dual-key rollover for `CRYPTO_SECRET`. Rotation stays a documented manual procedure.
- Re-encrypting existing `HF_TOKENS` rows. No secret changes as part of this change; re-encryption is an operator action if they choose to rotate.
- Renaming or restructuring variables, or fixing the `DB_*`/`PG_*` mismatch — that is `env-config-truth`.
- Log redaction of request bodies and tokens, already specified by `credential-logging-hygiene`; this change only extends it to config diagnostics.

## Decisions

### Classification lives in the variable definition, not in a name pattern

`server/config/env.js` defines each variable as a descriptor — name, required/optional, and a `secret: true` flag — and validation iterates the descriptors. Alternative considered: infer secrecy from the name (anything matching `/SECRET|PASSWORD|TOKEN/`). Rejected for the server because it is implicit and silently misses `PG_PASSWORD`-style names if conventions drift, and because a reader of the module cannot see the classification. Name-pattern matching *is* used for the client build guard, where the opposite trade-off applies: there is no descriptor list to consult, the set of variables is operator-supplied, and a conservative over-broad pattern that occasionally forces a rename is preferable to a miss that publishes a secret.

### Deny list of known-public values, matched exactly, enforced in every environment

The five values already in tracked files are matched by exact string comparison against the resolved secret value. Rejection applies in development too: the value's publicness does not depend on `NODE_ENV`, and allowing it in development is exactly how it survives to production. Alternative considered: warn-only in development. Rejected — the committed defaults exist *because* they were convenient in development, and a warning preserves that convenience.

Matching is exact rather than fuzzy or entropy-based. An entropy heuristic would be a stronger general defence but produces false rejections on legitimate secrets and is hard to explain in an error message; the minimum-length rule covers the low-effort cases and the deny list covers the specific known leaks.

### Minimum length 32 characters, hard-failing only in production

32 characters is the length produced by the documented generation command (`openssl rand -base64 32`, which yields 44 characters, comfortably over) and is a low bar that no deliberately generated secret fails. Production exits; non-production warns, because local dev routinely uses short throwaway values and a hard failure there would push developers back toward copying a committed default. The deny list is what keeps that leniency safe.

### Distinctness enforced pairwise across the four cryptographic secrets

Checked by grouping the four resolved values and reporting any group with more than one variable, so a single error message covers all duplication rather than surfacing one pair per restart. `PG_PASSWORD` is classified secret but excluded from the distinctness set: it is a credential for an external system rather than a key this application derives protection from, and an operator legitimately may not control its relationship to the others.

### `<VAR>_FILE` resolution before validation, with ambiguity as a hard error

Resolution happens first, so every downstream rule (presence, length, deny list, distinctness) operates on the effective value regardless of delivery mechanism. Setting both `<VAR>` and `<VAR>_FILE` exits rather than picking a precedence order: a precedence rule silently ignores half of what the operator configured, and in a secret-rotation context that is precisely the failure that leaves the old key in force. Trailing whitespace is trimmed because `docker secret` and Kubernetes-mounted files commonly carry a trailing newline that would otherwise become part of the key.

### Compose files reference variables with no fallback defaults

`SESSION_SECRET: ${SESSION_SECRET}` rather than `${SESSION_SECRET:-somedefault}`. Compose substitutes an empty string and warns for an unset variable, which the server's presence check then converts into a clear startup failure. Alternative considered: `${SESSION_SECRET:?err}`, which makes Compose itself refuse to start. That gives a faster failure but splits the error reporting across two layers with different message formats; routing everything through the server's single "missing variables" error keeps one diagnostic path. The pgAdmin service, which has no server-side validation, uses the `:?` form since it is the only available check.

### `.env.development` stays tracked but becomes non-secret-only

It is genuinely useful as shared, non-sensitive development defaults (`PORT`, `NODE_ENV`, `LOG_LEVEL`, `FRONTEND_URL`). Alternative considered: untrack it entirely. Rejected — that removes a useful shared file to solve a problem that removing two lines solves, and an untracked file provides no place to document where secrets go instead.

### Client guard is a build-time script, not a lint rule

A Node script runs before `react-scripts build` and before the dev server, scanning `process.env` plus `client/.env*` files for secret-shaped `REACT_APP_*` names. A lint rule would only catch names written in source; the exposure comes from any variable *present in the environment at build time*, whether or not source references it. The guard prints only the offending names.

## Risks / Trade-offs

- **The deny list is a blocklist and will drift** — new placeholders can be committed in future and will not be caught. → Keep the list in `env.js` next to the classification so it is visible in review, and pair it with the minimum-length rule and the "no functioning secret in tracked files" requirement, which is the actual invariant.
- **Committed secrets remain in git history even after removal** → In scope: the deny list makes them non-functional, so recovering them from history yields nothing usable. Out of scope but recommended in the migration notes: rotate any secret that was ever a committed value, and treat history rewriting as a separate task.
- **BREAKING: `docker-compose up` stops working out of the box** — the current one-command start is a real convenience and removing it will surprise people. → `.env.example` documents the exact generation command; the startup error names every missing variable at once; the migration plan below is a two-command setup step. This is the intended cost of the change.
- **Hard-failing on weak secrets in production can turn a config mistake into an outage during deploy** → The check runs at startup before the port is bound, so a rolling deploy fails the new container while the old one keeps serving. Documented as a pre-deploy check so it is caught before rollout.
- **Distinctness check requires all four secrets in memory simultaneously** — a marginal increase in exposure if the process is core-dumped. → Already true: all four are in `process.env` for the process lifetime. Values are compared, never logged, and the frozen config object omits secrets from any serialization path.
- **`<VAR>_FILE` support adds a second configuration path per secret, doubling the surface for operator confusion** → Mitigated by making the both-set case a hard error rather than a precedence rule, and by documenting `<VAR>_FILE` as the orchestrator-only path.
- **The client guard's name pattern will produce false positives** (e.g. a hypothetical `REACT_APP_TOKEN_DISPLAY_LIMIT`) → Accepted deliberately; the fix is a rename, and the asymmetry favours over-blocking. The error message states that the check is name-based.
- **Depends on `env-config-truth` landing first** — if that change is deferred, `server/config/env.js` does not exist. → Tasks are ordered so the secret work attaches to that module; if it has not landed, create the module with the descriptor shape defined here and let `env-config-truth` fill in the remaining variables.

## Migration Plan

1. Land `env-config-truth` (or create `server/config/env.js` with the descriptor shape) so there is a single module to extend.
2. Add classification, `<VAR>_FILE` resolution, distinctness, length, and deny-list checks to `env.js`, with unit tests for each rejection path.
3. Strip secret literals from `docker-compose.yml`, `docker-compose.prod.yml`, and `.env.development`; rewrite `.env.example` with non-functional placeholders and the generation command.
4. Add the client build guard and wire it into the client `prebuild`/`prestart` scripts.
5. Write the operator documentation covering generation and per-secret rotation effects.
6. Operator step at deploy time: generate four fresh distinct secrets, place them in the untracked `.env` (or as `<VAR>_FILE` mounts), and start. Any secret previously set to a committed value must be treated as disclosed and rotated — for `CRYPTO_SECRET`, decrypt `HF_TOKENS` rows with the old value and re-encrypt with the new one *before* switching, or re-enter the tokens through the admin UI afterward.

**Rollback**: the change is configuration-layer only and carries no schema or API change. Reverting the commits restores the previous behaviour. Note that rollback does not undo an operator's secret rotation — rotated `SESSION_SECRET`/`JWT_SECRET` values stay valid under the reverted code, and a rotated `CRYPTO_SECRET` must stay in place or the re-encrypted `HF_TOKENS` rows become undecryptable.

## Open Questions

- Should `PG_PASSWORD` be subject to the production minimum-length rule? It is often set by a managed database provider and not freely chosen. Current decision: apply the length rule as a warning rather than a hard failure for `PG_PASSWORD` specifically, and confirm with whoever owns the production database.
- Should the deny list also cover the pgAdmin default (`admin`) and the `POSTGRES_PASSWORD` literal (`survey_password`)? `survey_password` is included since it flows into `PG_PASSWORD`; pgAdmin is a dev-tools-profile service with no server-side validation, so it is handled only by the Compose `:?` form.
- Is the `HMAC_SECRET` shared with any external caller of `POST /api/auth/register-admin`? If so, rotating it requires coordinating with that caller, and the rotation documentation must say who. No in-repo caller computes an HMAC signature, so this appears to be an out-of-band operator tool.
