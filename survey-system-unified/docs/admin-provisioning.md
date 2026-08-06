# Admin Provisioning

This runbook documents the API-only workflow for creating an admin account with `POST /api/auth/register-admin`.

## Endpoint Contract

- Method: `POST`
- Path: `/api/auth/register-admin`
- Required header: `x-hmac-signature`
- Body type: JSON
- Required body fields:
  - `username`
  - `password`
  - `email`

The server verifies the HMAC signature before it runs the provisioning handler. When the signature is valid, the handler hashes `password` with bcrypt using 10 salt rounds and stores the resulting hash in `admin_table.e_password` with the supplied `username` and `email`.

## Trust Model

The endpoint's security depends entirely on `HMAC_SECRET` remaining secret. Treat `HMAC_SECRET` as a root credential: anyone who can read it can compute a valid `x-hmac-signature` and create admin accounts.

Do not send `HMAC_SECRET` to browsers, commit it to source control, paste it in issue trackers, or share it in chat. Rotate it if exposure is suspected.

Direct database manipulation cannot produce a usable login unless the stored password value is a valid bcrypt hash. The login flow compares the submitted password with `admin_table.e_password` using bcrypt, so inserting a plaintext password into the database will not work.

## No UI

This endpoint is intentionally API-only. No frontend code should call `/api/auth/register-admin`, compute an HMAC signature, or expose an admin registration form. Provisioning is an out-of-band operator action that requires access to `HMAC_SECRET`.

## Provision An Admin

Set the API base URL, secret, and exact JSON body. The HMAC payload must be the same string the server verifies: `JSON.stringify(req.body)`.

```bash
API_BASE_URL="https://example.com"
HMAC_SECRET="replace-with-production-secret"
BODY='{"username":"admin","password":"replace-with-strong-password","email":"admin@example.com"}'
```

Compute the signature with `HmacSHA256(JSON.stringify(body), HMAC_SECRET)`. In Node.js, this means parsing and re-stringifying the body before signing so the payload matches the Express-parsed body order and formatting.

```bash
SIGNATURE=$(node -e "const CryptoJS = require('crypto-js'); const body = JSON.parse(process.env.BODY); const payload = JSON.stringify(body); console.log(CryptoJS.HmacSHA256(payload, process.env.HMAC_SECRET).toString(CryptoJS.enc.Hex));")
```

Call the endpoint with the JSON body and signature.

```bash
curl -X POST "$API_BASE_URL/api/auth/register-admin" \
  -H "Content-Type: application/json" \
  -H "x-hmac-signature: $SIGNATURE" \
  --data "$BODY"
```

On success, the API returns a message like:

```text
Admin successfully registered with username: admin
```

If the signature is missing or invalid, the API returns `403` and does not create an admin account.
