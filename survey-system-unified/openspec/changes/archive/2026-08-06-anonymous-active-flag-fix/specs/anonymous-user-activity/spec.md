## ADDED Requirements

### Requirement: New anonymous users start active
When the system creates a new anonymous user, the user MUST be recorded as active (`is_active = TRUE`) at creation time.

#### Scenario: First request from a new session
- **WHEN** a public request arrives with no existing `anonymousUserId` in the session
- **THEN** the system creates an `anonymous_users` row with `is_active = TRUE`

#### Scenario: Existing user is not duplicated
- **WHEN** a public request arrives with an existing `anonymousUserId` in the session
- **THEN** the system MUST NOT insert a new `anonymous_users` row for that user

### Requirement: Activity is tracked by last activity timestamp
The system SHALL record the last activity time for each anonymous user in a `last_active_at` column, updated on every public request made by that user.

#### Scenario: Public request updates activity timestamp
- **WHEN** an anonymous user makes a public request
- **THEN** the system updates that user's `last_active_at` to the current time

#### Scenario: Activity timestamp is not updated for admin or auth requests
- **WHEN** a request targets an admin, auth, or log-stream route
- **THEN** the system MUST NOT update the anonymous user's `last_active_at`

### Requirement: Active state is derived from the inactivity window
The system SHALL derive an anonymous user's active state from `last_active_at`: a user is active when `last_active_at` is within the configured inactivity window (1 minute) of the current time, and inactive otherwise.

#### Scenario: User active within the window
- **WHEN** an anonymous user's `last_active_at` is less than 1 minute before the current time
- **THEN** the user is considered active

#### Scenario: User inactive after the window elapses
- **WHEN** an anonymous user's `last_active_at` is 1 minute or more before the current time
- **THEN** the user is considered inactive

#### Scenario: User with no recorded activity timestamp
- **WHEN** an anonymous user has a `NULL` `last_active_at`
- **THEN** the system treats the user's `created_at` as the fallback activity time for deriving active state

### Requirement: Admin anonymous-users query orders by derived active state
The `GET /api/admin/anonymous-users` query SHALL order anonymous users by derived active state (active first) and then by `created_at` descending, without changing the response shape.

#### Scenario: Active users appear first
- **WHEN** an admin fetches anonymous users
- **THEN** users whose derived active state is true are returned before inactive users

#### Scenario: Response shape is preserved
- **WHEN** an admin fetches anonymous users
- **THEN** each returned user includes the same fields as before, including `is_active`

### Requirement: No timer-based inactivity marking
The system MUST NOT use per-request `setTimeout` timers to flip `is_active` to false.

#### Scenario: Continued browsing beyond one minute
- **WHEN** an anonymous user makes requests continuously for longer than 1 minute
- **THEN** the user remains active and is never marked inactive by a stale timer

#### Scenario: Dead activity middleware removed
- **WHEN** the server starts
- **THEN** the `updateAnonymousUserActivity` middleware is not registered and no code reads an `anonymousUserId` cookie for activity updates