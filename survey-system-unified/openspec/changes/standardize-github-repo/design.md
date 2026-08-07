## Context

**Scope correction, discovered mid-implementation:** `survey-system-unified/` is not the git repository root. The real root is `D:\Codez\Projects\survey-system\`, one level up, and it already contains a `.github/` directory (five workflows targeting a `main` branch that doesn't exist — this repo has only `master`), an extensive root `README.md`, ten other planning/handoff documents, and two orphaned submodule gitlinks (`surveymockup1/`, `surveymockup1_backend/`) with no `.gitmodules`. Everything below that was written against the original (incomplete) picture still applies to the `survey-system-unified/` subtree; it has been supplemented, not replaced, with decisions 11–13 covering the true root.

`survey-system-unified` is a three-manifest npm project — root orchestrator, `client` (Create React App 5, React 18), `server` (Express 4, ESM, PostgreSQL) — merged from two previously separate deployments to cut hosting cost. It runs in production against real survey data, which is why `AI_AGENT_README.md` exists and warns against schema and API-contract changes.

Current state relevant to this change:

- No `.github/` directory exists. Nothing is automated: no CI, no Dependabot, no templates, no CODEOWNERS.
- No `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, or `CHANGELOG.md`, though root `package.json` declares `"license": "MIT"`.
- No root lint or format configuration. The only lint config is the inline CRA `eslintConfig` in `client/package.json`; `server` has none.
- Tests exist and are committed — `server/__tests__/routes/surveyRoutes.test.js`, `server/__tests__/services/surveyService.test.js`, `client/src/App.test.js` — and a recent commit (`a99c0ea`) enabled native-ESM Jest so they actually run. Nothing runs them on push.
- `.gitignore` line 1 is `context/` and line 114 is `.dockerignore`. Both files exist on disk and are needed: `context/db_template_survey.sql` is the PostgreSQL schema template, and without a committed `.dockerignore` a `docker build` from a clean clone copies `node_modules` into the build context.
- `server/surveymockup1_backend.code-workspace` is tracked. `server/error.log` and `server/certs/server-ca.pem` exist untracked, currently covered incidentally by `*.log` and `*.pem` rules.
- The `origin` remote URL embeds a GitHub personal access token (`https://ghp_…@github.com/cnhy-nero-diskard/survey-system.git`).
- Commit history already follows Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `spec:`).
- `openspec/specs/` is empty; one change, `phase-1-security-and-correctness`, is in flight and covers application security requirements, not repository structure.

Constraints: no application behavior may change; the default branch is `master`; the CI environment has no database and no production secrets; contributors work on both Windows (`scripts/setup-dev.bat`) and POSIX (`scripts/setup-dev.sh`).

## Goals / Non-Goals

**Goals:**

- A clean clone can be built, linted, and tested by someone who has never seen the project, using only what is in the repository.
- Every pull request gets an automatic pass/fail signal covering both packages.
- The repository presents the standard GitHub community-health set, so GitHub's own "Community Standards" checklist is satisfied.
- Style disagreements are settled by committed configuration rather than by review comments.
- The credential currently embedded in the git remote is revoked and the pattern is prevented from recurring.

**Non-Goals:**

- No migration to a monorepo tool (npm workspaces, Turborepo, Nx). The three-manifest layout stays.
- No TypeScript migration, no CRA→Vite migration, no dependency upgrades beyond what the tooling itself requires. The `client` dependency list has known cruft (`fetch`, `request`, `poppins`, `style-components`, `csv-loader`); cleaning it is separate work.
- No release automation, semantic-release, or npm publishing. `CHANGELOG.md` is maintained by hand.
- No fixing of existing lint violations as part of enabling lint — see the ratchet decision below.
- No deployment pipeline. CI builds and tests; it does not deploy.
- No changes to application code, database schema, or API contracts.

## Decisions

### 1. Repository stays multi-manifest; the root `package.json` stays the orchestrator

**Decision:** Keep three independent `package.json` files with their own lockfiles. Add `lint`, `lint:fix`, `format`, `format:check`, and a real `test` to the root, following the existing `cd client && …` / `cd server && …` pattern already used by `client:build` and `server:start`.

**Alternative considered:** Convert to npm workspaces. Rejected — it collapses three lockfiles into one, changes `node_modules` hoisting, and risks breaking the Dockerfile and CRA's resolution, all for a change that is supposed to touch no runtime behavior. Workspaces would also fight `client`'s `react-scripts`, which is sensitive to hoisted duplicate React copies.

### 2. ESLint flat config at the root, with per-directory sections

**Decision:** One `eslint.config.js` (flat config, ESLint 9) at the root with two configuration objects — one scoped to `server/**` (`sourceType: "module"`, Node globals, matching `"type": "module"`) and one scoped to `client/src/**` (browser globals, React and React Hooks plugins, JSX parsing). Ignore `**/node_modules/**`, `client/build/**`, `server/localization_queries/**`, and `context/**`.

**Alternative considered:** Two separate configs, one per package. Rejected — it duplicates the shared rule set and lets the two drift, and it means `npm run lint` at the root has to shell into both directories rather than running one ESLint invocation.

**Note:** `client/package.json` keeps its `eslintConfig: { extends: ["react-app"] }` block, because `react-scripts start` and `react-scripts build` read it directly for in-browser lint overlay. The root config governs the CLI; CRA's block governs the dev server. They must not contradict each other — the root React rules are set to be a subset of what `react-app` already enforces.

### 3. Lint is a warn-only ratchet in its first CI run

**Decision:** Enable ESLint in CI, but for the initial commit configure the CI lint step with `--max-warnings` set to the count observed on the current tree, and set the rules most likely to produce a large existing-violation count (unused vars, exhaustive-deps) to `warn`. Errors — real bugs like undefined variables — fail immediately.

**Rationale:** A codebase built under MVP deadlines with no linter will produce hundreds of findings on first run. Blocking every pull request until all are fixed either stalls the repository or forces a giant mechanical diff into the same commit as the CI setup, which makes both unreviewable. The ratchet gets the signal in place now and lets the count be driven down separately.

**Alternative considered:** Fix everything first. Rejected for the reason above. **Alternative considered:** Lint only changed files. Rejected — it needs a merge-base diff step and gives inconsistent results on rebases; the max-warnings ratchet is simpler and achieves the same "no new violations" effect.

### 4. Single CI workflow, matrix-free, three jobs

**Decision:** One `.github/workflows/ci.yml` with jobs `lint`, `test`, and `build`, each on `ubuntu-latest`, each reading Node from `.nvmrc` via `actions/setup-node`'s `node-version-file`, each with `cache: npm` keyed on the three lockfiles.

- `lint` — root install, `npm run lint`, `npm run format:check`.
- `test` — install root + server + client, run `server` Jest and `client` tests with `CI=true`.
- `build` — install client, `npm run client:build`.

**Alternative considered:** A Node version matrix (18/20/22). Rejected for now — the project pins a deployment Node version and a matrix triples CI minutes for a single-deployment app. `engines` still declares `>=18`; if that becomes a real support claim, a matrix can be added.

**Alternative considered:** One job running everything sequentially. Rejected — three jobs run in parallel and give a reader three distinct red/green signals instead of one opaque failure.

**Secrets:** no job needs any. The server tests must not require a live PostgreSQL connection; if `surveyRoutes.test.js` turns out to need one, the fix is to mock the `pg` pool, not to add a service container — a database service in CI is scope creep and a maintenance burden for two test files.

### 5. Secret scanning uses Gitleaks, run in CI

**Decision:** Add a Gitleaks step to the CI workflow scanning the working tree, with a `.gitleaks.toml` allowlist covering `.env.example` and `.env.development`.

**Rationale:** The repository has already leaked a live PAT into local configuration. GitHub's native push protection covers pushes to GitHub but does nothing for a contributor's local commits or for patterns GitHub does not recognize. A CI step catches it at pull-request time regardless.

**Alternative considered:** Scanning full history rather than the working tree. Rejected for the default run — history scanning is slow and, because the leaked PAT lives in `.git/config` rather than in a commit, it would not find the known problem anyway. A one-off manual history scan is listed as a task.

**Alternative considered:** A pre-commit hook via Husky. Deferred — hooks require every contributor to install them and are trivially bypassed with `--no-verify`. CI is the enforcement point. Husky can be added later as a convenience, not as a control.

### 6. Ignore-rule fixes, and where the schema template lands

**Decision:**
- Delete the `.dockerignore` line from `.gitignore` and commit the existing `.dockerignore`.
- Move `context/db_template_survey.sql` to `server/db/schema/db_template_survey.sql` and narrow the `context/` ignore rule to keep ignoring the rest of that scratch directory.
- Untrack `server/surveymockup1_backend.code-workspace` with `git rm --cached` and add `*.code-workspace` to `.gitignore`.
- Add explicit `server/error.log` and `server/certs/` rules, so the intent is stated rather than relying on the incidental `*.log` and `*.pem` globs.

**Rationale for moving rather than un-ignoring in place:** `context/` reads as a scratch directory and `.gitignore` treats it as one. Keeping a build-critical file inside a directory that is ignored-except-for-one-file is exactly the kind of rule that gets re-broken. `server/db/schema/` says what the file is and sits next to the code that depends on it. `server/localization_queries/schemacreation/*.sql` already holds per-table DDL, so SQL under `server/` is the established convention.

**Deliberately out of scope:** `server/localization_queries/schemacreation/backups/*.sql` (five tracked dated dumps such as `JAN28SURVEY.sql`) are database backups living in version control. They should be moved out, but they may contain production data and removing them properly requires the owner to confirm what is in them. Flagged as an open question, not silently deleted.

### 7. Documentation moves to `docs/`, and `AI_AGENT_README.md` is preserved verbatim

**Decision:** Create `docs/` with an index. Move `SIDEBAR_BUG_FIXES.md` and `SIDEBAR_IMPROVEMENTS.md` there as historical notes. Move `AI_AGENT_README.md` to `docs/AI_AGENT_GUIDE.md` **without editing its content**, and link it prominently from the root README.

**Rationale:** `AI_AGENT_README.md` is the only written record of the project's operational danger zones — production data, API contracts that must not break, environment-variable dependencies. It is load-bearing institutional knowledge and must survive the reorganization intact. It leaves the root only because a root full of shouting Markdown files is the thing this change is fixing.

Use `git mv` for all moves so history follows the files.

### 8. Prettier is the formatter; ESLint does not format

**Decision:** Prettier owns formatting, ESLint owns correctness. Do not add `eslint-plugin-prettier` (which reports formatting as lint errors and slows linting); add `eslint-config-prettier` last in the flat config to switch off ESLint's stylistic rules.

**Decision on scope of the first format pass:** run `npm run format` across the tree once, as a **separate commit** from every other change in this task list, so that the enormous whitespace diff never mixes with reviewable content. That commit's SHA goes into a `.git-blame-ignore-revs` file.

### 9. Community-health files are placed at the root, not in `.github/`

**Decision:** `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md` at the repository root. Only automation configuration (`workflows/`, `ISSUE_TEMPLATE/`, `pull_request_template.md`, `CODEOWNERS`, `dependabot.yml`) goes in `.github/`.

**Rationale:** GitHub finds community-health files in either location, but a human browsing the file tree finds them at the root. `.github/` becomes purely "things GitHub executes."

### 10. The leaked token is handled by the owner, out of band

**Decision:** The task list instructs the owner to revoke the PAT in GitHub settings and reset the remote to a token-free URL. The change does not attempt to script this.

**Rationale:** Revocation requires authenticated access to the owner's GitHub account. It must be done by a person. Rewriting the remote before revoking would create a false sense of safety — the token string has already been exposed in local config and shell history, so rotation is the actual fix and the URL change is only cleanup. Ordering matters: revoke first, then re-point the remote.

### 11. Fix `test.yml` in place; leave the four deploy/build workflows alone

**Decision:** Edit `.github/workflows/test.yml` at the true root: change the branch trigger from `[main, develop]` to `[master]`, replace `DB_HOST`/`DB_USER`/`DB_NAME`/`DB_PASSWORD`/`DB_PORT` with `PG_HOST`/`PG_USER`/`PG_DATABASE`/`PG_PASSWORD`/`PG_PORT`, add `JWT_SECRET`/`CRYPTO_SECRET`/`HMAC_SECRET` (CI-only throwaway values — this workflow already sets a throwaway `SESSION_SECRET`), update the schema-template path to `survey-system-unified/server/db/schema/db_template_survey.sql`, and add a lint step. Do not touch `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, `manual-deploy-gcp.yml`.

**Rationale:** `test.yml` only runs tests and uploads coverage — flipping its dead `main` trigger to `master` has no side effect beyond "CI now runs." The other four workflows push Docker images and deploy to GCP/DigitalOcean; flipping their trigger to `master` would make every push attempt a real external action the moment matching secrets exist in the repo (some may already be configured — this change does not audit GitHub's secret store). That is an infrastructure/ops decision — which cloud target is actually current, whether Docker Hub publishing is wanted on every push — that belongs to the repository owner, not to a repo-hygiene pass. Reactivating a deploy pipeline as a side effect of "standardize the repo" would violate the instruction to match the scope of changes to what was asked.

**Alternative considered:** Delete the four dormant workflows outright. Rejected — deleting represents a bigger decision (abandoning GCP/DO as deploy targets) than this change has the authority or context to make; `.github/workflows/README.md` documents them as intentional, if unconfigured, options.

### 12. De-register the orphaned submodules, don't delete their working directories

**Decision:** Run `git rm --cached surveymockup1 surveymockup1_backend` at the true root to remove the gitlink entries from the index. Leave the actual directories on disk untouched (they become untracked, ordinary directories).

**Rationale:** `git ls-files -s` shows both as mode `160000` gitlinks with no `.gitmodules` — so `git submodule update --init` has never worked and a fresh clone gets two empty folders. The root README already frames `survey-system-unified/` as their replacement ("NEW: Unified Deployment (Recommended)"), confirmed by the user. De-registering fixes the clone-time defect immediately. Deleting the working directories outright goes further than "fix the git metadata" and risks destroying whatever is actually inside them (each has its own `.git`, meaning they carry their own history) without the owner having looked — that decision is left to a follow-up task, not automated here.

### 13. Update the true-root README in place; keep `survey-system-unified/README.md` as a package-level pointer

**Decision:** The true-root `README.md` already has badges, a feature list, and an architecture explanation of the three deployment approaches — decision 9's plan to "write the root README from scratch" applies to the wrong file. Instead: fix its stale claims (a `test.txt` "repository marker file" that no longer exists, the LICENSE badge that will now resolve once `LICENSE` is added, and branch references), and add the configuration-variable table and schema/certs setup detail originally planned for `survey-system-unified/README.md`. `survey-system-unified/README.md`, `server/README.md`, and `client/README.md` become shorter package-level READMEs that link back to the true root for anything already covered there — consistent with the `project-documentation` spec's existing requirement that package READMEs defer to the root.

## Risks / Trade-offs

- **CI turns red immediately on existing lint violations, and the repository looks broken from day one** → The warn-ratchet in decision 3 sets `--max-warnings` to the measured current count, so the first CI run is green by construction. Record the count in `CONTRIBUTING.md` so the intent to drive it down is visible.

- **`client/src/App.test.js` may be untouched CRA boilerplate that fails against the real app** → Run both suites locally before wiring them into CI. If a suite is broken or vacuous, fix or delete it in this change rather than shipping a workflow that is known-red; a permanently red check trains everyone to ignore checks.

- **Server tests may require a live PostgreSQL connection and fail in CI** → Verify locally with the database stopped. If they need one, mock the `pg` pool in the test setup. Do not add a Postgres service container.

- **The one-shot Prettier pass rewrites nearly every file, destroying `git blame` and conflicting with the in-flight `phase-1-security-and-correctness` branch** → Isolate it in its own commit, add `.git-blame-ignore-revs` (which GitHub honors automatically), and either land the format pass before `phase-1` work resumes or after it merges — never in parallel. Sequencing this is a coordination task, not a technical one.

- **`.gitattributes` line-ending normalization rewrites every text file on the next checkout for Windows contributors, producing a phantom "everything modified" state** → Land `.gitattributes` together with the normalization commit (`git add --renormalize .`), and document the one-time `git rm --cached -r . && git reset --hard` refresh in `CONTRIBUTING.md`.

- **Dependabot opens a flood of pull requests against a dependency tree that has not been updated in a long time** → Weekly schedule, `open-pull-requests-limit: 5` per ecosystem, and group patch/minor updates. Accept that the first few weeks will be noisy; that noise is the accumulated debt becoming visible, which is the point.

- **Moving `context/db_template_survey.sql` breaks any local script or documented step that references the old path** → Grep for the old path across the repository and `scripts/` before moving, and update every reference.

- **CODEOWNERS with a single owner makes that person a bottleneck on every pull request** → Acceptable for a repository with one primary maintainer; it is a review request, not a merge block, unless branch protection is configured to require it.

- **Adding ESLint 9 as a root devDependency may conflict with the ESLint 8 that `react-scripts` 5 pulls in transitively** → The root and client trees are separate `node_modules`, so the CLI resolves the root ESLint and CRA resolves its own. Verify both `npm run lint` and `npm run client:build` pass after the tooling is added; if they interfere, pin the root to ESLint 8 with `.eslintrc` legacy format instead of flat config.

## Migration Plan

Land in this order, each as its own commit:

1. **Hygiene and ignore fixes** — `.gitignore` corrections, commit `.dockerignore`, move the schema template, untrack the workspace file. Small, independently reviewable, and unblocks a clean clone immediately.
2. **Community-health files** — `LICENSE`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`. Pure additions, zero risk.
3. **Documentation reorganization** — `git mv` into `docs/`, rewrite root and package READMEs.
4. **Tooling configuration** — `.editorconfig`, `.nvmrc`, `.gitattributes` + renormalization, ESLint, Prettier, root scripts. Verify `client:build` still passes.
5. **Formatting pass** — isolated commit, then `.git-blame-ignore-revs`.
6. **Automation** — CI workflow, Dependabot, templates, CODEOWNERS. Last, so that the first CI run exercises a tree that already has everything else in place.

Out of band, by the repository owner, before or alongside step 1: revoke the exposed PAT, then reset the `origin` remote to a token-free URL.

**Rollback:** every step is additive or a file move; reverting the commit restores the prior state. The only step with a wide blast radius is step 5, and reverting that single commit restores the previous formatting exactly.

## Open Questions

- ~~**The five tracked SQL backups under `server/localization_queries/schemacreation/backups/`**~~ — **Resolved:** owner confirmed these are dummy/template data, not production responses. Deleted from `HEAD`; no history rewrite needed.
- **Copyright holder for `LICENSE`** — the individual owner (`cnhy-nero-diskard`) or an organization? `package.json` currently says "Survey System Team," which is not a legal entity.
- **Contact address for `SECURITY.md` and `CODE_OF_CONDUCT.md`** — needs a real, monitored address.
- **Is the repository intended to become public?** If yes, `AI_AGENT_README.md`'s description of production data handling and the `certs/` arrangement should be reviewed before the visibility flip. If it stays private, the community-health files are still worth having but the urgency of the secret-scanning work is lower.
- **Should branch protection require the new CI checks on `master`?** Recommended once CI is confirmed green, but it is a repository setting, not a file, and so cannot be delivered by this change.
- **Are `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, `manual-deploy-gcp.yml` still wanted?** They are stale (dead `main` trigger, likely-unconfigured secrets) but not obviously abandoned. Owner should decide: fix them the same way `test.yml` was fixed, or delete them, or leave dormant.
- **Are the ten true-root planning docs (`ARCHITECTURE.md`, `HANDOFF.md`, `TEAM_HANDOFF.md`, etc.) still accurate, or superseded by `survey-system-unified/docs/`?** Several predate the recent security hardening and env-var rename; out of scope for this change but worth a dedicated audit.
- ~~**What is actually inside `surveymockup1/` and `surveymockup1_backend/`?**~~ — **Resolved:** owner approved deletion; working directories removed from disk.
- ~~**Should `client/src copy/` be deleted?**~~ — **Resolved:** owner approved deletion; removed from git.
- **Two ESLint findings in `client/src` warrant a human look, not a mechanical fix**: `GradientBackground.jsx` has `{true && (...)}` (`no-constant-binary-expression`) — looks like a debug override that was never reverted; `AttractionsFeedback.jsx` and `PackageTourFeedback.jsx` destructure `({ })` from their props (`no-empty-pattern`) — possibly a forgotten prop. Left as warnings rather than guessed-at fixes, since either could reflect intentional behavior this change has no way to verify.
