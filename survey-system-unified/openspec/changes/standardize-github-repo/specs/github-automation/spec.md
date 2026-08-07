## ADDED Requirements

### Requirement: Continuous integration workflow actually triggers and passes
The repository already contains a GitHub Actions test workflow at `.github/workflows/test.yml` (true repo root). It SHALL trigger on the repository's actual default branch and on every pull request, and SHALL install dependencies, lint, test, and build against the codebase's current configuration rather than a stale one.

#### Scenario: CI runs on pull requests
- **WHEN** a pull request is opened against `master`
- **THEN** the CI workflow is triggered and reports a status check on the pull request, where previously it targeted a nonexistent `main`/`develop` branch and never ran

#### Scenario: CI covers both packages
- **WHEN** the CI workflow runs
- **THEN** it installs dependencies for `survey-system-unified`, `client`, and `server`, runs lint, runs the `server` Jest suite, runs the `client` test suite in non-watch mode, and runs the production `client` build

#### Scenario: CI fails on a failing test
- **WHEN** a commit breaks `server/__tests__/services/surveyService.test.js`
- **THEN** the CI workflow exits non-zero and the pull request check is marked failed

#### Scenario: CI uses current environment variable names
- **WHEN** the workflow's test-database step runs
- **THEN** it sets `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, and CI-only throwaway `SESSION_SECRET`, `JWT_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET` values, matching what `server/config` actually reads — not the retired `DB_HOST`/`DB_USER`/`DB_NAME`/`DB_PASSWORD` names

#### Scenario: CI references the current schema template path
- **WHEN** the workflow initializes the test database
- **THEN** it loads the schema from `survey-system-unified/server/db/schema/db_template_survey.sql`, its post-move location

#### Scenario: CI pins the Node version
- **WHEN** the workflow sets up Node
- **THEN** it uses the version recorded in `survey-system-unified/.nvmrc`, which satisfies the `engines.node` constraint in `survey-system-unified/package.json`

#### Scenario: CI caches npm downloads
- **WHEN** the workflow installs dependencies
- **THEN** it uses `actions/setup-node` npm caching keyed on the committed lockfiles so repeat runs do not re-download the full dependency tree

#### Scenario: CI does not require production or deployment secrets
- **WHEN** the workflow runs on a fork's pull request
- **THEN** every step completes using only CI-local throwaway values, needing no Docker Hub, GCP, DigitalOcean, `SENDGRID_API_KEY`, or other repository secret

### Requirement: Dormant deployment workflows are flagged, not silently reactivated
The repository's existing `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, and `manual-deploy-gcp.yml` workflows SHALL NOT have their trigger branches changed as a side effect of repository-hygiene work, since doing so could cause a real Docker Hub push or cloud deployment to fire on the next push.

#### Scenario: Deploy workflows remain dormant after this change
- **WHEN** this change is complete and a commit is pushed to `master`
- **THEN** `build.yml`, `deploy-gcp.yml`, `deploy-do.yml`, and `manual-deploy-gcp.yml` do not trigger, because their branch filters still reference `main`

#### Scenario: The decision is recorded as an open question
- **WHEN** a maintainer reads this change's design document
- **THEN** it explicitly asks the repository owner whether these four workflows should be fixed the same way, deleted, or left dormant

### Requirement: Dependency update automation
The repository SHALL contain `.github/dependabot.yml` configuring automated dependency update pull requests.

#### Scenario: All npm manifests are covered
- **WHEN** Dependabot evaluates the repository
- **THEN** it is configured with `npm` ecosystem entries for `/`, `/client`, and `/server`

#### Scenario: Actions are kept current
- **WHEN** Dependabot evaluates the repository
- **THEN** it is configured with a `github-actions` ecosystem entry for `/`

#### Scenario: Update volume is bounded
- **WHEN** Dependabot opens update pull requests
- **THEN** each ecosystem entry declares a weekly schedule and an `open-pull-requests-limit` so the queue does not flood the repository

### Requirement: Issue templates
The repository SHALL contain issue templates under `.github/ISSUE_TEMPLATE/` for bug reports and feature requests, plus a `config.yml` controlling blank issues and contact links.

#### Scenario: Contributor picks a template
- **WHEN** a user clicks "New issue" on GitHub
- **THEN** they are offered a "Bug report" and a "Feature request" template rather than an empty text box by default

#### Scenario: Bug template collects reproduction detail
- **WHEN** a user fills in the bug report template
- **THEN** it prompts for expected behavior, actual behavior, reproduction steps, and environment (OS, Node version, browser, deployment mode)

#### Scenario: Security reports are redirected
- **WHEN** a user opens the new-issue chooser
- **THEN** `config.yml` presents a contact link pointing at the security reporting process instead of a public issue template

### Requirement: Pull request template
The repository SHALL contain `.github/pull_request_template.md` prompting the author for a summary, linked issue, change type, testing performed, and a pre-merge checklist.

#### Scenario: Template is applied automatically
- **WHEN** a contributor opens a pull request
- **THEN** the description is pre-filled with the template

#### Scenario: Checklist enforces project conventions
- **WHEN** an author works through the template checklist
- **THEN** it asks them to confirm lint and tests pass locally, that `CHANGELOG.md` was updated for user-visible changes, and that no secrets are included in the diff

### Requirement: Code ownership
The repository SHALL contain `.github/CODEOWNERS` assigning default reviewers.

#### Scenario: Default owner is assigned
- **WHEN** any pull request is opened
- **THEN** the CODEOWNERS default rule requests review from the repository owner

#### Scenario: Sensitive paths have explicit owners
- **WHEN** a pull request touches `.github/`, `server/config/`, or `server/middleware/`
- **THEN** CODEOWNERS requests review from the designated owner for those paths
