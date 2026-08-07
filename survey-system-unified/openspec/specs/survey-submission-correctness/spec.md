## Purpose

Ensure survey submission and admin survey-response creation are correct: no reference errors, atomic batch updates for sentiment analysis, a single unambiguous submission route, and no double-response bugs on partial batch failures.

## Requirements

### Requirement: Admin survey-response creation works
The system SHALL successfully create a survey response via the admin endpoint without throwing a reference error.

#### Scenario: Admin creates a survey response
- **WHEN** an authenticated admin calls `POST /api/admin/survey-responses` with a valid payload
- **THEN** the system creates the record and returns a success response, without a `ReferenceError`

### Requirement: Sentiment-analysis batch updates are atomic
The system SHALL apply all-or-nothing semantics to the batch of updates performed during auto sentiment analysis.

#### Scenario: A batch update partially fails
- **WHEN** one statement in the sentiment-analysis batch fails partway through
- **THEN** all statements in that batch are rolled back, leaving both affected tables consistent

### Requirement: Survey submission has exactly one route contract
The system SHALL expose exactly one reachable registration of the survey-submission endpoint, with one unambiguous request contract.

#### Scenario: Client submits a survey response
- **WHEN** a client calls `POST /api/survey/submit`
- **THEN** exactly one route handler processes it, using one documented request shape

### Requirement: Survey submission never double-responds
The system SHALL send at most one HTTP response per survey-submission request, even when multiple items in a batch fail.

#### Scenario: Multiple items in a submitted batch fail validation
- **WHEN** more than one item in a submitted survey-response array fails
- **THEN** the system sends exactly one response and does not attempt to set headers after a response has already been sent
