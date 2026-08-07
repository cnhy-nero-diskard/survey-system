## MODIFIED Requirements

### Requirement: No secret values in logs
The system SHALL NOT write passwords, API tokens, or session/JWT values to any log output (file, console, or stream). This SHALL also hold for configuration and startup diagnostics: when the system reports a configuration problem, it SHALL name the offending environment variable but SHALL NOT echo its value, and no code path SHALL log or serve a dump of resolved configuration that includes secret values.

#### Scenario: Admin registration is logged
- **WHEN** a request body containing a password reaches a logging call
- **THEN** the password field is redacted or the raw body is not logged

#### Scenario: External API token is used
- **WHEN** a service call using a third-party API token executes
- **THEN** the token value never appears in log output

#### Scenario: A JWT or session cookie value passes through a debug/diagnostic code path
- **WHEN** any code path logs request/auth context
- **THEN** the JWT or cookie value itself is never written to logs, and no unauthenticated debug endpoint exposes it

#### Scenario: Startup validation rejects a secret value
- **WHEN** the configuration module exits because a secret is too short, duplicated across variables, or matches a publicly-known placeholder
- **THEN** the error message names the variable and the reason for rejection, and the secret value itself does not appear in the message or in any log line

#### Scenario: Configuration is logged or exposed
- **WHEN** any code path logs the resolved configuration object, or a health or diagnostic endpoint reports configuration state
- **THEN** variables classified as secret are omitted or replaced with a fixed redaction marker whose length does not reveal the value's length
