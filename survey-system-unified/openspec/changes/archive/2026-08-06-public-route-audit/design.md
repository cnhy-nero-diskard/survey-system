## Context

The audit (`docs/audit-2026-08-05-phase-1-verification.md`, finding S5) found three routes in `server/routes/adminRoutes.js` that lack the `authenticate` middleware:

| Route | Line | Current middleware | Used by |
|-------|------|--------------------|---------|
| `GET /metrics` | 21 | none | No client code (monitoring infra) |
| `GET /api/surveytouchpoints` | 69 | none | Public survey flow + admin dashboard |
| `POST /api/touchpointlocal` | 70 | none | Public survey flow |

The existing `route-authorization` spec requires every admin/data-mutating route to require authentication. The `/metrics` endpoint exposes Prometheus operational metrics (request counts, latencies, resource usage) and should be admin-only. The two touchpoint endpoints serve the public survey flow — `SurveyRoutes.jsx` calls `/api/surveytouchpoints` when a user visits `/feedback?idx=...`, and `AccomodationFeedback.jsx` calls `/api/touchpointlocal` for localization. They are intentionally public but are registered in the admin route file, creating ambiguity.

## Goals / Non-Goals

**Goals:**
- Protect `/metrics` with `authenticate, authorizeAdmin` so only admins can read operational metrics.
- Move `/api/surveytouchpoints` and `/api/touchpointlocal` from `adminRoutes.js` to `clientRoutes.js` so the authorization boundary is unambiguous: everything in `adminRoutes.js` requires authentication, everything in `clientRoutes.js` is public.
- Keep all endpoint paths and HTTP methods unchanged — no breaking API changes.

**Non-Goals:**
- Adding authentication to the public survey flow itself (anonymous session handling is out of scope).
- Changing the controllers or services for touchpoint endpoints — only the route file registration changes.
- Restricting `/metrics` to a specific IP range or Docker-internal network (the `authenticate, authorizeAdmin` middleware is sufficient).
- Fixing other audit findings (S6 spam throttle, C1 relevance controller, etc.).

## Decisions

### Decision 1: Register `/metrics` in `adminRoutes.js` with admin auth (not `server.js`)

**Choice:** Keep `GET /metrics` in `adminRoutes.js` but add `authenticate, authorizeAdmin` middleware.

**Rationale:** The `/metrics` endpoint is already imported and registered in `adminRoutes.js` (line 21). Moving it to `server.js` would separate it from the route file that already imports `getMetrics` and the `authenticate`/`authorizeAdmin` middleware. Keeping it in `adminRoutes.js` with auth added is the smallest diff and keeps all admin-protected routes in one file.

**Alternatives considered:**
- *Register in `server.js` like `/api/log-stream`*: The log-stream endpoint is registered in `server.js` (line 93) because it uses SSE and needs to be mounted before the catch-all. `/metrics` has no such ordering constraint, so there's no reason to move it.
- *Restrict by IP/Docker network*: Over-engineered for this system. The admin JWT auth is sufficient and consistent with how all other admin routes are protected.

### Decision 2: Move touchpoint endpoints to `clientRoutes.js` (not create a new route file)

**Choice:** Move `GET /api/surveytouchpoints` and `POST /api/touchpointlocal` registrations from `adminRoutes.js` to `clientRoutes.js`.

**Rationale:** `clientRoutes.js` already contains all public survey-support endpoints (`/api/municipalities`, `/api/languageselect`, `/api/texts`, `/api/survey/progress`, etc.). The touchpoint endpoints are used by the same public survey flow and belong there. Creating a separate route file would add unnecessary complexity.

**Import changes in `clientRoutes.js`:** The controllers `fetchAllTouchpointsController` and `fetchTranslatedTouchpointController` are currently imported from `../controllers/adminController.js`. The import will be added to `clientRoutes.js`. No controller code changes are needed — the controllers are generic and don't depend on admin-specific middleware state.

**Alternatives considered:**
- *Leave touchpoint endpoints in `adminRoutes.js` but add a comment saying they're intentionally public*: This doesn't fix the structural problem. The spec requires all routes in `adminRoutes.js` to have `authenticate`. Leaving unauthenticated routes there violates the spec.
- *Create a separate `publicRoutes.js`*: Unnecessary — `clientRoutes.js` already serves this purpose.

### Decision 3: No controller or service changes

**Choice:** Do not modify `fetchAllTouchpointsController`, `fetchTranslatedTouchpointController`, or any service layer code.

**Rationale:** These controllers are self-contained — they read from the database and return JSON. They don't depend on `req.user` (admin identity) or any admin-specific middleware state. Moving the route registration from one file to another doesn't affect the controller's behavior.

## Risks / Trade-offs

- **[Risk] Admin dashboard component `SurveyTouchPoints.jsx` calls `/api/surveytouchpoints`** → The endpoint remains public and at the same path, so the admin dashboard component continues to work without changes. The admin component gets the same data as before; it just doesn't require authentication to access it (which was already the case before this change).
- **[Risk] `clientRoutes.js` imports from `adminController.js`** → This creates a cross-dependency where the client route file imports from the admin controller. This is acceptable because the controllers are generic functions, not admin-specific logic. The alternative (moving controllers to a shared file) is a larger refactor outside the scope of this change.
- **[Risk] Prometheus scraping breaks if scraper doesn't send admin credentials** → If an external monitoring system scrapes `/metrics`, it will now receive 401. Mitigation: update the scraper config to send the admin JWT cookie, or scrape from within the Docker network where the endpoint can be accessed via a sidecar. This is a deployment concern, not a code concern.