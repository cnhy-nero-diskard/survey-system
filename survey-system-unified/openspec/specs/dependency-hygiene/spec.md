## Purpose

Keep package manifests accurate (no unused dependencies) and ensure schema/seed setup does not ship guessable default credentials.

## Requirements

### Requirement: Package manifests contain only used dependencies
The system SHALL NOT list a dependency in `package.json`/`client/package.json` that is not imported anywhere in the corresponding source tree, unless it is required by tooling outside `src/` (in which case it belongs in `devDependencies`).

#### Scenario: A dependency has zero imports in its source tree
- **WHEN** a listed dependency has no matching `import`/`require` anywhere in the relevant `src/`/`server/` tree
- **THEN** it is removed from the manifest

#### Scenario: A dependency is only used by a dev/CI script outside src/
- **WHEN** a dependency (e.g. a headless-browser tool) is only referenced by a standalone script outside the application source tree
- **THEN** it is listed under `devDependencies`, not `dependencies`

### Requirement: No default/example credentials ship in the repo
The system SHALL NOT include committed SQL or seed data that creates a guessable default admin account as part of normal setup.

#### Scenario: Fresh schema setup is run
- **WHEN** the schema-creation scripts are run against a new environment
- **THEN** no default admin account with a known/example credential is created
