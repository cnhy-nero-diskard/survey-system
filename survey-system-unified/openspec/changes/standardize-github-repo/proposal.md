## Why

**Correction (superseding the initial framing of this proposal):** `survey-system-unified/` is not the git repository root — it is a subdirectory of the real repo at `D:\Codez\Projects\survey-system\`. The true root already has a `.github/` directory (five workflows), an extensive root README, and a dozen planning/handoff docs. Discovering this changes what "standardize as a GitHub repo" means: the work is not greenfield creation, it is fixing what exists and filling genuine gaps, at the correct directory level.

Concretely, at the true root:
- All five workflows (`test.yml`, `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, `manual-deploy-gcp.yml`) trigger on push to `main`/`develop`, but this repository only has `master` — they have never run.
- `test.yml` additionally references the pre-move path `survey-system-unified/context/db_template_survey.sql` and the old `DB_HOST`/`DB_USER`/`DB_NAME`/`DB_PASSWORD` variable names, while the server now reads `PG_HOST`/`PG_USER`/`PG_DATABASE`/`PG_PASSWORD` plus required `JWT_SECRET`/`CRYPTO_SECRET`/`HMAC_SECRET` (see the archived `secret-separation` and `env-config-validation` specs) — it would fail even on the right branch.
- The root README links a `LICENSE` badge that 404s; no `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, or `CHANGELOG.md` exists anywhere in the repository.
- `surveymockup1/` and `surveymockup1_backend/` are tracked as git submodule gitlinks with no `.gitmodules` file — a fresh clone gets two empty, broken directories. The root README calls `survey-system-unified/` the "NEW: Unified Deployment (Recommended)" superseding both.
- The git remote authenticates with a personal access token embedded in the URL (`https://ghp_…@github.com/…`), which must be rotated.

Inside `survey-system-unified/` itself (still accurate from the original audit): no shared lint/format/editor configuration, and two ignore-rule defects — `.dockerignore` files throughout the tree were gitignored by a stray filename rule, and the DB schema template lived under a blanket-ignored `context/` directory. Both are fixed as part of this change (see Impact). Committed tests exist (`server/__tests__/`, `client/src/App.test.js`) but nothing runs them automatically.

## What Changes

- **At the true repo root** (`D:\Codez\Projects\survey-system\`):
  - Fix `.github/workflows/test.yml` in place: trigger on `master` (not the nonexistent `main`/`develop`), use current env var names (`PG_HOST`/`PG_USER`/`PG_DATABASE`/`PG_PASSWORD` plus `JWT_SECRET`/`CRYPTO_SECRET`/`HMAC_SECRET`), point at the schema template's new path, and add a lint step. `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, and `manual-deploy-gcp.yml` are deliberately **not** modified — reactivating their `main` triggers could attempt a real Docker Hub push or cloud deployment, which is an operational decision for the owner, not a repo-hygiene fix. They are flagged, not fixed.
  - Add `LICENSE` (MIT), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md` — none exist anywhere in the repo today, and the root README's LICENSE badge currently 404s.
  - Add `.github/ISSUE_TEMPLATE/*`, `.github/pull_request_template.md`, `.github/CODEOWNERS`, `.github/dependabot.yml` — genuinely new, nothing to fix here.
  - **BREAKING** (repo structure): de-register the orphaned `surveymockup1` and `surveymockup1_backend` submodule gitlinks (`git rm --cached`, no `.gitmodules` exists so `git submodule` tooling was never functional). The root README already documents `survey-system-unified/` as their replacement.
  - Update the root `README.md` in place (fix the stale `test.txt` marker-file reference, the dead LICENSE link, and branch references) rather than replace it — it is already reasonably complete.
- **Inside `survey-system-unified/`** (the original audit, still accurate):
  - Fix ignore-rule defects: the bare `.dockerignore` filename rule (removed — it hid `.dockerignore` at four levels: root, `client/`, `client/src/`, `server/`); the blanket `context/` rule that hid the DB schema template (file relocated to `server/db/schema/db_template_survey.sql`, `context/` removed since nothing else lived there).
  - Stop tracking `server/surveymockup1_backend.code-workspace`; add explicit ignores for `server/certs/` and `*.code-workspace`.
  - Add shared developer tooling: root ESLint + Prettier configuration covering both `client` and `server`, `.editorconfig`, `.nvmrc`, `.gitattributes`, and root `lint`/`format` scripts.
  - Reorganize documentation: index the existing `docs/` directory (already populated with `admin-provisioning.md` and two audit docs from prior work); move `AI_AGENT_README.md` there verbatim; trim `survey-system-unified/README.md`, `server/README.md`, and `client/README.md` to package-level READMEs that defer to the true root README instead of duplicating it.
  - Make the committed tests executable: add a root `test` script that runs both `server` and `client` suites non-interactively.
- **Not in scope**: rewriting or consolidating the true-root planning docs (`ARCHITECTURE.md`, `DEVELOPMENT.md`, `GETTING_STARTED.md`, `HANDOFF.md`, `TEAM_HANDOFF.md`, `IMPLEMENTATION_COMPLETE.md`, `INFRASTRUCTURE.md`, `REPOSITORY_STRUCTURE.md`, `TROUBLESHOOTING.md`, `VERIFICATION_CHECKLIST.md`, `CREDENTIALS.md`) — several are six months stale relative to `survey-system-unified`'s current state, but auditing and reconciling ten planning documents is a separate, content-heavy effort from "make this look like a standard GitHub repo."
- **BREAKING** (developer workflow only): the git remote currently embeds a GitHub personal access token in its URL (`https://ghp_…@github.com/…`). Rotate that token and rewrite the remote to a credential-helper or SSH URL. No code change, but the existing token must be treated as compromised. This must be done by the repository owner — it requires authenticated GitHub account access this change cannot script.

## Capabilities

### New Capabilities
- `repo-community-health`: License, contributing guide, code of conduct, security policy, changelog, and the metadata GitHub uses to present a project as maintained. Lives at the true repository root.
- `github-automation`: Fixing the existing (never-triggered) CI workflow so it actually runs and passes; adding Dependabot, issue/PR templates, and CODEOWNERS, which are genuinely new. Lives at the true repository root.
- `developer-tooling-baseline`: Shared ESLint, Prettier, EditorConfig, Node version pin, `.gitattributes`, and the root scripts that expose them. Lives inside `survey-system-unified/`, which is where the actual npm packages are.
- `repository-hygiene`: Ignore-rule correctness inside `survey-system-unified/`, tracked-file cleanup, orphaned-submodule removal at the true root, and secret handling for the git remote.
- `project-documentation`: True-root README accuracy, `survey-system-unified/`'s `docs/` layout, and per-package README accuracy (root, `survey-system-unified`, `client`, `server`).

### Modified Capabilities
<!-- None. openspec/specs/ is currently empty; this change introduces the first specs alongside the in-flight phase-1-security-and-correctness change, which covers separate capabilities. -->

## Impact

- **New files** (true root): `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.github/ISSUE_TEMPLATE/*`, `.github/pull_request_template.md`, `.github/CODEOWNERS`, `.github/dependabot.yml`.
- **New files** (`survey-system-unified/`): `.editorconfig`, `.nvmrc`, `.gitattributes`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `docs/README.md`, `server/db/schema/db_template_survey.sql` (moved from `context/`).
- **Modified files**: true-root `README.md` and `.github/workflows/test.yml`; `survey-system-unified/.gitignore`, `survey-system-unified/README.md`, `server/README.md`, `client/README.md`, `survey-system-unified/package.json` (lint/format/test scripts), `server/package.json` and `client/package.json` (lint scripts, CI test flags).
- **Moved files**: `survey-system-unified/AI_AGENT_README.md` → `survey-system-unified/docs/AI_AGENT_GUIDE.md`.
- **Removed**: the `surveymockup1` and `surveymockup1_backend` submodule gitlinks (de-registered from the index; working directories left on disk, untouched, for the owner to delete once confirmed unneeded); `survey-system-unified/server/surveymockup1_backend.code-workspace` (untracked, not deleted from disk).
- **Untouched on purpose**: `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, `manual-deploy-gcp.yml` (flagged as stale, not fixed — see What Changes); the ten true-root planning docs (flagged as stale, not reconciled).
- **New dependencies**: `eslint`, `prettier`, and the small set of plugins needed for React and Node ESM linting, as root devDependencies inside `survey-system-unified/`.
- **No runtime/application behavior changes.** No database, API, or React component logic is touched.
- **Operational**: the leaked PAT in the local git remote must be rotated by the repository owner; this change cannot do it automatically.
