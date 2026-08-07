# Client

React frontend for the Survey System — the `client` half of
[survey-system-unified](../README.md), bootstrapped with
[Create React App](https://github.com/facebook/create-react-app). See the
[root README](../../README.md) for the project's feature list and deployment
options.

## Client environment safety

Every `REACT_APP_*` value is compiled into the published browser bundle and
can be read by end users. Never put secrets, tokens, passwords, private keys,
credentials, or API keys in `client/.env` or any other client environment file.
The prebuild and prestart checks reject secret-like variable names.

## Stack

React 18, React Router v6, Material-UI, styled-components, Axios, Chart.js /
Plotly.js for visualizations. Multi-step survey forms with conditional
routing (see `src/routes/`), an admin dashboard, and multilingual content.

## Running

From `survey-system-unified/`:

```bash
npm run client:install   # cd client && npm install
npm run client:dev       # dev server on :3000
npm run client:build     # production build to client/build/
```

Or directly from this directory: `npm install`, then `npm start` / `npm run build`.

In development, `REACT_APP_API_HOST` (default `http://localhost:5000`)
controls where API calls go; in the unified production build, API calls use
relative paths against the same server.

## Testing

```bash
npm test -- --watchAll=false
```

There are currently no tests in `src/` — see `CONTRIBUTING.md` at the repo
root if you're adding the first one.
