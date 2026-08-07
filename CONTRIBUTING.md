# Contributing

Thanks for taking the time to contribute. This guide covers local setup,
conventions, and the pull request process for this repository.

## Repository layout

This repo contains three deployment approaches (see the root [README](README.md#-architecture)
for details). All active development happens in `survey-system-unified/`,
which contains the actual npm packages:

```
survey-system-unified/
├── client/   # React frontend (Create React App)
└── server/   # Node.js/Express backend
```

`surveymockup1/` and `surveymockup1_backend/` are legacy, superseded, and kept
on disk for reference only — don't add new work there.

## Prerequisites

- Node.js (version pinned in `survey-system-unified/.nvmrc`) and npm ≥ 8
- PostgreSQL
- Git

## Local setup

```bash
cd survey-system-unified
npm run install:all          # installs client + server dependencies
npm install                  # installs root tooling (eslint, prettier)
cp .env.example .env         # then fill in real values — see .env.example
```

Load the database schema from `survey-system-unified/server/db/schema/db_template_survey.sql`
into your local PostgreSQL instance. See the root README's configuration
section for the full list of required environment variables.

## Running

```bash
cd survey-system-unified
npm run dev            # client + server together, for local development
npm run client:build   # production frontend build
npm start               # production server (serves the built frontend)
```

## Linting, formatting, and tests

Run these from `survey-system-unified/` before opening a pull request:

```bash
npm run lint          # ESLint across client/src and server
npm run format:check  # Prettier check
npm test              # server Jest suite + client test suite
```

The lint baseline currently sits at **387 warnings** (`--max-warnings 387` in
CI) on a codebase that had no linter until this baseline was established.
Please don't add new warnings; fixing an existing one in a file you're
already touching is welcome, but isn't required to get a PR merged. Don't
raise `--max-warnings` to make CI pass — fix the warning, or ask about it in
the PR instead.

If you're on Windows and pull a change that touches `.gitattributes`, run:

```bash
git rm --cached -r survey-system-unified
git reset --hard
```

to re-normalize line endings in your working tree afterward.

The repository was reformatted with Prettier in one large, isolated commit.
Run `git config blame.ignoreRevsFile survey-system-unified/.git-blame-ignore-revs`
once (or add it to your global config) so `git blame` skips over it.

## Credentials

**Never** embed credentials in a git remote URL, and never commit a real
`.env` file, API key, or token. This repository has had a personal access
token embedded in its `origin` remote URL in the past — if you ever spot a
credential in a URL, a commit, or a log, treat it as compromised and ask the
maintainer to rotate it immediately, don't just quietly fix the URL.

## Branch naming

Use `<type>/<short-description>`, matching the commit types below, e.g.
`fix/session-cookie-expiry` or `feat/export-csv`.

## Commit messages

This repository follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary>

[optional longer body explaining why, not what]
```

Common types used in this repo's history: `feat`, `fix`, `chore`, `docs`,
`refactor`, `test`, `ci`, `style`, `spec` (OpenSpec planning artifacts).

## Pull requests

1. Branch from `master`.
2. Keep changes focused — a bug fix doesn't need an unrelated refactor along for the ride.
3. Run lint, format check, and tests locally before opening the PR.
4. Add a `CHANGELOG.md` entry under `## [Unreleased]` for any user-visible change.
5. Fill in the pull request template — it isn't optional boilerplate, the checklist catches real issues.
6. Once CI is green and review feedback (if any) is addressed, the PR can be merged.

## Reporting bugs and requesting features

Use the issue templates on GitHub. For security vulnerabilities, see
[SECURITY.md](SECURITY.md) instead of opening a public issue.
