## Purpose

Ensure survey step navigation correctly enforces forward-progress guarding while allowing backward review, and that the step-guard logic itself is free of runtime errors.

## Requirements

### Requirement: Forward step-skipping is blocked
The system SHALL prevent navigation to a survey step ahead of the user's current recorded progress.

#### Scenario: User attempts to jump ahead
- **WHEN** a user navigates directly to a step URL with an index greater than their current recorded step
- **THEN** the system redirects them back to their current step

### Requirement: Backward navigation to a completed step is allowed
The system SHALL allow a user to revisit a previously completed step without being redirected.

#### Scenario: User navigates back to review a completed step
- **WHEN** a user navigates to a step URL with an index less than or equal to their current recorded step
- **THEN** the system allows the navigation without redirecting

### Requirement: Step-guard validation does not throw on its own logic
The system SHALL execute step-access validation without runtime errors caused by the guard's own code (as opposed to network/API failures).

#### Scenario: Guard evaluates a path with no parent segment
- **WHEN** the guard computes the parent path for a route during validation
- **THEN** the computation completes without throwing a reassignment or reference error
