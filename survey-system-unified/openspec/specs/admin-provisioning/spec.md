## Purpose

Define the contract for the HMAC-authenticated, API-only admin provisioning endpoint and its operator runbook, including the trust model for `HMAC_SECRET`.

## Requirements

### Requirement: Admin provisioning endpoint contract
The system SHALL provide an API-only endpoint at `POST /api/auth/register-admin` that creates a new admin account. The endpoint SHALL accept a JSON body containing `username`, `password`, and `email`, hash the password with bcrypt before storage, and insert the record into `admin_table`. The endpoint SHALL NOT be callable from the application UI.

#### Scenario: A valid provisioning request is sent
- **WHEN** a request is sent to `POST /api/auth/register-admin` with a valid `x-hmac-signature` header and a JSON body containing `username`, `password`, and `email`
- **THEN** the system hashes the password with bcrypt, inserts a new row into `admin_table`, and responds with a success message

#### Scenario: A provisioning request is sent without an HMAC signature
- **WHEN** a request is sent to `POST /api/auth/register-admin` without an `x-hmac-signature` header or with an invalid signature
- **THEN** the system responds with 403 and does not insert any row into `admin_table`

#### Scenario: A developer searches the client code for admin registration
- **WHEN** a developer searches `client/src` for calls to `/api/auth/register-admin` or HMAC signature computation
- **THEN** they find no client-side code that calls the provisioning endpoint or exposes a UI for it

### Requirement: HMAC signature verification for provisioning
The system SHALL verify the admin provisioning request by computing `HmacSHA256(JSON.stringify(req.body), HMAC_SECRET)` and comparing it to the `x-hmac-signature` header using a timing-safe comparison. The system SHALL NOT log the raw request payload, which contains plaintext credentials.

#### Scenario: A request with a correct HMAC signature
- **WHEN** the `x-hmac-signature` header matches the HMAC computed over the request body using `HMAC_SECRET`
- **THEN** the request proceeds to the `registerAdmin` handler

#### Scenario: A request with a tampered body but original signature
- **WHEN** the request body is modified after the signature was computed so the recomputed HMAC no longer matches the `x-hmac-signature` header
- **THEN** the system responds with 403 and does not proceed to the handler

#### Scenario: The provisioning request is logged
- **WHEN** the HMAC middleware or `registerAdmin` handler executes a logging call
- **THEN** the password field and raw request body are not written to any log output

### Requirement: Admin provisioning runbook
The system SHALL include an operator-facing runbook document (e.g., `docs/admin-provisioning.md`) that describes the HMAC-based provisioning workflow, the `HMAC_SECRET` trust model, and step-by-step instructions for computing the signature and calling the endpoint.

#### Scenario: An operator needs to provision a new admin account
- **WHEN** an operator needs to create a new admin and does not have access to the source code
- **THEN** they can follow the runbook to compute the HMAC signature and call `POST /api/auth/register-admin` with `curl` or a script

#### Scenario: A reviewer audits the provisioning trust model
- **WHEN** a security reviewer examines the provisioning endpoint
- **THEN** the runbook explicitly states that the endpoint's security depends entirely on `HMAC_SECRET` remaining secret and that the secret must be treated as a root credential

### Requirement: Provisioning endpoint is exempt from session authentication
The admin provisioning endpoint SHALL be authenticated by HMAC signature, not by the `authenticate` session middleware, because it exists to bootstrap the first admin account and cannot require a pre-existing admin session. This is the only route exempt from session-based `authenticate` middleware for data-mutating admin operations.

#### Scenario: The provisioning route is reviewed against route-authorization
- **WHEN** a reviewer checks whether `POST /api/auth/register-admin` is behind `authenticate`
- **THEN** they find it is behind `verifyHMAC` instead, and the `route-authorization` spec documents this as an intentional exception for the provisioning endpoint only
