## Why

A second round of dependency auditing found that the package manifests still list many packages that are never imported, including a typo package (`style-components`), npm shims for Node built-ins (`path`, `events`), duplicate animation/emoji packages, and dev tools (`nodemon`) placed in `dependencies`. These bloat installs, increase the attack surface, and confuse maintainers.

## What Changes

- Remove unused client dependencies: `@emoji-mart/data`, `@emoji-mart/react`, `emoji-mart`, `@react-spring/web` (duplicate of `react-spring`), `chart.js`, `react-chartjs-2`, `cra-template`, `csv-loader`, `currency-converter-lt`, `fetch`, `file-saver`, `helmet`, `loglevel`, `papaparse`, `plotly.js`, `react-plotly.js`, `poppins`, `react-confirm-alert`, `react-number-format`, `react-virtualized-auto-sizer`, `react-window`, `request`, `save-svg-as-png`, `style-components`, `uuid`.
- Remove unused server dependencies: `@sendgrid/mail`, `cookie-session`, `events` (npm shim; Node built-in is used), `path` (npm shim; Node built-in is used).
- Move `nodemon` from `dependencies` to `devDependencies` in `server/package.json`; remove the duplicate `nodemon` from the root `package.json` `dependencies` (the server manifest already provides it).
- Keep `react-spring` (the package actually imported) and remove only its unused `@react-spring/web` duplicate.

## Capabilities

### New Capabilities
<!-- No new capabilities introduced; this is a continuation of existing dependency hygiene work. -->

### Modified Capabilities
- `dependency-hygiene`: Extend the "Package manifests contain only used dependencies" requirement to explicitly cover (a) npm shims that duplicate Node.js built-in modules, (b) duplicate packages providing the same API, and (c) dev-only tooling placed in `dependencies` instead of `devDependencies`.

## Impact

- `client/package.json` — remove 25 unused dependencies.
- `server/package.json` — remove 4 unused dependencies; move `nodemon` to `devDependencies`.
- `package.json` (root) — remove `nodemon` from `dependencies`.
- `client/package-lock.json`, `server/package-lock.json`, `package-lock.json` — regenerate after manifest edits.
- No runtime code changes; all removed packages have zero imports in the corresponding source trees.