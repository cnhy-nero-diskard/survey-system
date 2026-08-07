# Refurbishing Prompt Suite

A sequenced set of prompts for de-rusting this codebase with a strong model. Phase 1
(security + correctness) is archived; eleven proposals are queued for implementation.
This suite covers what's left: **maintainability rust**.

## How to use this

- Run prompts **in order**. Later ones assume earlier artifacts exist.
- Each audit prompt is **read-only** and ends in an OpenSpec proposal, not edits.
- Paste one prompt per session. Long audits degrade when they share context with
  unrelated work.
- After each audit, review the proposal before running `/openspec-apply-change`.

---

## Step 0 — Fill the OpenSpec context block (do this first, 5 minutes)

`openspec/config.yaml` still contains the commented-out template. Every proposal
generated so far had no project context to lean on.

> Read `AI_AGENT_README.md`, `README.md`, `docs/audit-2026-08-05-phase-1-verification.md`,
> `server/server.js`, `client/src/App.js`, and both `package.json` files. Then write the
> `context:` block in `openspec/config.yaml`: tech stack with exact versions, the two
> coexisting auth mechanisms, the deployment posture (never deployed — no migration
> constraint), directory conventions, and the domain (tourism survey data collection for
> a thesis). Keep it under 300 words — it is prepended to every artifact prompt, so it
> must be dense, not chatty. Also add `rules:` entries if you see conventions the
> existing proposals in `openspec/changes/` consistently follow.

---

## Step 1 — Establish a safety net BEFORE any refactor

Refactoring 34k lines with ~zero tests is how a thesis codebase becomes a broken thesis
codebase. This is the one step that is not an audit.

> This repo has 34,000 lines of source and effectively no test coverage: only
> `server/__tests__/routes/surveyRoutes.test.js`,
> `server/__tests__/services/surveyService.test.js`, and a CRA placeholder
> `client/src/App.test.js`. I am about to do a large refactor and need a regression net
> first.
>
> Identify the **highest-risk, highest-churn seams** — the code paths where a silent
> behavior change would corrupt survey data or break admin auth. Focus on: the survey
> step-sequencing flow, `server/services/surveyService.js`, `server/utils/crypto.js`
> (encrypt/decrypt round-trip), `server/middleware/authMiddleware.js`,
> `server/middleware/hmacMiddleware.js`, and `server/middleware/anonymousUserMiddleware.js`.
>
> Do not aim for coverage percentages. Propose a **characterization test suite**: tests
> that pin down what the code does _today_, including its quirks, so a refactor that
> changes behavior fails loudly. For each proposed test, state the exact assertion and
> what refactoring mistake it would catch.
>
> Create an OpenSpec change named `characterization-test-baseline` with the proposal,
> design, and tasks. Note explicitly in the design which existing behaviors you believe
> are _bugs_ being pinned — those need separate proposals, not preservation.

---

## Step 2 — Repo hygiene sweep (fast, low-risk, high morale)

> Audit this repo for tracked files that should not be in version control or should not
> exist at all. I already know about some; find the rest and verify each claim with the
> actual file.
>
> Known starting points:
>
> - `client/src copy/` — a tracked duplicate directory containing a stray `survey.jsql`-like
>   `survey.jsx`. Determine whether anything in it is referenced anywhere; if not, it goes.
> - `server/surveymockup1_backend.code-workspace` — tracked editor config.
> - `server/error.log` — check whether it is tracked or only gitignored.
> - `client/build/` — a committed build output directory.
> - `server/certs/server-ca.pem` — confirm whether this is a public CA cert (fine) or
>   anything sensitive (not fine).
> - `server/localization_queries/schemacreation/backups/` — five dated `.sql` dumps
>   (`FEB10SURVEY2.sql`, `FMAR3.sql`, `JAN28SURVEY.sql`, `JAN29SURVEY.sql`,
>   `JAN29SURVEY2.sql`). Decide whether these are history worth keeping in-repo, and if
>   so where they belong.
> - `server/localization_queries/` overall — ~60 loose `.sql` files with no ordering,
>   naming convention, or index. Distinguish one-off queries from schema DDL from seed
>   data.
>
> Also check for: files with names containing spaces, near-duplicate files, orphaned
> assets (`client/src/components/admin/login/Designer.jpg` and `.png` — are both used?),
> and `.env`-family files that are tracked when they should not be.
>
> For each finding give: path, what it is, evidence it is unused/misplaced, and the
> disposition (delete / gitignore / relocate / keep-with-README). Then create an OpenSpec
> change `repo-hygiene-sweep`. Group tasks so that deletions are separable from
> relocations — I want to be able to stop halfway.

---

## Step 3 — Dead code and dependency audit

You have a `dependency-cleanup-2` proposal already; this is the client-side counterpart
and the dead-code half.

> Do a two-part audit. Verify everything against actual imports — do not trust
> `package.json` or my summary.
>
> **Part A — client dependencies.** `client/package.json` has ~50 runtime dependencies for
> a 29k-line CRA app. Specific suspicions to verify, plus find the ones I missed:
>
> - `style-components` — this looks like a typo-squat/mistake alongside the real
>   `styled-components`. Check if anything imports it.
> - `helmet` — a server-side Express library listed as a client dependency (note
>   `react-helmet` is separate and legitimate).
> - `fetch` and `request` — both are obsolete Node HTTP libraries in a browser app.
> - `cra-template` — a scaffolding template that should never be a runtime dep.
> - `poppins` AND `@fontsource/poppins` — duplicate font packages.
> - **Three charting libraries**: `chart.js`/`react-chartjs-2`, `plotly.js`/`react-plotly.js`,
>   and `recharts`, plus `react-heatmap-grid`. Report which components use which, and
>   what consolidating to one would actually cost. `plotly.js` alone is a multi-megabyte
>   bundle.
> - **Two animation libraries**: `framer-motion` and `react-spring`/`@react-spring/web`.
> - Overlapping utilities: `dom-to-image` vs `save-svg-as-png`, `papaparse` vs `xlsx` vs
>   `csv-loader`, `currency-converter-lt`, `countries-list`, `emoji-mart` — is an emoji
>   picker really in a tourism survey?
>
> **Part B — dead code.** Find unreachable and unreferenced code: components never
> imported, exported functions with no callers, commented-out blocks, `console.log`
> debris, unused files under `client/src/pages/` and `client/src/components/`. Be careful
> with dynamic imports, route-string references, and anything reached only via
> `AdminRoutes.jsx`.
>
> Report bundle-size impact where you can estimate it. Create OpenSpec change
> `client-dependency-and-dead-code-cleanup`. Split tasks into "provably unused, safe to
> delete" and "needs a human decision" — never merge those two categories.

---

## Step 4 — Server architecture audit

> Audit the server's internal architecture for layering violations and cohesion problems.
> The shape is `routes/ → controllers/ → services/`, with `middleware/`, `config/`, `utils/`.
>
> Concrete targets:
>
> - `server/services/adminCRUD.js` (1228 lines) and `server/services/analyticsCRUD.js`
>   (1074 lines) — what distinct responsibilities are fused in each? Propose a split along
>   real seams, not arbitrary line counts.
> - `server/controllers/adminController.js` (1151 lines) — how much is business logic that
>   belongs in a service, and how much is HTTP plumbing?
> - The `adminCRUD.js` / `adminService.js` pair and `analyticsCRUD.js` — is the
>   CRUD-vs-Service distinction consistent, or did it drift?
> - SQL placement: is raw SQL confined to the service layer, or does it leak into
>   controllers?
> - Error handling: does every layer use `middleware/errorHandler.js` consistently, or do
>   controllers hand-roll `try/catch` with ad-hoc response shapes? (Cross-check against the
>   queued `error-handler-hardening` proposal — do not duplicate its scope.)
> - Response shape consistency across endpoints: same error envelope everywhere, or per-route
>   improvisation?
> - Transaction boundaries: any multi-statement write that should be in a transaction and
>   isn't? Flag correctness risks separately and loudly.
>
> For each problem give file:line evidence and the refactor that fixes it. Create OpenSpec
> change `server-layering-refactor`. **Order the tasks so each one is independently
> shippable and testable** — no big-bang rewrite. Explicitly list which characterization
> tests from `characterization-test-baseline` must exist before each task is safe.

---

## Step 5 — Client architecture audit

The bigger half of the codebase and almost certainly the rustier one.

> Audit the React client (29,278 lines under `client/src/`) for structural problems.
>
> **API layer.** There isn't one. 29 files import `axios` directly and `localhost:5000`
> appears hardcoded in the source. `client/src/utils/axiosWithLoading.js` exists but is
> apparently not universal. Propose a single API client module: base URL from env, shared
> interceptors, consistent error handling, and a migration path for all 29 call sites.
>
> **God components.** `SurveyMetrics.jsx` (1400), `AiToolsDashboard.jsx` (1078),
> `SurveyTally.jsx` (989), `DataDashboard.jsx` (926), `Sidebar.jsx` (621). For each: what
> are the distinct concerns, and what is the extraction plan (custom hooks for data
> fetching, presentational subcomponents, pure helpers for transforms)?
>
> **State management.** How is server data cached and shared? `globalLoadingStore.js`
> suggests a hand-rolled store. Look for prop drilling, duplicated fetches of the same
> endpoint across components, and `useEffect` fetch patterns missing cleanup or dependency
> correctness.
>
> **Styling.** `styled-components` + `@emotion` + MUI's `sx` + `App.css` +
> `components/utils/styles1.js` (479 lines) + `datamanager/styles/SharedStyles.js` (400) +
> `admin/shared/designTokens.js` + `admin/shared/styledComponents.js`. Map which approach
> is used where and propose one convention with a realistic migration order.
>
> **Survey flow.** `client/src/pages/survey/` has many step components (`Residence1.jsx` 687,
> `AttractionForm.jsx` 627, `PProfile1.jsx` 545, `AccomodationForm.jsx` 536). How much is
> copy-pasted scaffolding that could be a shared step wrapper or a config-driven form?
> Cross-check the `survey-step-sequencing` spec in `openspec/specs/` so the refactor
> preserves specified behavior.
>
> Create OpenSpec change `client-architecture-refactor`. This is large — structure the tasks
> so the API-client extraction lands first (it unblocks everything else), then per-component
> work that can be done one file at a time over weeks.

---

## Step 6 — Tooling and consistency baseline

> This repo has no ESLint config, no Prettier config, and no pre-commit hooks anywhere —
> root, `client/`, or `server/`. The server is ES modules; the client is CRA. Naming is
> inconsistent (`.js` vs `.jsx` for components, `MDashboardOutlet.js` holding a component,
> `piecharttopics.jsx` and `sentiment_heatmap.jsx` in lowercase/snake_case next to
> PascalCase siblings, `surveryperfmetrics` misspelled as a directory name).
>
> Propose a tooling baseline that is **useful rather than aspirational**: a lint config
> whose error set is small enough to actually fix and then keep green, formatting that
> doesn't produce a 34k-line reformat commit that destroys `git blame` (consider
> `.git-blame-ignore-revs`), and a file/directory naming convention with the rename list
> spelled out.
>
> Recommend a specific rollout order: config first, then autofixable rules, then
> hand-fixed rules per directory, then CI enforcement. State what I should do about the
> existing violations — fix all at once, or ratchet.
>
> Create OpenSpec change `tooling-baseline`.

---

## Step 7 — Documentation truth pass

> Audit every doc in this repo against the actual code and report drift. Files:
> `README.md`, `AI_AGENT_README.md`, `server/README.md`, `client/README.md` (likely
> untouched CRA boilerplate), `docs/audit-2026-08-05-phase-1-verification.md`,
> `.clinerules/`, `.cline/`, `.codex/`, `.claude/`.
>
> The Phase 1 audit already caught `AI_AGENT_README.md` falsely claiming "Production MVP —
> currently serving real users." Assume more claims like that survive. Check documented
> env vars against what the code reads (the queued `env-config-truth` proposal covers the
> env side — do not duplicate it, but do flag docs it misses), documented setup commands
> against the actual `package.json` scripts, documented endpoints against
> `server/routes/`, and documented schema against `context/db_template_survey.sql`.
>
> Also: there are four separate AI-assistant config directories (`.claude`, `.cline`,
> `.clinerules`, `.codex`). Report whether they contradict each other and recommend
> consolidation.
>
> Every finding needs the doc line and the contradicting code line. Create OpenSpec change
> `documentation-truth-pass`.

---

## Step 8 — Post-implementation verification

Run this after implementing a batch of proposals. It mirrors the method of
`docs/audit-2026-08-05-phase-1-verification.md`, which is the right template.

> Verify the implemented OpenSpec changes against the actual code, following the exact
> method of `docs/audit-2026-08-05-phase-1-verification.md`: every claim cites file paths
> and line ranges, verified facts are separated from inferences and unknowns, and no
> production code is modified during the audit.
>
> For each change I name: confirm every task in its `tasks.md` is genuinely done (not
> partially done, not done-differently), confirm the delta specs match the shipped
> behavior, and confirm no requirement was silently dropped. Then surface any _new_ risk
> the implementation introduced.
>
> Write the report to `docs/audit-<YYYY-MM-DD>-<phase-name>.md` and tell me which changes
> are ready for `/openspec-archive-change` and which are not, with reasons.

---

## Ordering rationale

| Order               | Why here                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------- |
| 0. Context block    | Improves the output of every prompt after it. Cheapest win in the file.                        |
| 1. Tests            | The only prompt that must precede refactoring. Everything after it is safer with it in place.  |
| 2. Hygiene          | Deleting junk shrinks the surface every later audit has to read.                               |
| 3. Dead code + deps | Same reason, one level deeper. Do not refactor code you're about to delete.                    |
| 4. Server arch      | Smaller (5k LOC), better-specified, and already has some test coverage. Build confidence here. |
| 5. Client arch      | Biggest and rustiest. Do it last, with a net and a clean tree.                                 |
| 6. Tooling          | After the big moves, so the lint baseline isn't invalidated by mass renames.                   |
| 7. Docs             | Last, so the docs describe the refurbished system rather than a moving target.                 |
| 8. Verification     | Repeat after every implementation batch.                                                       |

## Notes

- Steps 2–7 are independent audits; only Step 1 is a hard prerequisite for 4 and 5.
- Steps 4 and 5 will each produce a large change. Consider splitting them into
  per-file changes at proposal time if the task list exceeds ~20 items.
- Keep the eleven queued security/correctness proposals ahead of this suite. Rust is
  cosmetic until the security work lands.
