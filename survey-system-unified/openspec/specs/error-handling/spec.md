## Purpose

Ensure the server's error-handling pipeline uses the structured winston logger, preserves HTTP status codes from error objects, handles non-Error values gracefully, and routes all server-side logging through winston.

## Requirements

### Requirement: Error handler uses winston for structured logging
The error-handling middleware SHALL log all errors using the project's winston logger (`logger.error`) instead of `console.error`.

#### Scenario: Error object is logged via winston
- **WHEN** a controller passes an Error object to `next(err)`
- **THEN** the error handler SHALL call `logger.error` with the error message and stack trace
- **AND** the log entry SHALL include a timestamp, level, and message via winston's configured format

#### Scenario: Error log appears in winston file transport
- **WHEN** an error is logged at `error` level
- **THEN** the log entry SHALL be written to the `error.log` file via winston's file transport

### Requirement: Error handler preserves HTTP status codes
The error-handling middleware SHALL return the HTTP status code from the error object when available, rather than always returning 500.

#### Scenario: Error with status property
- **WHEN** a controller sets `err.status = 400` and calls `next(err)`
- **THEN** the error handler SHALL respond with HTTP 400
- **AND** the response body SHALL contain `{ error: "..." }` with the error message

#### Scenario: Error with statusCode property
- **WHEN** an error object has `err.statusCode = 404` but no `err.status`
- **THEN** the error handler SHALL respond with HTTP 404

#### Scenario: Error without status code defaults to 500
- **WHEN** an error object has neither `err.status` nor `err.statusCode`
- **THEN** the error handler SHALL respond with HTTP 500

### Requirement: Error handler handles non-Error objects
The error-handling middleware SHALL gracefully handle cases where `next()` is called with a string or other non-Error value, preventing `undefined` log output.

#### Scenario: String passed to next
- **WHEN** a controller calls `next("some error string")`
- **THEN** the error handler SHALL wrap the string in a new Error object before logging
- **AND** the log entry SHALL contain the error message (not `undefined`)

#### Scenario: Null or undefined passed to next
- **WHEN** a controller calls `next()` with no argument or `next(null)`
- **THEN** the error handler SHALL log a generic "Unknown error" message
- **AND** respond with HTTP 500

### Requirement: Controllers pass Error objects to next
All controller code SHALL pass Error objects (not strings) to `next()` for error propagation.

#### Scenario: Controller creates Error before calling next
- **WHEN** a controller catches an error and needs to propagate it
- **THEN** the controller SHALL call `next(new Error("descriptive message"))` rather than `next("descriptive message")`

### Requirement: Server-side code uses winston for all logging
All server-side modules SHALL use the winston logger for logging instead of `console.error` or `console.log`.

#### Scenario: Database connection logging
- **WHEN** the database module logs connection status
- **THEN** it SHALL use `logger.info` or `logger.error` instead of `console.log`

#### Scenario: Middleware error logging
- **WHEN** auth middleware or other middleware logs errors
- **THEN** it SHALL use `logger.error` instead of `console.error`
