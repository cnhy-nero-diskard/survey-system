## ADDED Requirements

### Requirement: Admin/data-mutating routes require authentication
The system SHALL require a valid authenticated session on every admin route that mutates data, consumes paid third-party API quota, or reads admin-only data.

#### Scenario: Unauthenticated request to an admin route
- **WHEN** a client without a valid session calls an admin route that mutates data or reads admin-only data
- **THEN** the system responds with 401 and performs no action

#### Scenario: Unauthenticated request to a quota-consuming route
- **WHEN** a client without a valid session calls a route that triggers a paid external API call (e.g. sentiment/topic analysis)
- **THEN** the system responds with 401 and does not call the external API

### Requirement: Survey response retrieval is scoped to the requesting user
The system SHALL only return survey response data belonging to the requesting user (by authenticated identity or anonymous session identity), never an arbitrary requested user ID.

#### Scenario: A client requests another user's survey responses
- **WHEN** a client requests survey responses for a `user_id` that does not match their own authenticated/session identity
- **THEN** the system responds with 403/404 and does not return the other user's data

#### Scenario: A client requests their own survey responses
- **WHEN** a client requests survey responses for their own identity
- **THEN** the system returns their data as before
