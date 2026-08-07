## Purpose

Ensure the Hugging Face query service retries bounded model-loading waits without falling into unbounded recursion, and retries only the model-loading condition.

## Requirements

### Requirement: Bounded retry on model loading
The Hugging Face query service SHALL retry a request when the model returns a `503 Service Unavailable` error indicating the model is still loading, and SHALL stop retrying after a finite maximum number of retries.

#### Scenario: Model loads within retry limit
- **WHEN** a Hugging Face model query returns `503 Service Unavailable` and the model becomes available before the maximum retry count is reached
- **THEN** the service waits for the estimated loading time and retries the request
- **AND** the service returns the successful model response to the caller

#### Scenario: Model never becomes available
- **WHEN** a Hugging Face model query repeatedly returns `503 Service Unavailable` and the maximum retry count is reached
- **THEN** the service stops retrying
- **AND** the service throws an error indicating the retry limit was reached

### Requirement: Retry limit is configurable
The Hugging Face query service SHALL accept a configurable maximum retry count so the retry behavior can be tuned without code changes.

#### Scenario: Custom retry limit provided
- **WHEN** a caller invokes the Hugging Face query service with a custom maximum retry count
- **THEN** the service uses that custom limit instead of the default
- **AND** the service stops retrying once that custom limit is reached

#### Scenario: Default retry limit used
- **WHEN** a caller invokes the Hugging Face query service without specifying a maximum retry count
- **THEN** the service uses a sensible default retry limit
- **AND** the service stops retrying once the default limit is reached

### Requirement: Non-loading errors are not retried
The Hugging Face query service SHALL NOT retry errors other than the model-loading `503 Service Unavailable` condition.

#### Scenario: Other error returned
- **WHEN** a Hugging Face model query returns an error that is not the model-loading `503 Service Unavailable` condition
- **THEN** the service does not retry the request
- **AND** the service throws the error to the caller

#### Scenario: Network failure
- **WHEN** a Hugging Face model query fails due to a network or fetch error
- **THEN** the service does not retry the request
- **AND** the service throws the error to the caller
