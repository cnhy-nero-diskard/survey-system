## 0. Owner prerequisites (out of band, blocking)

- [ ] 0.1 Revoke the GitHub personal access token currently embedded in the `origin` remote URL (`https://ghp_…@github.com/cnhy-nero-diskard/survey-system.git`) in GitHub → Settings → Developer settings → Personal access tokens
- [ ] 0.2 Reset the remote to a token-free URL: `git remote set-url origin https://github.com/cnhy-nero-diskard/survey-system.git` (or the SSH form), and configure Git Credential Manager or an SSH key for authentication
- [ ] 0.3 Verify `git remote -v` shows no credential and that `git fetch origin` still succeeds
- [ ] 0.4 Decide and record the answers to the design's open questions: copyright holder for `LICENSE`, contact email for `SECURITY.md` and `CODE_OF_CONDUCT.md`, whether the repository will be public, and whether `server/localization_queries/schemacreation/backups/*.sql` contain production data

## 1. Repository hygiene and ignore fixes

- [ ] 1.1 Remove the `.dockerignore` line (currently `.gitignore:114`) from `.gitignore` and `git add .dockerignore` so it is tracked
- [ ] 1.2 Verify the committed `.dockerignore` excludes `node_modules/`, `client/build/`, `.env*`, `.git/`, and `openspec/`; add any missing entry
- [ ] 1.3 Grep the repository and `scripts/` for references to `context/db_template_survey.sql` and list every file that must be updated
- [ ] 1.4 `git mv`-equivalent move of `context/db_template_survey.sql` to `server/db/schema/db_template_survey.sql` (the file is currently untracked because of the `context/` rule, so add it at the new path), and update the references found in 1.3
- [ ] 1.5 Narrow the `context/` rule in `.gitignore` so the remaining scratch directory stays ignored but no build-critical file is hidden
- [ ] 1.6 `git rm --cached server/surveymockup1_backend.code-workspace` and add `*.code-workspace` to `.gitignore`
- [ ] 1.7 Add explicit `server/error.log` and `server/certs/` entries to `.gitignore` in place of relying on the incidental `*.log` and `*.pem` globs
- [ ] 1.8 Add a header comment to the tracked `.env.development` stating that `SESSION_SECRET` and `DB_PASSWORD` there are non-secret local-only defaults that must never be used in a deployed environment
- [ ] 1.9 Run `git status --ignored` and confirm every ignored path is generated output, a local secret, an editor file, or an OS file — record any exception
- [ ] 1.10 Verify a clean clone builds: clone to a temp directory and run `docker build .`, confirming the build context does not include `node_modules`
- [ ] 1.11 Commit as `chore: fix ignore rules and untrack local-only files`

## 2. Community health files

- [ ] 2.1 Add `LICENSE` with the MIT License text using the copyright holder and year decided in 0.4
- [ ] 2.2 Update the root `package.json` `author` field if 0.4 changed it from "Survey System Team"
- [ ] 2.3 Add `CONTRIBUTING.md` covering prerequisites, install, `.env` setup, running dev, running lint and tests, the branch naming scheme, the Conventional Commits format already used in this repo's history, and the pull request process
- [ ] 2.4 Add to `CONTRIBUTING.md` an explicit statement that credentials must never be embedded in remote URLs or committed
- [ ] 2.5 Add to `CONTRIBUTING.md` the current lint warning count and the intent to drive it to zero, plus the one-time `.gitattributes` renormalization refresh steps for Windows contributors
- [ ] 2.6 Add `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) with the real contact address from 0.4 — no `[INSERT CONTACT METHOD]` placeholder
- [ ] 2.7 Add `SECURITY.md` with supported versions, a private reporting channel, an explicit "do not open a public issue" instruction, and a target acknowledgement window
- [ ] 2.8 Add `CHANGELOG.md` in Keep a Changelog format with an `## [Unreleased]` section and a `## [1.0.0]` entry summarizing the current state
- [ ] 2.9 Commit as `docs: add license and community health files`

## 3. Documentation reorganization

- [ ] 3.1 Create `docs/` and `git mv AI_AGENT_README.md docs/AI_AGENT_GUIDE.md` with its content preserved byte-for-byte
- [ ] 3.2 `git mv SIDEBAR_BUG_FIXES.md` and `git mv SIDEBAR_IMPROVEMENTS.md` into `docs/`
- [ ] 3.3 Add `docs/README.md` indexing each document with a one-line description
- [ ] 3.4 Rewrite the root `README.md`: title, one-line description, badge row (CI status, MIT license, Node version), features, tech stack, prerequisites, installation, configuration, running, testing, project structure, deployment, contributing, license
- [ ] 3.5 Add a configuration table to the README listing every variable in `.env.example` with purpose, required/optional, and default
- [ ] 3.6 Document in the README how to load `server/db/schema/db_template_survey.sql` into PostgreSQL, and how an operator supplies `server/certs/` material at deploy time
- [ ] 3.7 Link `docs/AI_AGENT_GUIDE.md` prominently from the root README, noting it records the project's production-data and API-contract constraints
- [ ] 3.8 Rewrite `server/README.md` to describe this package — remove the `surveymockup1_backend` name and the `yourusername` placeholder clone URL — and link back to the root README for setup
- [ ] 3.9 Rewrite `client/README.md` to describe this client instead of CRA boilerplate, linking back to the root README
- [ ] 3.10 Verify every npm script and file path referenced in the README actually exists
- [ ] 3.11 Confirm the repository root now contains only `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and `CHANGELOG.md` as Markdown files
- [ ] 3.12 Commit as `docs: reorganize documentation into docs/ and rewrite READMEs`

## 4. Developer tooling baseline

- [ ] 4.1 Add `.nvmrc` pinning a Node major that satisfies `engines.node >= 18.0.0`
- [ ] 4.2 Add `.editorconfig` setting charset, indentation, final newline, and trailing-whitespace behavior
- [ ] 4.3 Add `.gitattributes`: `* text=auto eol=lf`, `*.sh text eol=lf`, `*.bat text eol=crlf`, and binary markers for images, `*.pem`, and `*.crt`
- [ ] 4.4 Run `git add --renormalize .` and commit the line-ending normalization together with `.gitattributes`
- [ ] 4.5 Add root devDependencies: `eslint`, `prettier`, `eslint-config-prettier`, and the React/React Hooks plugins needed for `client/src`
- [ ] 4.6 Add root `eslint.config.js` with a `server/**` block (ESM `sourceType`, Node globals) and a `client/src/**` block (browser globals, JSX, React + React Hooks), `eslint-config-prettier` last, ignoring `**/node_modules/**`, `client/build/**`, `server/localization_queries/**`, and `context/**`
- [ ] 4.7 Confirm the root React rules do not contradict the `eslintConfig: { extends: ["react-app"] }` block still present in `client/package.json`
- [ ] 4.8 Add `.prettierrc` and `.prettierignore` (mirror the ESLint ignores plus lockfiles)
- [ ] 4.9 Add root scripts: `lint`, `lint:fix`, `format`, `format:check`
- [ ] 4.10 Run `npm run lint` and record the resulting error and warning counts
- [ ] 4.11 Fix all ESLint **errors** (real defects such as undefined variables); leave warnings for later
- [ ] 4.12 Set unused-vars and exhaustive-deps to `warn`, and note the final warning count for the CI `--max-warnings` ratchet
- [ ] 4.13 Verify `npm run client:build` still succeeds — confirming root ESLint 9 does not interfere with the ESLint 8 that `react-scripts` resolves internally; if it does, fall back to a legacy `.eslintrc` at the root pinned to ESLint 8
- [ ] 4.14 Commit as `chore: add shared lint, format, and editor configuration`

## 5. Test wiring

- [ ] 5.1 Run `cd server && npm test` locally with PostgreSQL stopped and record the result
- [ ] 5.2 If `server/__tests__/routes/surveyRoutes.test.js` requires a live database, mock the `pg` pool so the suite runs without one — do not add a Postgres service container
- [ ] 5.3 Run `cd client && npm test -- --watchAll=false` and record the result
- [ ] 5.4 If `client/src/App.test.js` is unmodified CRA boilerplate that fails against the real app, fix it or delete it — do not wire a known-red suite into CI
- [ ] 5.5 Replace the root `test` script so it runs both the server and client suites non-interactively and exits non-zero if either fails
- [ ] 5.6 Verify `npm test` at the root passes end to end
- [ ] 5.7 Commit as `test: wire server and client suites into a root test script`

## 6. Formatting pass (isolated commit)

- [ ] 6.1 Confirm the `phase-1-security-and-correctness` work is either merged or paused, so the format pass does not collide with it
- [ ] 6.2 Run `npm run format` across the tree
- [ ] 6.3 Verify `npm run lint`, `npm test`, and `npm run client:build` all still pass after reformatting
- [ ] 6.4 Commit the formatting pass alone as `style: apply prettier formatting across the repository` — no other change in this commit
- [ ] 6.5 Add `.git-blame-ignore-revs` containing that commit's SHA, and reference it in `CONTRIBUTING.md`

## 7. GitHub automation

- [ ] 7.1 Create `.github/workflows/ci.yml` triggered on `push` to `master` and on `pull_request`
- [ ] 7.2 Add the `lint` job: `actions/setup-node` with `node-version-file: .nvmrc` and `cache: npm`, root install, `npm run lint` with the `--max-warnings` ratchet from 4.12, then `npm run format:check`
- [ ] 7.3 Add the `test` job: install root, server, and client dependencies, run both suites with `CI=true`
- [ ] 7.4 Add the `build` job: install client dependencies and run `npm run client:build`
- [ ] 7.5 Add a Gitleaks secret-scanning step and a `.gitleaks.toml` allowlisting `.env.example` and `.env.development`
- [ ] 7.6 Confirm no job references a repository secret, so CI passes on forked pull requests
- [ ] 7.7 Create `.github/dependabot.yml` with weekly `npm` entries for `/`, `/client`, and `/server`, a weekly `github-actions` entry for `/`, `open-pull-requests-limit: 5` per entry, and grouped patch/minor updates
- [ ] 7.8 Create `.github/ISSUE_TEMPLATE/bug_report.yml` prompting for expected behavior, actual behavior, reproduction steps, and environment (OS, Node version, browser, deployment mode)
- [ ] 7.9 Create `.github/ISSUE_TEMPLATE/feature_request.yml`
- [ ] 7.10 Create `.github/ISSUE_TEMPLATE/config.yml` disabling blank issues and adding a contact link that routes security reports to the `SECURITY.md` process
- [ ] 7.11 Create `.github/pull_request_template.md` with summary, linked issue, change type, testing performed, and a checklist covering lint/tests passing, `CHANGELOG.md` updated, and no secrets in the diff
- [ ] 7.12 Create `.github/CODEOWNERS` with a default owner plus explicit owners for `.github/`, `server/config/`, and `server/middleware/`
- [ ] 7.13 Commit as `ci: add GitHub Actions workflow, dependabot, and repository templates`

## 8. Verification

- [ ] 8.1 Push the branch and confirm all three CI jobs run and pass on the pull request
- [ ] 8.2 Deliberately break a server test on a scratch branch and confirm CI reports a failed check, then revert
- [ ] 8.3 Deliberately add a fake credential string on a scratch branch and confirm the Gitleaks step fails, then revert
- [ ] 8.4 Open a test issue and a test pull request and confirm the templates render
- [ ] 8.5 Check GitHub → Insights → Community Standards and confirm every item is satisfied
- [ ] 8.6 Clone the repository to a fresh directory and follow the README from scratch to a running dev environment, correcting any gap found
- [ ] 8.7 Confirm the README badges resolve to the real CI workflow, license, and Node version
- [ ] 8.8 Run a one-off Gitleaks scan over full git history and report any historical credential to the owner
- [ ] 8.9 Recommend to the owner that branch protection on `master` require the new CI checks
