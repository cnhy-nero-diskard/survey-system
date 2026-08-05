## ADDED Requirements

### Requirement: Single module owns environment variable definitions
The system SHALL define all required and optional environment variables in a single `server/config/env.js` module. No other module SHALL call `dotenv.config()` or independently validate environment variable presence.

#### Scenario: Module needs an environment variable
- **WHEN** any server module needs to read an environment variable
- **THEN** it imports the `env` object from `server/config/env.js` and reads the value from that object rather than calling `process.env` directly

#### Scenario: Dotenv is loaded once
- **WHEN** the server starts
- **THEN** `dotenv.config()` is called exactly once, from `server/config/env.js`, before any other module reads a variable

### Requirement: Startup validation of all required variables
The system SHALL validate that every required environment variable is set before any application logic runs. If any required variable is missing, the system SHALL exit immediately with a single error message listing all missing variable names.

#### Scenario: All required variables are set
- **WHEN** the server starts with `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, and `PORT` all present in the environment
- **THEN** the server starts normally without exiting

#### Scenario: One required variable is missing
- **WHEN** the server starts with `JWT_SECRET` unset
- **THEN** the server exits before starting the Express app and prints an error message that includes the string `JWT_SECRET`

#### Scenario: Multiple required variables are missing
- **WHEN** the server starts with both `JWT_SECRET` and `HMAC_SECRET` unset
- **THEN** the server exits and prints a single error message listing both `JWT_SECRET` and `HMAC_SECRET`, so the operator can fix all missing variables in one iteration

### Requirement: Frozen configuration object
The system SHALL export a frozen object from `env.js` containing all environment variable values. The object SHALL NOT be mutable at runtime.

#### Scenario: Attempt to mutate configuration at runtime
- **WHEN** a module attempts to set a property on the `env` object (e.g., `env.PORT = 3001`)
- **THEN** the assignment fails silently or throws in strict mode, and the original value remains unchanged

### Requirement: Canonical environment variable documentation
The `.env.example` file SHALL list every environment variable the server code reads, grouped by category, with a comment describing each variable's purpose. The variable names in `.env.example` SHALL exactly match the names the code reads.

#### Scenario: Developer copies `.env.example` to `.env`
- **WHEN** a new developer copies `.env.example` to `.env` and fills in real values
- **THEN** the server starts successfully because every variable name in `.env.example` matches a variable the code reads

#### Scenario: `.env.example` does not contain phantom variables
- **WHEN** reviewing `.env.example`
- **THEN** it does not contain `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `CORS_ORIGIN`, `RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX`, `SENDGRID_API_KEY`, `HF_TOKEN_1`, or `HF_TOKEN_2`, because no code path reads these variables

#### Scenario: `.env.example` documents all required secrets
- **WHEN** reviewing `.env.example`
- **THEN** it includes `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, and `PORT` with placeholder values and comments indicating they are required

### Requirement: Optional variables are documented and treated as optional
The system SHALL treat `NODE_ENV`, `FRONTEND_URL`, `BERTSENT_ENDPOINT`, `BERTOPIC_ENDPOINT`, `BERTRCLS_ENDPOINT`, `PG_MUNICIPALITIES`, and `PG_LOCALIZATION` as optional. The `.env.example` file SHALL document them with comments indicating they are optional.

#### Scenario: Optional variable is unset
- **WHEN** the server starts without `BERTSENT_ENDPOINT` set
- **THEN** the server starts normally and the AI analysis endpoint that depends on it returns an error or skips processing at request time, rather than crashing at startup

#### Scenario: Optional variable is set
- **WHEN** `FRONTEND_URL` is set to a URL
- **THEN** the CORS middleware uses that URL as the allowed origin for credentialed requests

### Requirement: Docker Compose files pass correct variables
The `docker-compose.yml` and `docker-compose.prod.yml` files SHALL pass the variables the server code reads (`PG_*`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, `NODE_ENV`, `PORT`) in their `environment` blocks. They SHALL NOT pass `DB_*` variables that no code path reads.

#### Scenario: Docker Compose dev environment
- **WHEN** `docker-compose up` is run with `docker-compose.yml`
- **THEN** the `survey-app` container receives `PG_HOST`, `PG_PORT`, `PG_DATABASE`, `PG_USER`, `PG_PASSWORD`, `JWT_SECRET`, `CRYPTO_SECRET`, `HMAC_SECRET`, `SESSION_SECRET`, `NODE_ENV`, and `PORT` as environment variables

#### Scenario: Docker Compose does not pass phantom variables
- **WHEN** reviewing the `environment` block of `docker-compose.yml`
- **THEN** it does not contain `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, or `DB_PASSWORD`, because the code reads `PG_*` variables instead