## Purpose

Ensure anonymous survey requests are throttled per user with a persistent, shared rate limiter so counters accumulate across requests, while remaining fail-open so throttling never blocks legitimate submissions.

## Requirements

### Requirement: Per-anonymous-user request throttling
The system SHALL throttle requests from an anonymous survey user based on that user's `spamcounter` value stored in the `anonymous_users` table. The throttle MUST use a single shared rate-limiter instance with a persistent store so that request counters accumulate across requests within the configured window.

#### Scenario: High-spam user is throttled
- **WHEN** an anonymous user with `spamcounter >= 40` makes more than 5 requests within a 1-minute window
- **THEN** the system returns HTTP 429 with an error message indicating the account is temporarily throttled

#### Scenario: Moderate-spam user is throttled
- **WHEN** an anonymous user with `spamcounter >= 20` and `< 40` makes more than 15 requests within a 1-minute window
- **THEN** the system rejects the excess requests with a rate-limit response

#### Scenario: Low-spam user is not throttled
- **WHEN** an anonymous user with `spamcounter < 20` makes requests
- **THEN** the system allows the requests without applying rate limiting

#### Scenario: Counter persists across requests
- **WHEN** a throttled user makes requests that do not exceed the limit within the window
- **THEN** the system counts each request against the same shared limiter rather than resetting the counter on every request

### Requirement: Fail-open on lookup errors
The system SHALL allow a request to proceed without throttling when the anonymous user cannot be identified or the spam-counter lookup fails, so that a throttling failure never blocks legitimate survey submissions.

#### Scenario: No anonymous user id present
- **WHEN** a request has no `anonymousUserId` in the session
- **THEN** the system proceeds without applying throttling

#### Scenario: User not found in database
- **WHEN** the `anonymous_users` lookup returns no row for the session's user id
- **THEN** the system proceeds without applying throttling

#### Scenario: Database error during lookup
- **WHEN** the spam-counter database query throws an error
- **THEN** the system logs the error and proceeds without applying throttling

### Requirement: Consistent logging
The system SHALL log spam-throttle activity through the application's structured logger (winston), and MUST NOT fall back to `console.error` for throttle-related failures.

#### Scenario: Throttle event is logged
- **WHEN** a user is identified as high-spam and is being rate limited
- **THEN** the system logs a warning through the winston logger

#### Scenario: Lookup error is logged
- **WHEN** the spam-counter lookup fails
- **THEN** the system logs the error through the winston logger, not `console.error`
