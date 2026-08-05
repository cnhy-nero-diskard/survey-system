## 1. Operator Runbook

- [ ] 1.1 Create `docs/admin-provisioning.md` documenting the admin provisioning workflow: endpoint contract (`POST /api/auth/register-admin`, JSON body with `username`/`password`/`email`), the `x-hmac-signature` header requirement, and the bcrypt password hashing behavior
- [ ] 1.2 Add an HMAC signature computation example to the runbook showing how to compute `HmacSHA256(JSON.stringify(body), HMAC_SECRET)` (matching `server/middleware/hmacMiddleware.js:24`) with a `curl` invocation
- [ ] 1.3 Add a "Trust Model" section to the runbook stating that the endpoint's security depends entirely on `HMAC_SECRET` remaining secret, that the secret must be treated as a root credential, and that direct DB manipulation cannot produce a usable login (bcrypt)
- [ ] 1.4 Add a "No UI" note to the runbook stating the endpoint is intentionally API-only and no frontend code calls it

## 2. Spec Verification

- [ ] 2.1 Verify the `admin-provisioning` spec (`specs/admin-provisioning/spec.md`) accurately describes the existing endpoint behavior by comparing each scenario against `server/controllers/authController.js:70-100` and `server/middleware/hmacMiddleware.js`
- [ ] 2.2 Verify the `route-authorization` delta spec resolves the apparent violation for `POST /api/auth/register-admin` by confirming the exception text is scoped to the provisioning endpoint only
- [ ] 2.3 Run `openspec validate --change "register-admin-provisioning-docs"` (or equivalent) to confirm all artifacts are well-formed and apply-ready

## 3. Cross-Check Against Code

- [ ] 3.1 Confirm no `client/src` code calls `/api/auth/register-admin` or computes an HMAC signature (grep `client/src` for `register-admin`, `x-hmac-signature`, `HmacSHA256`, `HMAC_SECRET`)
- [ ] 3.2 Confirm the runbook's HMAC example produces a signature that `verifyHMAC` would accept (the `payload` must be `JSON.stringify(req.body)` with the same key order Express produces)