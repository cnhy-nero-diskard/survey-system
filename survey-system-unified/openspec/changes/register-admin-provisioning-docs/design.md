## Context

The survey-system-unified server has an admin account provisioning endpoint at `POST /api/auth/register-admin` (`server/routes/authRoutes.js:11`). Unlike every other admin/data-mutating route, it is not protected by the `authenticate` session middleware. Instead, it is protected by `verifyHMAC` (`server/middleware/hmacMiddleware.js`), which validates an `x-hmac-signature` header computed from the request body using `HMAC_SECRET`.

The endpoint handler `registerAdmin` (`server/controllers/authController.js:70-100`) hashes the supplied password with bcrypt (10 salt rounds) and inserts a row into `admin_table` (`username`, `e_password`, `gmail`). The `admin_table` schema (`context/db_template_survey.sql:392-402`) stores `id`, `username`, `gmail`, `e_password`, `last_login`, `last_logout`, `session_duration`, `is_logged_in`, and `role`.

A repo-wide search of `client/src` confirmed no frontend code calls this endpoint or computes an HMAC signature. The maintainer confirmed (2026-08-05, recorded in `docs/audit-2026-08-05-phase-1-verification.md` finding S1) that this is intentional: the endpoint is a "max security" API-only provisioning tool, deliberately kept out of the app UI. Direct DB manipulation cannot produce a usable login because `login` (`authController.js:20`) uses `bcrypt.compare`.

The existing `route-authorization` spec requires "a valid authenticated session on every admin route that mutates data." The provisioning endpoint appears to violate this, but it is a deliberate bootstrap exception — you cannot require an admin session to create the first admin account. This design documents the exception and the workflow so it is not mistaken for an oversight.

The `env-config-truth` change (in progress) handles `HMAC_SECRET` startup validation. This change documents the workflow that depends on that secret.

## Goals / Non-Goals

**Goals:**
- Document the HMAC-based admin provisioning workflow as a spec'd capability so the endpoint contract, trust model, and operational steps are discoverable.
- Create an operator-facing runbook (`docs/admin-provisioning.md`) with step-by-step instructions for provisioning a new admin account, including how to compute the HMAC signature.
- Resolve the apparent `route-authorization` violation by adding an explicit, spec'd exception for the provisioning endpoint.
- Make the trust model explicit: the endpoint's security depends entirely on `HMAC_SECRET` staying secret, and the runbook must state this.

**Non-Goals:**
- Changing the runtime behavior of `registerAdmin`, `verifyHMAC`, or the route wiring — the code already works as designed.
- Adding a second auth factor to the provisioning endpoint (the audit suggested this as optional; it is out of scope for this documentation change).
- Validating `HMAC_SECRET` at startup — that is owned by the `env-config-truth` change.
- Adding a UI for admin provisioning — the endpoint is intentionally API-only.
- Modifying the `admin_table` schema or the bcrypt hashing parameters.

## Decisions

### Decision 1: Document the workflow in a spec + runbook, not in code comments

**Choice:** Create a new `admin-provisioning` spec (`specs/admin-provisioning/spec.md`) defining the endpoint contract and trust model, plus an operator-facing runbook (`docs/admin-provisioning.md`) with concrete provisioning steps.

**Rationale:** Specs are the project's source of truth for behavioral contracts and are reviewed during audits. A runbook gives operators copy-pasteable steps without requiring them to read source code. Code comments alone are insufficient because they are not discoverable by operators and are not part of the spec review cycle.

**Alternatives considered:**
- *Document only in `AI_AGENT_README.md`.* Rejected — the README is a general project overview; provisioning is an operational workflow that deserves its own document.
- *Document only in the spec.* Rejected — specs define what the system SHALL do, not how an operator performs a task. The runbook bridges that gap.

### Decision 2: The provisioning endpoint is a spec'd exception to `route-authorization`

**Choice:** Modify the `route-authorization` spec to add an explicit exception: the admin provisioning endpoint is authenticated by HMAC signature, not a session cookie, because it bootstraps the first admin account.

**Rationale:** Without this exception, the provisioning endpoint is a permanent violation of the `route-authorization` spec. Audits will keep flagging it. Making it a spec'd exception turns an apparent bug into a documented design decision.

**Alternatives considered:**
- *Leave `route-authorization` unchanged and rely on the new `admin-provisioning` spec to explain the exception.* Rejected — the violation is in `route-authorization`'s requirement text, so the exception must be visible there to prevent future confusion.
- *Move the provisioning route to a separate router file.* Rejected — the route's location is not the problem; the spec gap is.

### Decision 3: The runbook includes an HMAC signature computation example

**Choice:** The runbook (`docs/admin-provisioning.md`) includes a worked example of computing the HMAC-SHA256 signature over the JSON request body using `HMAC_SECRET`, so an operator can provision an admin with `curl` or a script without reverse-engineering the middleware.

**Rationale:** `verifyHMAC` (`hmacMiddleware.js:24`) computes `CryptoJS.HmacSHA256(payload, HMAC_SECRET)` where `payload` is `JSON.stringify(req.body)`. An operator who does not know this cannot use the endpoint. The runbook must make the signature computation explicit.

**Alternatives considered:**
- *Provide a helper script (e.g., `scripts/provision-admin.sh`).* Considered but deferred — the runbook with a `curl` example is sufficient for a never-deployed system. A script can be added later if the team wants repeatable automation.

### Decision 4: The spec requires the endpoint to remain API-only (no UI)

**Choice:** The `admin-provisioning` spec includes a requirement that no client-side code SHALL call the provisioning endpoint or expose a UI for it.

**Rationale:** The maintainer's design intent is that provisioning is a deliberate, out-of-band action requiring the `HMAC_SECRET`. A UI would lower the barrier and defeat the "max security" posture. Codifying this prevents a future developer from accidentally wiring up a registration form.

**Alternatives considered:**
- *Leave the no-UI constraint as maintainer tribal knowledge.* Rejected — tribal knowledge is lost over time; the spec makes it enforceable.

## Risks / Trade-offs

- **[HMAC_SECRET is a single point of failure]** → If `HMAC_SECRET` leaks, anyone can mint admin accounts. Mitigation: the runbook states this trust model explicitly, the `env-config-truth` change validates the secret at startup, and the spec requires the secret to be treated as a root credential. A second auth factor is explicitly out of scope but noted as a future option.
- **[Documentation-only change has no runtime test]** → Unlike code changes, this change cannot be verified by running the server. Mitigation: the tasks include a verification step that confirms the runbook's HMAC example produces a signature accepted by `verifyHMAC`, and that the spec delta resolves the `route-authorization` violation.
- **[Runbook can drift from code]** → If `registerAdmin` or `verifyHMAC` changes, the runbook may become stale. Mitigation: the spec's scenarios reference the endpoint contract (`POST /api/auth/register-admin`, `x-hmac-signature` header, bcrypt hashing), so any change to the contract should trigger a spec/runbook review.
- **[Spec exception could be over-generalized]** → Future developers might read the `route-authorization` exception as "HMAC is an acceptable substitute for session auth on any route." Mitigation: the exception text is scoped specifically to the admin provisioning endpoint, not a general pattern.