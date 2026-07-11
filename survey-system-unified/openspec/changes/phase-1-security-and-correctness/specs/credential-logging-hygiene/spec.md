## ADDED Requirements

### Requirement: Log stream requires authentication
The system SHALL require an authenticated admin session before serving the application log stream.

#### Scenario: Unauthenticated request to the log stream
- **WHEN** a client requests the log-stream endpoint without a valid admin session
- **THEN** the system responds with 401/403 and does not send any log data

#### Scenario: Authenticated admin requests the log stream
- **WHEN** an authenticated admin with a valid session requests the log-stream endpoint
- **THEN** the system streams log data as before

### Requirement: No secret values in logs
The system SHALL NOT write passwords, API tokens, or session/JWT values to any log output (file, console, or stream).

#### Scenario: Admin registration is logged
- **WHEN** a request body containing a password reaches a logging call
- **THEN** the password field is redacted or the raw body is not logged

#### Scenario: External API token is used
- **WHEN** a service call using a third-party API token executes
- **THEN** the token value never appears in log output

#### Scenario: A JWT or session cookie value passes through a debug/diagnostic code path
- **WHEN** any code path logs request/auth context
- **THEN** the JWT or cookie value itself is never written to logs, and no unauthenticated debug endpoint exposes it
