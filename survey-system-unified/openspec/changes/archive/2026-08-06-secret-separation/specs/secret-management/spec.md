## ADDED Requirements

### Requirement: Secret and non-secret configuration are distinguished
The central configuration module SHALL classify every environment variable it defines as either secret or non-secret. `JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, and `PG_PASSWORD` SHALL be classified as secret. Secret-specific validation and handling rules SHALL be applied on the basis of this classification rather than being duplicated at each call site.

#### Scenario: A new secret variable is introduced
- **WHEN** a developer adds a new variable to the configuration module and marks it secret
- **THEN** the distinctness, strength, placeholder-rejection, and no-echo rules apply to it automatically, without changes to any other module

#### Scenario: A non-secret variable is validated
- **WHEN** the configuration module validates `PORT` or `FRONTEND_URL`
- **THEN** no minimum-length or placeholder-rejection rule is applied, because those variables are not classified as secret

### Requirement: No functioning secret value is committed to the repository
No tracked file SHALL contain a secret value that would work if used as-is. Tracked configuration files SHALL contain either an unresolved variable reference or a placeholder that the startup validation rejects.

#### Scenario: Docker Compose is inspected for secret literals
- **WHEN** reviewing the `environment` blocks of `docker-compose.yml` and `docker-compose.prod.yml`
- **THEN** every password and secret entry is a `${VAR}` reference with no default fallback, and no literal secret value such as `survey_password`, `docker_dev_secret_change_in_production`, or a pgAdmin default password appears

#### Scenario: The tracked development env file is inspected
- **WHEN** reviewing `.env.development`
- **THEN** it contains no secret values — `SESSION_SECRET` and any database password are absent — and it documents that secrets belong in the untracked `.env`

#### Scenario: Compose is started with no secrets supplied
- **WHEN** an operator runs `docker-compose up` with no `.env` file present and no secret variables exported in the shell
- **THEN** the stack fails to start and the failure names the missing variables, rather than starting with a committed default secret

### Requirement: Each secret is distinct from every other secret
The system SHALL refuse to start if any two of `JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET` have the same value. These secrets protect different assets with different blast radii and rotation costs, and reusing one value across them means a single disclosure compromises all four.

#### Scenario: All four secrets are distinct
- **WHEN** the server starts with four different values for `JWT_SECRET`, `SESSION_SECRET`, `CRYPTO_SECRET`, and `HMAC_SECRET`
- **THEN** the distinctness check passes and startup continues

#### Scenario: Two secrets share a value
- **WHEN** the server starts with `JWT_SECRET` and `SESSION_SECRET` set to the same value
- **THEN** the server exits before the Express app starts, and the error names both `JWT_SECRET` and `SESSION_SECRET` as duplicates without printing the shared value

#### Scenario: All four secrets share one value
- **WHEN** the server starts with all four secrets set to the same value
- **THEN** the server exits and the error reports every variable participating in the duplication in a single message

### Requirement: Weak secrets are rejected in production
When `NODE_ENV` is `production`, the system SHALL reject any secret value shorter than 32 characters and exit at startup. When `NODE_ENV` is not `production`, a short secret SHALL produce a startup warning naming the variable, and startup SHALL continue.

#### Scenario: Short secret in production
- **WHEN** the server starts with `NODE_ENV=production` and a 12-character `SESSION_SECRET`
- **THEN** the server exits before serving requests and the error names `SESSION_SECRET` and states the minimum length, without printing the value

#### Scenario: Short secret in development
- **WHEN** the server starts with `NODE_ENV=development` and a 12-character `SESSION_SECRET`
- **THEN** a warning naming `SESSION_SECRET` is emitted and the server starts normally

#### Scenario: Sufficiently long secret in production
- **WHEN** the server starts with `NODE_ENV=production` and all secrets at 32 characters or longer
- **THEN** the strength check passes and startup continues

### Requirement: Publicly-known placeholder secrets are rejected
The system SHALL maintain a deny list of secret values that have appeared in this repository or its git history, and SHALL exit at startup if any secret variable is set to a value on that list, in every environment including development. The deny list SHALL include at minimum `docker_dev_secret_change_in_production`, `dev_session_secret_key`, `your_super_secret_session_key_change_this_in_production`, `dev_password`, and `survey_password`.

#### Scenario: A committed placeholder is used as a real secret
- **WHEN** the server starts with `SESSION_SECRET=docker_dev_secret_change_in_production`
- **THEN** the server exits and the error states that the value for `SESSION_SECRET` is publicly known and must be replaced

#### Scenario: A deny-listed value is used in development
- **WHEN** the server starts with `NODE_ENV=development` and `PG_PASSWORD=dev_password`
- **THEN** the server still exits, because the value is public regardless of environment

#### Scenario: A freshly generated secret is used
- **WHEN** the server starts with secrets generated by the documented generation command
- **THEN** no value matches the deny list and startup continues

### Requirement: Secrets may be supplied from files instead of environment values
For each secret variable `<VAR>`, the system SHALL also accept `<VAR>_FILE` naming a readable file whose trimmed contents are the secret value. If both `<VAR>` and `<VAR>_FILE` are set, the system SHALL exit at startup rather than silently choosing one. If `<VAR>_FILE` is set but the file cannot be read, the system SHALL exit and report the path.

#### Scenario: Secret supplied via a mounted file
- **WHEN** `JWT_SECRET_FILE` points at a readable file containing a secret followed by a trailing newline, and `JWT_SECRET` is unset
- **THEN** the configuration module resolves `JWT_SECRET` to the file contents with surrounding whitespace removed, and the required-variable check treats `JWT_SECRET` as present

#### Scenario: Both the variable and its file form are set
- **WHEN** both `JWT_SECRET` and `JWT_SECRET_FILE` are set
- **THEN** the server exits and the error names both forms as an ambiguous configuration

#### Scenario: Secret file is unreadable
- **WHEN** `CRYPTO_SECRET_FILE` points at a path that does not exist
- **THEN** the server exits and the error includes the configured path but no secret value

### Requirement: Secrets never enter the client build
No secret value SHALL be exposed to the browser bundle. The client build SHALL fail if any `REACT_APP_*` variable name indicates secret material — containing `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE`, `CREDENTIAL`, or `API_KEY`, case-insensitively.

#### Scenario: A secret-shaped client variable is present at build time
- **WHEN** the client build runs with `REACT_APP_HMAC_SECRET` set in the environment or in `client/.env`
- **THEN** the build fails with a non-zero exit code and an error naming `REACT_APP_HMAC_SECRET`, without printing its value

#### Scenario: Only non-secret client variables are present
- **WHEN** the client build runs with only `REACT_APP_API_HOST`, `REACT_APP_SELF_URL`, and `REACT_APP_MOCK_DATA` set
- **THEN** the guard passes and the build proceeds

#### Scenario: Client env file is documented
- **WHEN** a developer reads `client/.env` or the client README
- **THEN** it states that every `REACT_APP_*` value is compiled into the published bundle and readable by end users, and that secrets must never be placed there

### Requirement: Secret generation and rotation are documented
The repository SHALL document, for each secret variable, how to generate a suitable value, what rotating it invalidates, and whether rotation requires a data migration.

#### Scenario: Operator needs to generate secrets for a new deployment
- **WHEN** an operator follows the setup documentation
- **THEN** it provides a concrete command that produces a value satisfying the minimum-length requirement, and instructs that a separate value be generated for each of the four secrets

#### Scenario: Operator needs to rotate the data-at-rest key
- **WHEN** an operator consults the documentation for rotating `CRYPTO_SECRET`
- **THEN** it states that stored Hugging Face tokens in `HF_TOKENS` are AES-encrypted under the old value and must be decrypted with the old secret and re-encrypted with the new one, and that changing the secret alone renders them undecryptable

#### Scenario: Operator needs to rotate a signing secret
- **WHEN** an operator consults the documentation for rotating `JWT_SECRET` or `SESSION_SECRET`
- **THEN** it states the user-visible effect — issued admin tokens or live sessions become invalid and holders must sign in again — and that no data migration is needed
