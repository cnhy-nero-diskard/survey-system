## ADDED Requirements

### Requirement: Build-critical files are not ignored
The `.gitignore` SHALL NOT exclude files that a clean clone needs in order to build or provision the system.

#### Scenario: Docker ignore file ships with the repository
- **WHEN** the repository is cloned fresh and `docker build .` is run
- **THEN** a committed `.dockerignore` is present and excludes `node_modules/`, `client/build/`, `.env*`, and `.git/` from the build context
- **AND** the current `.gitignore` rule that excludes `.dockerignore` has been removed

#### Scenario: Database schema template ships with the repository
- **WHEN** a new contributor follows the setup instructions in a clean clone
- **THEN** the PostgreSQL schema template that currently lives at the ignored path `context/db_template_survey.sql` is available in the repository at a documented, non-ignored location
- **AND** the blanket `context/` ignore rule no longer hides it

#### Scenario: No other required artifact is ignored
- **WHEN** `git status --ignored` is inspected on a clean tree
- **THEN** every ignored path is a generated artifact, a local secret, an editor file, or an OS file — not an input required to build, test, or provision the system

### Requirement: Local-only artifacts are not tracked
The repository SHALL NOT track files that are specific to one developer's machine or that are runtime output.

#### Scenario: Editor workspace file is untracked
- **WHEN** `git ls-files` is inspected
- **THEN** `server/surveymockup1_backend.code-workspace` is no longer tracked and is covered by an ignore rule

#### Scenario: Runtime logs stay out of the index
- **WHEN** the server runs and writes `server/error.log`
- **THEN** the file is ignored and never appears as an untracked-or-modified entry in `git status`

#### Scenario: Certificates stay out of the index
- **WHEN** `server/certs/` contains `server-ca.pem` or any other credential material
- **THEN** the directory is ignored, and the README documents how an operator supplies these files at deploy time

### Requirement: Environment files carry no real secrets
Committed environment files SHALL contain only placeholder values, and the repository SHALL make clear which file is the template.

#### Scenario: Example file is a template only
- **WHEN** `.env.example` is read
- **THEN** every value is a placeholder or a non-sensitive default, and no working credential is present

#### Scenario: Committed development file is labelled
- **WHEN** a contributor reads the tracked `.env.development`, which contains `SESSION_SECRET=dev_session_secret_key` and `DB_PASSWORD=dev_password`
- **THEN** a header comment states that these are non-secret local-only defaults that MUST NOT be used in any deployed environment

#### Scenario: Real environment file remains ignored
- **WHEN** a developer creates `.env` from the example
- **THEN** `.gitignore` keeps it untracked

### Requirement: No orphaned submodule gitlinks
The repository SHALL NOT track a submodule gitlink entry unless a corresponding `.gitmodules` entry defines where it comes from.

#### Scenario: Fresh clone has no broken submodule directories
- **WHEN** the repository is cloned fresh
- **THEN** `surveymockup1` and `surveymockup1_backend` are no longer tracked as gitlinks, so the clone does not produce two empty, unpopulated directories at those paths

#### Scenario: Superseding relationship is documented
- **WHEN** a reader reaches the root README's architecture section
- **THEN** it states that `survey-system-unified/` supersedes `surveymockup1/` and `surveymockup1_backend/` as the maintained deployment

### Requirement: No credentials in the git remote
The repository's push and fetch remotes SHALL authenticate through a credential helper, SSH, or a token supplied at runtime — never through a token embedded in the remote URL.

#### Scenario: Remote URL contains no token
- **WHEN** `git remote -v` is run
- **THEN** the URL is a plain `https://github.com/<owner>/<repo>.git` or `git@github.com:<owner>/<repo>.git` with no embedded `ghp_` or other credential

#### Scenario: The previously embedded token is revoked
- **WHEN** the repository owner completes this change
- **THEN** the personal access token that was embedded in the remote URL has been revoked in GitHub settings and replaced, because it was exposed in local configuration and in shell history

#### Scenario: Contributors are warned
- **WHEN** a contributor reads `CONTRIBUTING.md` or `SECURITY.md`
- **THEN** it states that credentials must not be embedded in remote URLs or committed to the repository

### Requirement: Secret scanning
The repository SHALL run an automated secret scan over the codebase as part of CI.

#### Scenario: A committed credential fails the build
- **WHEN** a pull request adds a string matching a known credential pattern such as a GitHub token or a SendGrid API key
- **THEN** the secret-scanning step in CI fails and the pull request check is marked failed

#### Scenario: Placeholders do not trip the scan
- **WHEN** the scan runs against `.env.example` and `.env.development`
- **THEN** the placeholder values there do not produce findings, either because they do not match credential patterns or because they are explicitly allowlisted
