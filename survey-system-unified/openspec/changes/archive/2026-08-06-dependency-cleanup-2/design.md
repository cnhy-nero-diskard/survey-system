## Context

The repository has three package manifests: root `package.json`, `server/package.json`, and `client/package.json`. A source-tree audit (searching `client/src/` and `server/`) found that a number of listed dependencies are never imported. These fall into distinct categories:

- **Typo / mistaken packages**: `style-components` (vs the real `styled-components`), `poppins` (the real font is `@fontsource/poppins`).
- **npm shims for Node built-ins**: `path` and `events` in `server/package.json` — the source `import path from 'path'` and `import { EventEmitter } from 'events'` resolve to Node's built-in modules, not these npm packages.
- **Duplicate packages providing the same API**: `@react-spring/web` (the code imports `react-spring`), and `emoji-mart`/`@emoji-mart/data`/`@emoji-mart/react` (none imported).
- **Deprecated/unmaintained and unused**: `request`, `fetch`, `helmet` (server-side package listed in client), `cra-template`, `csv-loader`, `currency-converter-lt`, `file-saver`, `loglevel`, `papaparse`, `plotly.js`, `react-plotly.js`, `react-chartjs-2`, `chart.js`, `react-confirm-alert`, `react-number-format`, `react-virtualized-auto-sizer`, `react-window`, `save-svg-as-png`, `uuid`, `@sendgrid/mail`, `cookie-session`.
- **Dev tooling in `dependencies`**: `nodemon` in both root and server `dependencies`.

The existing `dependency-hygiene` spec already requires "Package manifests contain only used dependencies"; this change extends that requirement's coverage and executes the cleanup.

## Goals / Non-Goals

**Goals:**
- Remove every listed dependency with zero imports in its corresponding source tree.
- Move `nodemon` to `devDependencies` where it is actually used by a dev script.
- Remove npm shims that duplicate Node.js built-in modules.
- Remove duplicate packages that provide the same API as a kept package.
- Regenerate lockfiles so they stay consistent with the manifests.

**Non-Goals:**
- Not changing any runtime code or import statements (all removed packages are unused).
- Not adding or upgrading any dependencies.
- Not refactoring code that happens to import a kept package.
- Not auditing transitive/indirect dependencies (only direct manifest entries).

## Decisions

### Decision 1: Verify by source-tree import scan, not by assumption
Each candidate was confirmed unused by searching the corresponding source tree (`client/src/` and `server/`) for its import specifier. Only packages with zero matches are removed. Packages that are transitively required by a kept package (e.g., MUI's peer deps `@emotion/react`, `@emotion/styled`) are left in place.

**Rationale:** The existing `dependency-hygiene` requirement defines "used" by the presence of an import in the source tree. Matching that definition makes the removal auditable and consistent with the spec.

### Decision 2: Remove npm shims for Node built-ins
`path` and `events` in `server/package.json` are removed. The source imports (`import path from 'path'`, `import { EventEmitter } from 'events'`) already resolve to Node's built-in modules, so the npm packages are redundant.

**Rationale:** These shims are unnecessary, can mask intent, and add install weight. Removing them is safe because the built-in modules are guaranteed by the Node runtime (engine `>=18`).

**Alternatives considered:**
- *Keep them* — no benefit; Node built-ins are always available.

### Decision 3: Keep one package per API and remove duplicates
Keep `react-spring` (used across many survey pages) and remove `@react-spring/web` (never imported). Remove all three `emoji-mart` packages (none imported). Keep `react-helmet` (used in `BodyPartial.jsx`).

**Rationale:** Reduces ambiguity about which package is the real dependency and avoids carrying two packages that could satisfy the same import.

### Decision 4: Move `nodemon` to `devDependencies`
`nodemon` is used only by the `dev` script (`nodemon server.js`). Move it from `dependencies` to `devDependencies` in `server/package.json`. Remove the root-level `nodemon` entirely, since the root's `server:dev` script delegates to `server`'s own `nodemon`.

**Rationale:** `nodemon` is a development-only tool; it should not ship in production installs. The root duplicate is redundant.

### Decision 5: Regenerate lockfiles
After editing each manifest, run `npm install` (or `npm install --package-lock-only`) in the affected workspace to regenerate `package-lock.json` files so they match the manifests.

**Rationale:** Keeping lockfiles in sync prevents drift and ensures CI installs reflect the pruned dependency set.

## Risks / Trade-offs

- **Accidental removal of a used package** → [Risk] A package with a dynamic or non-standard import (e.g., CSS import, webpack loader) might be missed by the scan. → Mitigation: the scan also matched CSS/asset imports (e.g., `flag-icons/css`, `@fontsource/poppins/...`, `rc-slider/assets/index.css`) and React component imports; the verification step re-runs a build/test to confirm nothing breaks.
- **Peer/transitive dependency breakage** → [Risk] Removing a package that another kept package expects at runtime. → Mitigation: peer deps of kept packages (MUI's `@emotion/*`) are retained; a build/test run after removal verifies no runtime resolution errors.
- **Lockfile churn** → [Risk] Regenerating lockfiles can produce large diffs or version bumps. → Mitigation: use `--package-lock-only` where possible to avoid altering installed versions unrelated to the removals.
- **`react-spring` vs `@react-spring/web` confusion** → If a future contributor imports `@react-spring/web`, it will be missing. → Mitigation: the design keeps the package that the code actually imports (`react-spring`); the spec's duplicate-package rule documents the intent.

## Migration Plan

1. Edit `client/package.json` to remove the listed unused dependencies.
2. Edit `server/package.json` to remove unused dependencies and move `nodemon` to `devDependencies`.
3. Edit root `package.json` to remove `nodemon` from `dependencies`.
4. Regenerate `package-lock.json` files in root, `server/`, and `client/`.
5. Run the client build and server test suite to confirm no imports are broken.

**Rollback:** Re-add the removed entries to each manifest and reinstall. No data or schema changes are involved, so rollback is a straightforward manifest revert.

## Open Questions

- None. The removal set was verified against the source trees and the kept set is unambiguous.