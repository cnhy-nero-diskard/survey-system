# Changelog

All notable changes to this project are documented here. The format is based
on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Root community health files: `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, this changelog.
- GitHub issue templates, pull request template, `CODEOWNERS`, and Dependabot configuration.
- Shared ESLint + Prettier configuration, `.editorconfig`, `.nvmrc`, and `.gitattributes` for `survey-system-unified/`.
- A working `npm test` at the root of `survey-system-unified/` that runs both the server and client suites.

### Fixed
- `.github/workflows/test.yml` now actually triggers (it targeted a `main`/`develop` branch this repo never had) and uses current environment variable names and file paths.
- `client/public/` (`index.html`, `favicon.ico`, `manifest.json`, etc.) was untracked in git due to a stray ignore rule — a fresh clone's frontend build would have failed outright.
- `.dockerignore` files throughout `survey-system-unified/` were untracked due to a bare filename ignore rule.
- The database schema template moved from an ignored `context/` directory to `survey-system-unified/server/db/schema/`.
- Two orphaned git submodule references (`surveymockup1/`, `surveymockup1_backend/`) with no `.gitmodules` file — removed; `survey-system-unified/` supersedes both.
- Several `catch` blocks in `server/services/analyticsCRUD.js` referenced an out-of-scope variable, throwing a `ReferenceError` and swallowing the real error on every failure.
- `server/package.json`'s test script used cmd.exe-only syntax, silently running Jest without ESM support on Linux — every server test suite failed to parse in CI.
- `client/src/AdminRoutes.jsx` routed `/systemperf` to a component that lived inside a gitignored `temp/` directory — never committed, so a fresh clone's frontend build has always failed. Moved to `client/src/components/metricsprom/`.
- CI's frontend build step failed on this codebase's pre-existing ESLint warning backlog because GitHub Actions sets `CI=true` by default, which `react-scripts` treats as "warnings are errors" — stricter than the real Docker production build. Explicitly set `CI: false` for that step to match.

### Removed
- `client/src/App.test.js`, an unmodified Create React App boilerplate test that had never passed against this application (missing dependency, and it asserted text the real app doesn't render).
- The exposed GitHub personal access token that had been embedded in the `origin` remote URL — revoked by the repository owner.
- `client/src copy/`, an untracked-until-now duplicate of part of `client/src` with a literal space in the directory name, unreferenced by any import.
- Five dummy/template SQL files under `server/localization_queries/schemacreation/backups/` — confirmed by the repository owner to contain no real data.
- The `surveymockup1/` and `surveymockup1_backend/` working directories, kept on disk temporarily after their broken submodule gitlinks were removed — deleted once confirmed unneeded.

## [1.0.0] - 2025-10-29

Initial unification of the previously separate `surveymockup1` (React
frontend) and `surveymockup1_backend` (Node.js/Express backend) into
`survey-system-unified/`, a single deployable application. This baseline
includes:

- A tourism survey platform with multilingual support, an admin dashboard,
  AI-assisted sentiment analysis and topic modeling, and a PostgreSQL-backed
  localization schema.
- Session-based anonymous survey flows alongside JWT-based admin
  authentication.
- A unified Docker deployment serving both the built React frontend and the
  Express API from one container.
- Subsequent hardening: secrets separated from committed configuration with
  startup validation, session cookie `SameSite` handling, route
  authorization review, and error-handler consistency (tracked via this
  repository's `openspec/changes/archive/`).
