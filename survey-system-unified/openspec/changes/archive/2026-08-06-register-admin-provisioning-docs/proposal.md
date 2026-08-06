## Why

The admin account provisioning endpoint (`POST /api/auth/register-admin`) is an intentional, API-only workflow protected by an HMAC signature rather than a normal admin session. This design decision is maintainer-confirmed but completely undocumented — a new developer or operator cannot discover how to provision an admin account, what the HMAC workflow is, or why the endpoint is deliberately kept out of the app UI. The audit (`docs/audit-2026-08-05-phase-1-verification.md`, finding S1) flagged this as a residual risk: the endpoint's security depends entirely on `HMAC_SECRET` staying secret, and the workflow must be documented so operators understand the trust model and the operational steps.

## What Changes

- Document the HMAC-based admin provisioning workflow as a first-class spec'd capability, covering the endpoint contract, the HMAC signature verification, the bcrypt password hashing, and the API-only (no UI) constraint.
- Add a spec requirement that the provisioning endpoint SHALL remain outside the authenticated admin route surface — it is bootstrapped by an HMAC signature, not a session, because it exists to create the first admin account.
- Add a spec requirement that the provisioning workflow SHALL be documented in an operator-facing runbook (e.g., `docs/`) so the steps to provision a new admin are discoverable without reading source code.
- Modify the `route-authorization` spec to carve out the provisioning endpoint: it is intentionally not behind `authenticate` (it is behind `verifyHMAC`), and this is a spec-level exception, not an oversight.

## Capabilities

### New Capabilities
- `admin-provisioning`: The HMAC-based, API-only workflow for creating admin accounts — endpoint contract, signature verification, password hashing, and the operational runbook for provisioning.

### Modified Capabilities
- `route-authorization`: Add an explicit exception for the admin provisioning endpoint, which is authenticated by HMAC signature rather than a session cookie, resolving the apparent violation of "all admin/data-mutating routes require authentication."

## Impact

- **Specs**: New `admin-provisioning` spec; delta to `route-authorization` spec.
- **Docs**: New operator-facing provisioning runbook (e.g., `docs/admin-provisioning.md`) documenting the HMAC workflow, the `HMAC_SECRET` trust model, and step-by-step provisioning instructions.
- **Code**: No runtime code changes in this change — the endpoint and middleware already exist and behave correctly. The `env-config-truth` change handles `HMAC_SECRET` startup validation; this change documents the workflow that depends on it.
- **No API or DB schema changes**; this is a documentation and spec-layer change.