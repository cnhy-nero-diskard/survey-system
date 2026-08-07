## ADDED Requirements

### Requirement: Exactly one frontend auth-gating pattern exists
The system SHALL contain only the auth-gating implementation that is actually wired into the app's routes; it SHALL NOT retain a dead component implementing a different, unused auth pattern.

#### Scenario: A developer looks for how admin routes are protected
- **WHEN** a developer searches the codebase for admin route protection
- **THEN** they find exactly one pattern (the cookie-based one in active use), with no unreferenced alternative implementation to mislead them
