## ADDED Requirements

### Requirement: Root README follows the standard open-source structure
The root `README.md` SHALL open with the project name, a one-line description, and status badges, and SHALL contain sections for features, tech stack, prerequisites, installation, configuration, running, testing, project structure, deployment, contributing, and license.

#### Scenario: A newcomer can orient in under a minute
- **WHEN** a visitor lands on the repository page
- **THEN** the first screen of `README.md` states what the system does (a tourism survey platform with a React client and an Express/PostgreSQL server), and shows badges for the CI workflow status, the license, and the supported Node version

#### Scenario: Setup instructions work from a clean clone
- **WHEN** a contributor follows the installation and configuration sections step by step on a fresh machine
- **THEN** they reach a running development environment without needing information that is not in the repository

#### Scenario: Configuration is documented as a table
- **WHEN** a reader reaches the configuration section
- **THEN** every variable in `.env.example` is listed with its purpose, whether it is required, and its default

#### Scenario: Testing is documented
- **WHEN** a reader reaches the testing section
- **THEN** it shows how to run the root, server, and client suites

#### Scenario: Contributing and license are linked
- **WHEN** a reader reaches the end of `README.md`
- **THEN** it links to `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and `LICENSE`

### Requirement: Repository root is free of scratch documentation
Ad-hoc working notes SHALL live under `docs/` rather than at the repository root.

#### Scenario: Sidebar notes are relocated
- **WHEN** the repository root is listed
- **THEN** `SIDEBAR_BUG_FIXES.md` and `SIDEBAR_IMPROVEMENTS.md` are no longer there and their content is under `docs/`

#### Scenario: Agent guidance is relocated but preserved
- **WHEN** `AI_AGENT_README.md` is moved into `docs/`
- **THEN** its content is preserved in full, and the root `README.md` links to it, because it records the project's safety constraints around the production database and API contracts

#### Scenario: Docs directory has an index
- **WHEN** a reader opens `docs/`
- **THEN** a `docs/README.md` lists each document with a one-line description

#### Scenario: Root markdown set is predictable
- **WHEN** the repository root is listed
- **THEN** the only Markdown files present are `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and `CHANGELOG.md`

### Requirement: Package READMEs describe their actual package
Each package-level README SHALL describe the package as it exists in this repository.

#### Scenario: Server README is corrected
- **WHEN** a reader opens `server/README.md`
- **THEN** it names the server package as it is defined in `server/package.json`, and no longer instructs the reader to clone a separate `surveymockup1_backend` repository from a `yourusername` placeholder URL

#### Scenario: Client README is corrected
- **WHEN** a reader opens `client/README.md`
- **THEN** it describes this client rather than being unmodified Create React App boilerplate, and links back to the root README for full setup

#### Scenario: Package READMEs defer to the root
- **WHEN** a reader opens either package README
- **THEN** it links to the root `README.md` for environment setup and deployment instead of duplicating those instructions

### Requirement: Setup documentation matches the repository
Documented setup commands SHALL correspond to scripts and files that exist.

#### Scenario: Referenced scripts exist
- **WHEN** every command in the README setup section is checked against `package.json` and `scripts/`
- **THEN** each referenced npm script and each referenced file exists

#### Scenario: Database provisioning is documented
- **WHEN** a contributor needs to create the database
- **THEN** the README points at the committed schema template and states how to load it into PostgreSQL
