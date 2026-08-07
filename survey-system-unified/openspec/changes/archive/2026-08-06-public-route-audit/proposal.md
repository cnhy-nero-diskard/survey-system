## Why

The audit (`docs/audit-2026-08-05-phase-1-verification.md`, finding S5) identified three routes in `adminRoutes.js` that lack the `authenticate` middleware: `/metrics`, `/api/surveytouchpoints`, and `/api/touchpointlocal`. The existing `route-authorization` spec requires every admin/data-mutating route to require authentication, but these routes are unguarded. `/metrics` exposes Prometheus operational metrics to anyone; the two touchpoint endpoints are used by the public survey flow but live in the admin route file, creating ambiguity about whether they are intentionally public or are an oversight. This change closes the gap: protect the metrics endpoint and relocate the touchpoint endpoints to the public route file so the authorization boundary is unambiguous.

## What Changes

- **Protect `/metrics` with admin authentication**: Add `authenticate, authorizeAdmin` to the `/metrics` route so only authenticated admins can read Prometheus operational metrics.
- **Move `/api/surveytouchpoints` and `/api/touchpointlocal` from `adminRoutes.js` to `clientRoutes.js`**: These endpoints serve the public survey flow (`SurveyRoutes.jsx` and `AccomodationFeedback.jsx`) and must remain public. Relocating them out of the admin route file makes the authorization boundary explicit — everything in `adminRoutes.js` requires authentication, everything in `clientRoutes.js` is public.
- **Remove the two touchpoint route registrations from `adminRoutes.js`** and register them in `clientRoutes.js` instead. No controller or service changes are needed — only the route file that mounts them changes.
- **Update the `route-authorization` spec** to add a requirement that operational/monitoring endpoints (e.g. Prometheus metrics) require admin authentication, and to clarify that public survey-support endpoints (touchpoint lookup, localization) are intentionally public and live in the client route file.

## Capabilities

### New Capabilities

_None — no new capability is introduced._

### Modified Capabilities

- `route-authorization`: Add a requirement that operational/monitoring endpoints require admin authentication, and clarify the boundary between admin routes (all authenticated) and public client routes (survey-support endpoints are intentionally public).

## Impact

- **`server/routes/adminRoutes.js`**: Remove the `/metrics`, `/api/surveytouchpoints`, and `/api/touchpointlocal` route registrations; add `authenticate, authorizeAdmin` to `/metrics` when it is re-registered (either in `adminRoutes.js` or in `server.js`).
- **`server/routes/clientRoutes.js`**: Add the `/api/surveytouchpoints` and `/api/touchpointlocal` route registrations (public, no `authenticate`).
- **`server/server.js`** or **`server/routes/adminRoutes.js`**: Re-register `/metrics` with `authenticate, authorizeAdmin`.
- **`openspec/specs/route-authorization/spec.md`**: Add a requirement for operational/monitoring endpoint protection; clarify the admin-vs-public route boundary.
- **No client-side changes**: The client already calls these endpoints with `withCredentials: true`; the touchpoint endpoints remain public, and `/metrics` is not called by client code.
- **No breaking API changes**: All endpoint paths and HTTP methods remain the same; only the middleware and route file placement change.