## ADDED Requirements

### Requirement: Shared lint configuration
The repository SHALL provide a lint configuration at the root that covers both the CommonJS-free ESM `server` package and the React `client` package, and SHALL expose it through npm scripts.

#### Scenario: Lint runs from the repository root
- **WHEN** a developer runs `npm run lint` at the repository root
- **THEN** ESLint checks both `client/src` and `server`, and exits zero when there are no errors

#### Scenario: Server ESM is parsed correctly
- **WHEN** ESLint parses `server/server.js`, which uses `import`/`export` under `"type": "module"`
- **THEN** no parser or `sourceType` errors are reported

#### Scenario: React rules apply to the client
- **WHEN** ESLint parses a file under `client/src`
- **THEN** React and React Hooks rules apply, consistent with the existing `react-app` config in `client/package.json`

#### Scenario: Generated and vendored output is excluded
- **WHEN** ESLint runs
- **THEN** `node_modules/`, `client/build/`, and `server/localization_queries/` are not linted

#### Scenario: Autofix is available
- **WHEN** a developer runs `npm run lint:fix`
- **THEN** ESLint applies its automatic fixes in place

### Requirement: Shared formatting configuration
The repository SHALL provide Prettier configuration and ignore rules at the root, with npm scripts to check and apply formatting.

#### Scenario: Format check is scriptable
- **WHEN** a developer or CI runs `npm run format:check`
- **THEN** Prettier verifies formatting across tracked JavaScript, JSON, CSS, and Markdown files and exits non-zero if any file is unformatted

#### Scenario: Formatting can be applied
- **WHEN** a developer runs `npm run format`
- **THEN** Prettier rewrites unformatted files in place

#### Scenario: Prettier and ESLint do not conflict
- **WHEN** both `npm run lint` and `npm run format:check` are run on a clean tree
- **THEN** neither reports errors caused by the other's stylistic preferences

### Requirement: Editor and line-ending normalization
The repository SHALL contain an `.editorconfig` and a `.gitattributes` that normalize indentation and line endings across the Windows and POSIX contributors implied by `scripts/setup-dev.bat` and `scripts/setup-dev.sh`.

#### Scenario: Editors agree on basic style
- **WHEN** a contributor opens any source file in an EditorConfig-aware editor
- **THEN** indentation, charset, final newline, and trailing whitespace behavior are set by `.editorconfig`

#### Scenario: Text files are stored with LF
- **WHEN** a Windows contributor commits a JavaScript file with CRLF endings
- **THEN** `.gitattributes` normalizes it to LF in the repository

#### Scenario: Shell scripts keep LF on checkout
- **WHEN** `scripts/setup-dev.sh` is checked out on any platform
- **THEN** it retains LF endings so it remains executable under `sh`

#### Scenario: Binary files are not mangled
- **WHEN** an image or certificate file is committed
- **THEN** `.gitattributes` marks it binary so Git does not attempt end-of-line conversion

### Requirement: Node version pin
The repository SHALL contain an `.nvmrc` pinning the Node.js major version used for development and CI.

#### Scenario: Pin satisfies the declared engine range
- **WHEN** the `.nvmrc` value is compared to `engines.node` in the root `package.json`
- **THEN** the pinned version satisfies `>=18.0.0`

#### Scenario: CI and local development agree
- **WHEN** CI sets up Node
- **THEN** it reads the version from `.nvmrc` rather than hardcoding a separate version

### Requirement: Root test entry point
The root `package.json` SHALL expose a `test` script that runs the test suites of both packages non-interactively.

#### Scenario: Root test runs both suites
- **WHEN** `npm test` is run at the repository root
- **THEN** the `server` Jest suite and the `client` test suite both run, and the command exits non-zero if either fails

#### Scenario: Client tests do not hang in CI
- **WHEN** the client test suite runs in a non-TTY environment
- **THEN** it runs in single-pass mode and exits rather than entering `react-scripts test` watch mode
