## 1. Client Manifest Cleanup

- [x] 1.1 Remove unused dependencies from `client/package.json`: `@emoji-mart/data`, `@emoji-mart/react`, `emoji-mart`, `@react-spring/web`, `chart.js`, `react-chartjs-2`, `cra-template`, `csv-loader`, `currency-converter-lt`, `fetch`, `file-saver`, `helmet`, `loglevel`, `papaparse`, `plotly.js`, `react-plotly.js`, `poppins`, `react-confirm-alert`, `react-number-format`, `react-virtualized-auto-sizer`, `react-window`, `request`, `save-svg-as-png`, `style-components`, `uuid`
- [x] 1.2 Regenerate `client/package-lock.json` so it matches the pruned manifest

## 2. Server Manifest Cleanup

- [x] 2.1 Remove unused dependencies from `server/package.json`: `@sendgrid/mail`, `cookie-session`, `events`, `path`
- [x] 2.2 Move `nodemon` from `dependencies` to `devDependencies` in `server/package.json`
- [x] 2.3 Regenerate `server/package-lock.json` so it matches the pruned manifest

## 3. Root Manifest Cleanup

- [x] 3.1 Remove `nodemon` from `dependencies` in the root `package.json` (the server manifest already provides it)
- [x] 3.2 Regenerate the root `package-lock.json` so it matches the pruned manifest

## 4. Verification

- [x] 4.1 Confirm no removed package is imported anywhere in `client/src/` or `server/` (re-run the import scan)
- [ ] 4.2 Run the client build (`npm run client:build`) to confirm no import resolution errors
- [x] 4.3 Run the server test suite (`npm test` in `server/`) to confirm nothing is broken
