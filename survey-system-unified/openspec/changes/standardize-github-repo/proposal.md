## Why

The repository works as a private working directory but is not shaped like a standard public GitHub project: there is no `.github/` directory at all (no CI, no issue/PR templates, no CODEOWNERS, no Dependabot), no `LICENSE` despite `package.json` declaring MIT, no `CONTRIBUTING.md`/`SECURITY.md`/`CHANGELOG.md`, no shared lint/format/editor configuration, and loose one-off notes (`SIDEBAR_BUG_FIXES.md`, `SIDEBAR_IMPROVEMENTS.md`) sitting at the repo root. Two ignore rules actively break a clean clone: `.dockerignore` and `context/` are gitignored, so `docker build` from a fresh checkout copies `node_modules` and the DB schema template is unavailable. Committed tests exist but nothing runs them automatically, so regressions land silently.

## What Changes

- Add a `.github/` directory: CI workflow (install, lint, test, build for client + server), issue templates (bug, feature), pull request template, `CODEOWNERS`, and a Dependabot config for the three npm manifests plus GitHub Actions.
- Add the community health files GitHub surfaces: `LICENSE` (MIT, matching `package.json`), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and a `CHANGELOG.md` seeded with the current release.
- Add repo-wide developer tooling config: root ESLint + Prettier configuration shared by client and server, `.editorconfig`, `.nvmrc`, `.gitattributes` (normalizes line endings — the project is developed on Windows with no `.gitattributes` today), and root `lint`/`format` npm scripts.
- Fix ignore-rule and hygiene defects: un-ignore and commit `.dockerignore`; un-ignore `context/db_template_survey.sql` so the schema template ships with the repo; stop tracking `server/surveymockup1_backend.code-workspace`; ignore `server/error.log` and `server/certs/`.
- Reorganize documentation: move root-level scratch notes and agent guidance into `docs/`, rewrite the root `README.md` with badges, project description, feature list, tech stack, setup, testing, deployment, contribution pointer, and license section; fix `server/README.md`, which still names the pre-merge project and a placeholder clone URL.
- Make the committed tests executable in CI: add a root `test` script that runs both workspaces, add `--ci`-friendly invocations, and ensure `client` tests run non-watch.
- **BREAKING** (developer workflow only): the git remote currently embeds a GitHub personal access token in its URL (`https://ghp_…@github.com/…`). Rotate that token and rewrite the remote to a credential-helper or SSH URL. No code change, but the existing token must be treated as compromised.

## Capabilities

### New Capabilities
- `repo-community-health`: License, contributing guide, code of conduct, security policy, changelog, and the metadata GitHub uses to present a project as maintained.
- `github-automation`: GitHub Actions CI pipeline, Dependabot dependency updates, issue/PR templates, and CODEOWNERS review routing.
- `developer-tooling-baseline`: Shared ESLint, Prettier, EditorConfig, Node version pin, `.gitattributes`, and the root scripts that expose them.
- `repository-hygiene`: Ignore-rule correctness, tracked-file cleanup, and secret handling for the git remote.
- `project-documentation`: Root README structure, `docs/` layout, and per-package README accuracy.

### Modified Capabilities
<!-- None. openspec/specs/ is currently empty; this change introduces the first specs alongside the in-flight phase-1-security-and-correctness change, which covers separate capabilities. -->

## Impact

- **New files**: `.github/workflows/ci.yml`, `.github/ISSUE_TEMPLATE/*`, `.github/pull_request_template.md`, `.github/CODEOWNERS`, `.github/dependabot.yml`, `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.editorconfig`, `.nvmrc`, `.gitattributes`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `docs/**`.
- **Modified files**: `.gitignore`, `README.md`, `server/README.md`, `client/README.md`, root `package.json` (lint/format/test scripts), `server/package.json` and `client/package.json` (lint scripts, CI test flags).
- **Moved/removed files**: `SIDEBAR_BUG_FIXES.md`, `SIDEBAR_IMPROVEMENTS.md`, `AI_AGENT_README.md` → `docs/`; `server/surveymockup1_backend.code-workspace` untracked.
- **New dependencies**: `eslint`, `prettier`, and the small set of plugins needed for React and Node ESM linting, as root devDependencies.
- **No runtime/application behavior changes.** No database, API, or React component logic is touched.
- **Operational**: the leaked PAT in the local git remote must be rotated by the repository owner; this change cannot do it automatically.
- **Interaction**: coexists with the in-flight `phase-1-security-and-correctness` change; CI added here will begin gating that work.
