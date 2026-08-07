---
name: autocmt
description: Autonomously commit and push all uncommitted/unstaged changes to the current branch, split into small coherent meaningful increments, each with a one-line conventional commit message ("committype: message"). Use when the user says "autocmt", "autocommit", "commit everything", "commit and push", or asks to commit the current changes.
allowed-tools: Bash(git:*), Bash(git status), Bash(git add), Bash(git diff), Bash(git commit), Bash(git push), Bash(git branch)
license: MIT
metadata:
  author: user
  version: "1.0"
---

# autocmt — Autonomous commit & push

Commit every uncommitted/unstaged change on the current branch and push, splitting the
work into **meaningful, coherent increments** instead of one giant commit. Every commit
message is a one-liner in the format `committype: (message here)`.

## When to use

- The user says "autocmt", "autocommit", "commit everything", "commit and push", "commit my changes".
- You finished a chunk of work and want a clean, logical, per-increment git history.

## Behavior

### 0. Preliminaries
- Note the current branch: `git branch --show-current`.
- Enumerate every changed, staged, and untracked path:
  `git status --short` and `git diff --stat` (include untracked files too).
- If there is nothing to commit, report "Nothing to commit" and stop.

### 1. Group the changes into coherent increments
Inspect the modified/untracked files and split them into logical chunks by **concern**,
not by file count:
- Files changed together for the same feature or behavior → one chunk.
- A refactor touching related modules → one chunk.
- Docs changes → their own chunk; config/seed data → its own; dependency bumps → its own;
  spec/planning artifacts (e.g. openspec changes) → their own.
- If a single one-line message cannot honestly describe the whole set, it is NOT one chunk.

A good rule of thumb: each chunk must be internally self-consistent and describable in a
single short one-liner.

### 2. Choose a commit type (prefix)
Pick the most specific single type for each chunk:
- `feat:` — new feature or capability
- `fix:` — a bug fix
- `refactor:` — behavior-preserving restructuring
- `style:` — formatting / whitespace only, no logic change
- `perf:` — performance improvement
- `test:` — adding or fixing tests
- `build:` — build system / dependencies / tooling
- `ci:` — CI configuration
- `docs:` — documentation only
- `chore:` — maintenance, config, seed data, archiving housekeeping
- `spec:` — planning/spec artifacts (e.g. openspec changes)

Match the tone of the repo's existing history (lowercase, conventional one-liners).

### 3. Commit each chunk (never all at once when separable)
For each chunk, in dependency order:
- Stage ONLY the files in that chunk: `git add <paths...>`
- Confirm what is staged: `git status --short`
- Commit with a one-liner: `git commit -m "type: message"` — lowercase type, `: `, then a short
  lowercase message, no trailing period. Example: `feat: add response download to survey stats`.
- Move to the next chunk. Do NOT use `git add -A` across unrelated concerns, and do NOT collapse
  separable changes into a single commit.

### 4. Push to the current branch
After all chunks are committed:
- `git push origin <current-branch>`
- If the remote-tracking branch does not exist yet, use `git push -u origin <current-branch>`.
- Report the pushed branch and surface any push errors clearly.

## Output / summary
After finishing, report:
- The current branch.
- Each commit created (type + message).
- Push result / any errors.

## Guardrails
- NEVER create one giant commit when the changes are separable into meaningful chunks.
- Keep every message a single line in `type: message` form; one line only.
- Stage only the files belonging to each chunk — never `git add -A` across unrelated concerns.
- Respect `.gitignore` and `.env`; never commit secrets or ignored files.
- If a chunk is ambiguous or changes are entangled, stop and ask the user instead of guessing.
- If the working tree is clean, say so and do nothing.
