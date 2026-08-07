## ADDED Requirements

### Requirement: Continuous integration workflow
The repository SHALL contain a GitHub Actions workflow at `.github/workflows/ci.yml` that runs on pushes to the default branch and on every pull request, and that installs dependencies, lints, tests, and builds both the `client` and `server` packages.

#### Scenario: CI runs on pull requests
- **WHEN** a pull request is opened against the default branch
- **THEN** the CI workflow is triggered and reports a status check on the pull request

#### Scenario: CI covers both packages
- **WHEN** the CI workflow runs
- **THEN** it installs dependencies for the root, `client`, and `server` packages, runs lint, runs the `server` Jest suite, runs the `client` test suite in non-watch mode, and runs the production `client` build

#### Scenario: CI fails on a failing test
- **WHEN** a commit breaks `server/__tests__/services/surveyService.test.js`
- **THEN** the CI workflow exits non-zero and the pull request check is marked failed

#### Scenario: CI pins the Node version
- **WHEN** the workflow sets up Node
- **THEN** it uses the version recorded in `.nvmrc`, which satisfies the `engines.node` constraint in the root `package.json`

#### Scenario: CI caches npm downloads
- **WHEN** the workflow installs dependencies
- **THEN** it uses `actions/setup-node` npm caching keyed on the committed lockfiles so repeat runs do not re-download the full dependency tree

#### Scenario: CI does not require production secrets
- **WHEN** the workflow runs on a fork's pull request
- **THEN** every step completes without needing a database connection, `SENDGRID_API_KEY`, or any other repository secret

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
