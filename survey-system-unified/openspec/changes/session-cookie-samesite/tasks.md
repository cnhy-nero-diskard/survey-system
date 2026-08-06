## 1. Server implementation

- [x] 1.1 Add `sameSite: 'lax'` to the express-session `cookie` config in `server/server.js` (the `session({...})` block at lines 73-87), so the `connect.sid` cookie carries an explicit `sameSite` matching the JWT cookie's value
- [x] 1.2 Verify the admin JWT cookie in `server/controllers/authController.js` already sets `sameSite: 'lax'` on both set (login) and clear (logout) — no change expected, confirm consistency

## 2. Verification

- [x] 2.1 Start the server and make a request that creates an anonymous session; inspect the `Set-Cookie` response header for `connect.sid` and confirm it contains `SameSite=Lax`
- [x] 2.2 Log in as admin and inspect the `Set-Cookie` response header for `token`; confirm it still contains `SameSite=Lax` (regression check)
- [x] 2.3 Log out and confirm the `token` cookie is cleared with `SameSite=Lax` attributes (regression check)
