## 1. Protect the `/metrics` endpoint

- [ ] 1.1 In `server/routes/adminRoutes.js`, change `router.get('/metrics', getMetrics)` to `router.get('/metrics', authenticate, authorizeAdmin, getMetrics)` so the Prometheus metrics endpoint requires admin authentication.

## 2. Move touchpoint endpoints to `clientRoutes.js`

- [ ] 2.1 In `server/routes/adminRoutes.js`, remove the line `router.get('/api/surveytouchpoints', fetchAllTouchpointsController)` (line 69).
- [ ] 2.2 In `server/routes/adminRoutes.js`, remove the line `router.post('/api/touchpointlocal', fetchTranslatedTouchpointController)` (line 70).
- [ ] 2.3 In `server/routes/clientRoutes.js`, add `fetchAllTouchpointsController` and `fetchTranslatedTouchpointController` to the import from `../controllers/adminController.js`.
- [ ] 2.4 In `server/routes/clientRoutes.js`, register `router.get('/api/surveytouchpoints', fetchAllTouchpointsController)` and `router.post('/api/touchpointlocal', fetchTranslatedTouchpointController)` as public routes (no `authenticate` middleware).

## 3. Verify route authorization boundary

- [ ] 3.1 Confirm every route registration in `adminRoutes.js` includes the `authenticate` middleware — no unauthenticated routes remain.
- [ ] 3.2 Confirm `/api/surveytouchpoints` and `/api/touchpointlocal` are accessible without admin authentication (public survey flow still works).
- [ ] 3.3 Confirm `GET /metrics` returns 401 without an admin session and returns metrics with an admin session.