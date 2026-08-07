## ADDED Requirements

### Requirement: License file present and consistent
The repository SHALL contain a `LICENSE` file at the repository root whose license matches the `license` field declared in the root `package.json`.

#### Scenario: MIT license file exists
- **WHEN** a contributor opens the repository root
- **THEN** a `LICENSE` file exists containing the MIT License text with a copyright line naming the project owner and year

#### Scenario: License metadata agrees with manifest
- **WHEN** the `license` field of the root `package.json` is compared to the `LICENSE` file
- **THEN** both identify the MIT License

#### Scenario: README states the license
- **WHEN** a reader reaches the end of `README.md`
- **THEN** a "License" section names MIT and links to the `LICENSE` file

### Requirement: Contributing guide
The repository SHALL contain a `CONTRIBUTING.md` that documents how to set up the project, the branch naming convention, the commit message convention, and how to open a pull request.

#### Scenario: Contributing guide covers required topics
- **WHEN** a new contributor reads `CONTRIBUTING.md`
- **THEN** it describes local setup (prerequisites, install, env file, run), how to run lint and tests, the branch naming scheme, the Conventional Commits format already used in this repo's history, and the pull request process

#### Scenario: Contributing guide is discoverable
- **WHEN** a contributor opens a pull request or an issue on GitHub
- **THEN** GitHub links to `CONTRIBUTING.md` because the file sits at the repository root or in `.github/`

### Requirement: Code of conduct
The repository SHALL contain a `CODE_OF_CONDUCT.md` based on the Contributor Covenant with a working contact address for reports.

#### Scenario: Code of conduct has a reporting channel
- **WHEN** a reader looks for how to report unacceptable behavior
- **THEN** `CODE_OF_CONDUCT.md` names a specific contact email rather than a placeholder such as `[INSERT CONTACT METHOD]`

### Requirement: Security policy
The repository SHALL contain a `SECURITY.md` that states which versions are supported and how to report a vulnerability privately.

#### Scenario: Vulnerability reporting instructions are private
- **WHEN** a security researcher reads `SECURITY.md`
- **THEN** it directs them to a private channel (GitHub private vulnerability reporting or a named email) and explicitly asks them not to open a public issue

#### Scenario: Response expectations are stated
- **WHEN** a researcher reads `SECURITY.md`
- **THEN** it states a target acknowledgement window and the supported version range

### Requirement: Changelog
The repository SHALL contain a `CHANGELOG.md` following the Keep a Changelog format with an `Unreleased` section.

#### Scenario: Changelog is seeded
- **WHEN** `CHANGELOG.md` is first added
- **THEN** it contains an `## [Unreleased]` heading and a `## [1.0.0]` entry summarizing the current state of the project

#### Scenario: Contributors know to update it
- **WHEN** a contributor reads `CONTRIBUTING.md` and the pull request template
- **THEN** both instruct them to add an entry under `Unreleased` for user-visible changes
