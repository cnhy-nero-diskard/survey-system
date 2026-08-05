## Context

The survey system uses two cookie-backed auth mechanisms:

1. **Admin JWT cookie** (`token`) — set by `server/controllers/authController.js:32-38` with `httpOnly: true`, `secure` conditional on `NODE_ENV`, `sameSite: 'lax'`, and cleared on logout with the same attributes (`authController.js:60-65`).
2. **Anonymous survey session cookie** (`connect.sid`) — set by `express-session` in `server/server.js:73-87` with `secure` conditional on `NODE_ENV` but **no explicit `sameSite` attribute**.

The existing `session-and-transport-security` spec already requires "set `sameSite` explicitly," but the session cookie does not comply. Audit finding S4 (`docs/audit-2026-08-05-phase-1-verification.md`) flagged this as an incomplete fix: the JWT cookie was hardened in Phase 1, but the session cookie was missed. The app has never been deployed, so there is no live-user migration risk.

## Goals / Non-Goals

**Goals:**
- Make the express-session cookie explicitly set `sameSite` so it complies with the existing spec and matches the JWT cookie's posture.
- Tighten the spec so the requirement unambiguously covers **both** cookies and requires a consistent `sameSite` value, preventing this gap from recurring.

**Non-Goals:**
- Changing the JWT cookie — it already sets `sameSite: 'lax'` and clears correctly.
- Changing CORS configuration — that is already fail-closed (`server.js:57`).
- Introducing CSRF middleware — CSRF was deliberately resolved by removal in Phase 1 (audit 4.3); `sameSite: 'lax'` is the chosen CSRF mitigation.
- Changing the session store, secret, or maxAge — only the `sameSite` attribute is added.
- Client-side changes — the cookie is `httpOnly` and server-managed; no client code touches it.

## Decisions

### Decision 1: Use `sameSite: 'lax'` for the session cookie

**Choice:** Set `sameSite: 'lax'` on the express-session cookie config.

**Rationale:** `lax` is the same value the JWT cookie already uses, so both auth cookies will have a consistent posture. `lax` blocks cross-site POST requests with the cookie (the primary CSRF vector for state-changing actions) while still allowing the cookie to be sent on top-level cross-site navigations (GET). This is the correct trade-off for a survey app where anonymous users arrive via links and need their session cookie to be present on the initial GET.

**Alternatives considered:**
- `sameSite: 'strict'` — would prevent the session cookie from being sent on top-level navigations from external sites (e.g., a user clicking a survey link from a partner site). This would break the anonymous survey flow for inbound traffic. Rejected.
- `sameSite: 'none'` — would allow the cookie on all cross-site requests, requiring `secure: true` always and reintroducing CSRF risk. Rejected; no cross-site use case justifies it.
- Omitting `sameSite` (status quo) — relies on browser defaults, which vary (`Lax` in modern Chrome/Firefox, `None` in older browsers). Rejected; the spec requires explicitness.

### Decision 2: Tighten the spec to cover both cookies explicitly

**Choice:** Modify the "Session cookies are environment-appropriate and consistent" requirement to explicitly name both the express-session cookie and the JWT token cookie, require a consistent `sameSite` value across them, and add a scenario that asserts the session cookie specifically.

**Rationale:** The original requirement said "set `sameSite` explicitly" but was read as satisfied by the JWT cookie alone. Making the requirement enumerate the cookies and require consistency closes the interpretation gap that caused S4.

## Risks / Trade-offs

- **[Risk] `lax` allows top-level cross-site GET with the session cookie** → Mitigation: State-changing survey actions are POSTs, which `lax` blocks cross-site. The anonymous session is low-sensitivity (no PII, no auth elevation). Acceptable.
- **[Risk] Older browsers that don't support `sameSite` may ignore the attribute** → Mitigation: The app targets modern browsers (React 18 CRA build). The `secure` flag already excludes non-HTTPS contexts. Acceptable residual.
- **[Risk] Spec tightening could be seen as over-specification** → Mitigation: The audit proved the original wording was ambiguous enough to miss the session cookie. Explicit enumeration is the corrective.