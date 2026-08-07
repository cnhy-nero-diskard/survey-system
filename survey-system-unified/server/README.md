# Server

Node.js/Express backend for the Survey System — the `server` half of
[survey-system-unified](../README.md). See the [root README](../../README.md#-api-documentation)
for the full API surface and the [project docs](../docs/) for operating
guidelines.

## Stack

- Express 4, ES modules (`"type": "module"`)
- PostgreSQL via `pg`, connection pooling in `config/db.js`
- Session-based anonymous survey auth (`express-session` + `connect-pg-simple`) alongside JWT admin auth
- Winston logging, Helmet, rate limiting

## Running

From `survey-system-unified/`:

```bash
npm run server:install   # cd server && npm install
npm run server:dev       # nodemon, port from .env (default 5000)
npm run server:start     # production
```

Or directly from this directory: `npm install`, then `npm run dev` / `npm start`.

## Testing

```bash
npm test   # Jest, from this directory or via the root's npm test
```

## Configuration

See [../.env.example](../.env.example) for required environment variables;
[../README.md#-configuration](../README.md#-configuration) documents each
one, including secret rotation effects.

## Database schema

The schema template lives at [db/schema/db_template_survey.sql](db/schema/db_template_survey.sql).
