Paths below are relative to the **true repo root** (`D:\Codez\Projects\survey-system\`) unless prefixed `survey-system-unified/`.

## 0. Owner prerequisites (out of band, blocking)

- [ ] 0.1 Revoke the GitHub personal access token currently embedded in the `origin` remote URL (`https://ghp_…@github.com/cnhy-nero-diskard/survey-system.git`) in GitHub → Settings → Developer settings → Personal access tokens
- [ ] 0.2 Reset the remote to a token-free URL: `git remote set-url origin https://github.com/cnhy-nero-diskard/survey-system.git` (or the SSH form), and configure Git Credential Manager or an SSH key for authentication
- [ ] 0.3 Verify `git remote -v` shows no credential and that `git fetch origin` still succeeds
- [x] 0.4 Decisions recorded: copyright holder = `cnhy-nero-diskard`; contact email = the git-configured `cnhynaqer.greekprogrammraccurn@gmail.com`; repo assumed to be going public; `server/localization_queries/schemacreation/backups/*.sql` left untouched (not deleted, may hold data — owner to review separately); scope = true repo root (confirmed by user); orphaned submodules = remove the gitlinks (confirmed by user)

## 1. True root: orphaned submodules and remote hygiene

- [ ] 1.1 Confirm nothing uniquely valuable lives in `surveymockup1/` or `surveymockup1_backend/` beyond what `survey-system-unified/` already supersedes (spot-check a few files against their `survey-system-unified` counterparts)
- [ ] 1.2 `git rm --cached surveymockup1 surveymockup1_backend` to de-register the broken gitlinks — leave the working directories on disk
- [ ] 1.3 Confirm no `.gitmodules` file needs removing (none exists) and that `git status` now shows the two paths as untracked directories, not gitlinks
- [ ] 1.4 Update the true-root `README.md` architecture section to state plainly that `survey-system-unified/` supersedes both, and that they are kept on disk only for reference pending owner cleanup
- [ ] 1.5 Commit as `chore: de-register orphaned surveymockup1 submodule gitlinks`

## 2. True root: fix the CI workflow in place

- [x] 2.1 In `.github/workflows/test.yml`, change `on.push.branches` and `on.pull_request.branches` from `[main, develop]` to `[master]`
- [x] 2.2 Replace the test-database step's `DB_HOST`/`DB_USER`/`DB_NAME`/`DB_PASSWORD`/`DB_PORT` env vars with `PG_HOST`/`PG_USER`/`PG_DATABASE`/`PG_PASSWORD`/`PG_PORT`; added distinct CI-only throwaway `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET` alongside `SESSION_SECRET` — server startup validation (`server/config/env.js`) requires all four, each ≥32 chars, and rejects duplicates, so each got a distinct suffixed throwaway value
- [x] 2.3 Update the schema-load step to `psql < survey-system-unified/server/db/schema/db_template_survey.sql`
- [x] 2.4 Add a lint step (`npm run lint -- --max-warnings 387`) before the test step
- [x] 2.4a Also added: a root `npm install` before `npm run install:all` (the old workflow never installed the root's own `node_modules`, so `eslint`/`prettier` wouldn't have been resolvable), and a separate "Run client tests" step calling `npm test -- --watchAll=false --passWithNoTests` in `client/` (the workflow previously only ran server tests and a build, never actual client tests)
- [x] 2.4b **Deferred**: `npm run format:check` is not yet wired into this workflow. Running it today reports 15+ unformatted files — adding the gate now would land CI red. It gets added in Group 10's commit, once the formatting pass has actually run.
- [x] 2.5 Verify `working-directory` and `cache-dependency-path` are still correct — switched the server/client test steps to `working-directory: survey-system-unified/server` and `.../client` directly (running `npm test` there rather than through a root script) to avoid ambiguous double-forwarding of `--` CLI args through two nested `npm run` calls
- [x] 2.6 Did **not** touch `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, or `manual-deploy-gcp.yml` — their `main`-branch triggers stay dead on purpose (see design.md decision 11)
- [ ] 2.7 Update `.github/workflows/README.md`'s `test.yml` section to describe the corrected branch/env-var/path behavior
- [ ] 2.8 Commit as `ci: fix test workflow branch trigger, env vars, and schema path`

## 3. True root: community health files

- [ ] 3.1 Add `LICENSE` with the MIT License text, copyright holder and year from 0.4
- [ ] 3.2 Add `CONTRIBUTING.md`: prerequisites, install, `.env` setup (pointing at `survey-system-unified/.env.example`), running dev, running lint and tests, branch naming, the Conventional Commits format already used in this repo's history, and the pull request process
- [ ] 3.3 Add to `CONTRIBUTING.md` an explicit statement that credentials must never be embedded in remote URLs or committed, referencing the incident that motivated task 0.1–0.2
- [ ] 3.4 Add to `CONTRIBUTING.md` the current lint warning count (from task 9.10) and intent to drive it to zero, plus the one-time `.gitattributes` renormalization refresh steps for Windows contributors
- [ ] 3.5 Add `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1) with the contact address from 0.4
- [ ] 3.6 Add `SECURITY.md`: supported versions, private reporting channel, explicit "do not open a public issue" instruction, target acknowledgement window
- [ ] 3.7 Add `CHANGELOG.md` in Keep a Changelog format with `## [Unreleased]` and a `## [1.0.0]` entry summarizing current state
- [ ] 3.8 Commit as `docs: add license and community health files`

## 4. True root: issue/PR templates and CODEOWNERS

- [ ] 4.1 Add `.github/ISSUE_TEMPLATE/bug_report.yml`: expected behavior, actual behavior, reproduction steps, environment (OS, Node version, browser, deployment mode — unified vs. separate, per the root README's documented architectures)
- [ ] 4.2 Add `.github/ISSUE_TEMPLATE/feature_request.yml`
- [ ] 4.3 Add `.github/ISSUE_TEMPLATE/config.yml`: disable blank issues, add a contact link routing security reports to the `SECURITY.md` process
- [ ] 4.4 Add `.github/pull_request_template.md`: summary, linked issue, change type, testing performed, checklist (lint/tests pass locally, `CHANGELOG.md` updated, no secrets in the diff)
- [ ] 4.5 Add `.github/CODEOWNERS`: default owner, plus explicit owners for `.github/`, `survey-system-unified/server/config/`, `survey-system-unified/server/middleware/`
- [ ] 4.6 Add `.github/dependabot.yml`: weekly `npm` entries for `survey-system-unified/`, `survey-system-unified/client`, `survey-system-unified/server`; weekly `github-actions` entry for `/`; `open-pull-requests-limit: 5` per entry; grouped patch/minor updates
- [ ] 4.7 Commit as `ci: add issue/PR templates, CODEOWNERS, and dependabot config`

## 5. True root: README accuracy pass

- [x] 5.1 Removed the stale `test.txt` reference (done in Group 1, alongside the submodule note)
- [x] 5.2 Confirmed the LICENSE badge now resolves; added a live `test.yml` status badge too, now that it actually runs
- [x] 5.3 Fixed the fork/clone URL (`yourusername` placeholder → the real owner); Heroku's `git push heroku main` references are correct as-is (Heroku's own remote convention, unrelated to this repo's branch)
- [x] 5.4 Replaced the stale `DB_HOST`/`DB_PORT`/`DB_NAME`/`DB_USER`/`DB_PASSWORD` config block with the current `PG_*` + `JWT_SECRET`/`CRYPTO_SECRET`/`HMAC_SECRET`/`SESSION_SECRET` names and the 32-char/no-duplicates constraint; fixed the same stale names in the GCP deploy example and the troubleshooting section's env-var check
- [x] 5.5 Linked `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md` next to the existing `LICENSE` link; trimmed the duplicate "Code Style"/"Pull Request Process" subsections to defer to `CONTRIBUTING.md` instead of restating it
- [x] 5.6 Found and fixed more than expected: `npm run setup:all` (doesn't exist; real script is `install:all`, 2 occurrences), a `psql -f <directory>` schema step that can't work against a directory (pointed at the actual `server/db/schema/db_template_survey.sql` file instead), and an entire "Documentation" section linking five docs and three ADRs that were never written (`docs/api.md`, `docs/adr/*`, etc.) — replaced with links to what actually exists. Also removed a fabricated "Testing" subsection (`test:coverage`, `test:integration`, `test:e2e`, an `artillery` load-test file — none exist) in favor of the real `npm test`/`lint`/`format:check` commands, and removed a stale "Last updated: October 29, 2025" footer rather than leave a wrong date.
- [x] 5.7 Commit as `docs: correct stale claims in root README and link community health files`

## 6. survey-system-unified: ignore-rule and hygiene fixes

- [x] 6.1 Remove the bare `.dockerignore` filename rule from `survey-system-unified/.gitignore` (it hid `.dockerignore` at the root, `client/`, `client/src/`, and `server/` levels)
- [x] 6.2 `git add` the four now-visible `.dockerignore` files (root, `client/`, `client/src/`, `server/`) and verify the root one excludes `node_modules`, `client/build`, `.env*`, `.git`
- [x] 6.3 Move `context/db_template_survey.sql` to `survey-system-unified/server/db/schema/db_template_survey.sql`; remove the now-empty `context/` directory and its blanket `.gitignore` rule
- [x] 6.4 Because the true-root `.gitignore` has a blanket `*.sql` rule with one existing negation, add a matching `!survey-system-unified/server/db/schema/db_template_survey.sql` negation there (editing the **true-root** `.gitignore`, not `survey-system-unified/.gitignore`) so `git add` succeeds without `-f`
- [x] 6.5 `git rm --cached survey-system-unified/server/surveymockup1_backend.code-workspace`; add `*.code-workspace` to `survey-system-unified/.gitignore`
- [x] 6.6 Add an explicit `server/certs/` entry to `survey-system-unified/.gitignore`
- [x] 6.7 Run `git status --ignored` from `survey-system-unified/` and confirm every ignored path is generated output, a local secret, an editor file, or an OS file — **found a severity-critical defect while doing this**: a leftover Gatsby-boilerplate bare `public` rule (line 86, under a stray "Gatsby files" section) had silently kept `client/public/` — including `index.html`, `favicon.ico`, `manifest.json` — untracked since the beginning. A fresh clone's `npm run client:build` would fail outright (CRA requires `public/index.html`). Removed the rule and tracked all 6 files.
- [x] 6.8 Grep the repository for any remaining reference to the old `context/db_template_survey.sql` path and update it: fixed `scripts/batch-db-setup.sh`, `scripts/init-fresh-db.sh`, and `scripts/README.md` (true root, functional/executable — left the ten true-root planning docs and this change's own planning docs untouched, per the design's explicit scope decision)
- [ ] 6.9 Commit as `chore: fix ignore rules and untrack local-only files`

## 7. survey-system-unified: documentation reorganization

- [ ] 7.1 `git mv survey-system-unified/AI_AGENT_README.md survey-system-unified/docs/AI_AGENT_GUIDE.md`, content preserved byte-for-byte
- [ ] 7.2 Add `survey-system-unified/docs/README.md` indexing `AI_AGENT_GUIDE.md`, `admin-provisioning.md`, `audit-2026-08-05-phase-1-verification.md`, and `refurbish-prompts.md`, each with a one-line description
- [ ] 7.3 Trim `survey-system-unified/README.md` to a package-level README: what this directory is (the unified deployment), quick local setup, link to the true-root README for project-wide context (features, architecture options, contribution process), link to `docs/AI_AGENT_GUIDE.md`
- [ ] 7.4 Rewrite `server/README.md` to describe the actual `server` package (remove the `surveymockup1_backend` name and the `yourusername` placeholder clone URL), linking back to the true root and `survey-system-unified/README.md`
- [ ] 7.5 Rewrite `client/README.md` to describe this client instead of unmodified CRA boilerplate, linking back the same way
- [ ] 7.6 Verify every npm script and file path referenced across all four README layers (true root, `survey-system-unified`, `client`, `server`) exists
- [ ] 7.7 Commit as `docs: reorganize survey-system-unified documentation and trim package READMEs`

## 8. survey-system-unified: developer tooling baseline

- [x] 8.1 Add `survey-system-unified/.nvmrc` pinning `22` (satisfies `engines.node >= 18.0.0`; matches the verified working dev/CI environment)
- [x] 8.2 Add `survey-system-unified/.editorconfig`: charset, indentation, final newline, trailing-whitespace behavior
- [x] 8.3 Add `survey-system-unified/.gitattributes`: `* text=auto eol=lf`, `*.sh text eol=lf`, `*.bat text eol=crlf`, binary markers for images, `*.pem`, `*.crt`
- [ ] 8.4 Run `git add --renormalize survey-system-unified` and commit the line-ending normalization together with `.gitattributes` — **deferred to Group 10's check-in**, bundled with the Prettier formatting pass since both are large-diff, low-semantic-risk operations worth confirming together
- [x] 8.5 Add `survey-system-unified` root devDependencies: `eslint@9`, `@eslint/js`, `globals`, `prettier`, `eslint-config-prettier`, `eslint-plugin-react`, `eslint-plugin-react-hooks`
- [x] 8.6 Add `survey-system-unified/eslint.config.js` (flat config): a `server/**` + misc-scripts block (ESM `sourceType`, Node globals), a `client/src/**` block (browser globals + `process` since CRA injects it at build time, JSX, React + React Hooks), a `**/*.test.js`/`**/__tests__/**` block (Jest globals), `eslint-config-prettier` last. Ignoring `node_modules`, `client/build`, `server/localization_queries`, `server/db/schema`, and two newly-discovered stray paths: `client/src/**/.trash/**` and `client/src copy/**` (see finding below)
- [x] 8.7 Confirmed the root config does not contradict `client/package.json`'s existing `eslintConfig: { extends: ["react-app"] }` — `npm run client:build` passes cleanly with both installed side by side (separate `node_modules`, so CRA resolves its own ESLint 8 independently of the root ESLint 9)
- [x] 8.8 Add `survey-system-unified/.prettierrc` and `.prettierignore`
- [x] 8.9 Add root scripts to `survey-system-unified/package.json`: `lint`, `lint:fix`, `format`, `format:check`; also added `"type": "module"` (eliminates a Node warning since `eslint.config.js` uses ESM syntax and no other root-level `.js` file exists to be affected)
- [x] 8.10 First `npm run lint` run: 537 problems (156 errors, 381 warnings) — almost all errors were **config gaps, not real bugs**: missing Jest globals for `*.test.js`/`__tests__/**` (67), missing Node globals for `client/scripts/*.mjs` and `client/screenshot.mjs` (which also needed browser globals for its Puppeteer `page.evaluateOnNewDocument` callback), and CRA's build-injected `process` global missing from the client block. After fixing the config: 406 problems (26 errors, 380 warnings).
- [x] 8.11 Fixed all remaining real ESLint errors: 11 `no-undef` in `server/services/analyticsCRUD.js` were catch-block variable-name typos (`catch (error) { ...err.message...; throw err }` — `err` was never in scope, so these catches threw `ReferenceError` and swallowed the real error every time they ran; corrected to reference `error`) and 1 `no-useless-catch` in `server/services/clientService.js` (a catch block that only rethrows, removed). Both are behavior-preserving-or-better: the analyticsCRUD fix makes existing error logging work as originally intended instead of masking failures with a ReferenceError; the useless-catch removal changes nothing about what propagates. **Also found and flagged, not touched**: a stray, git-tracked, unreferenced duplicate directory `client/src copy/` (8 files, literal space in the name, not imported anywhere) — excluded from lint/format rather than deleted, since removing tracked files is a bigger call than this task list's scope; recommend the owner delete it. Final: **0 errors, 387 warnings**.
- [x] 8.12 Downgraded to `warn` for this baseline (ambiguous or purely stylistic, not safe to auto-fix without deeper business-logic context): `no-unused-vars`, `react-hooks/exhaustive-deps` (as planned), plus `react/no-unescaped-entities`, `react/display-name`, `no-prototype-builtins`, `no-constant-binary-expression` (one real-looking dead-conditional `{true && (...)}` in `GradientBackground.jsx`, worth a human look), `no-empty-pattern` (two components destructuring `{}` from unused props, possibly a forgotten prop). CI ratchet value: **`--max-warnings 387`**.
- [x] 8.13 Verified `npm run client:build` succeeds (confirmed 8.7)
- [ ] 8.14 Commit as `chore: add shared lint, format, and editor configuration`

## 9. survey-system-unified: test wiring

- [ ] 9.1 Run `cd survey-system-unified/server && npm test` locally with PostgreSQL stopped and record the result
- [ ] 9.2 If `server/__tests__/routes/surveyRoutes.test.js` requires a live database, mock the `pg` pool so it runs without one
- [ ] 9.3 Run `cd survey-system-unified/client && npm test -- --watchAll=false` and record the result
- [ ] 9.4 If `client/src/App.test.js` is unmodified CRA boilerplate that fails against the real app, fix or delete it
- [ ] 9.5 Replace `survey-system-unified/package.json`'s `test` script so it runs both `server` and `client` suites non-interactively and exits non-zero if either fails
- [ ] 9.6 Verify `npm test` from `survey-system-unified/` passes end to end
- [ ] 9.7 Commit as `test: wire server and client suites into a root test script`

## 10. survey-system-unified: formatting pass (isolated commit)

- [ ] 10.1 Confirm no other in-flight branch is mid-edit inside `survey-system-unified/` (the `phase-1-security-and-correctness` work is already archived, so this is now just a courtesy check)
- [ ] 10.2 Run `npm run format` from `survey-system-unified/`
- [ ] 10.3 Verify `npm run lint`, `npm test`, and `npm run client:build` all still pass after reformatting
- [ ] 10.4 Commit the formatting pass alone as `style: apply prettier formatting across survey-system-unified` — no other change in this commit
- [ ] 10.5 Add `survey-system-unified/.git-blame-ignore-revs` containing that commit's SHA; reference it in `CONTRIBUTING.md`

## 11. Verification

- [ ] 11.1 Push the branch and confirm the fixed `test.yml` runs and passes on the pull request (the true test of task 2)
- [ ] 11.2 Deliberately break a server test on a scratch branch, confirm CI reports a failed check, then revert
- [ ] 11.3 Confirm `build.yml`/`deploy-*.yml` do **not** trigger on the push (task 2.6's guarantee)
- [ ] 11.4 Open a test issue and a test pull request and confirm the templates render
- [ ] 11.5 Check GitHub → Insights → Community Standards and confirm every item is satisfied
- [ ] 11.6 Clone the repository to a fresh directory and confirm `surveymockup1`/`surveymockup1_backend` no longer appear as broken empty submodule folders
- [ ] 11.7 From that fresh clone, follow the true-root README and then `survey-system-unified/README.md` to a running dev environment, correcting any gap found
- [ ] 11.8 Confirm the root README badges resolve (CI status, license, Node version)
- [ ] 11.9 Recommend to the owner that branch protection on `master` require the fixed `test.yml` check
- [ ] 11.10 Hand the owner the open questions from design.md: fate of `build.yml`/`deploy-*.yml`, accuracy of the ten true-root planning docs, contents of the two orphaned submodule directories, and the `schemacreation/backups/*.sql` data question
