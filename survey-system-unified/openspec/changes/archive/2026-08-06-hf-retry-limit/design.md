## Context

The Hugging Face integration lives in `server/services/huggingFaceService.js`, exposing `queryHuggingFace(data, apiToken, modelUrl)`. When the hosted model is cold or loading, Hugging Face returns a `503 Service Unavailable` error. The current implementation responds to that error by waiting ~10 seconds and recursively calling `queryModel()` again with **no upper bound**. If the model never finishes loading, the request hangs indefinitely, tying up the Node.js event loop and never surfacing an error to callers such as `server/controllers/adminController.js`.

The client-side survey submission path (`client/src/components/utils/sendInputUtils.js`) already uses a bounded retry (`maxRetries = 20`), so this change is scoped to the server-side Hugging Face service only.

## Goals / Non-Goals

**Goals:**
- Bound the number of retries for the model-loading `503 Service Unavailable` case so requests always terminate.
- Surface a clear, actionable error to callers once the retry limit is exhausted.
- Keep the existing wait-and-retry behavior for the transient model-loading case.
- Make the retry limit configurable so behavior can be tuned without code changes.

**Non-Goals:**
- Changing the client-side retry logic in `sendInputUtils.js`.
- Introducing backoff strategies beyond the current fixed 10-second wait.
- Retrying other transient errors (e.g., network failures, rate limits) — those remain non-retried.
- Persisting retry state or metrics.

## Decisions

**1. Replace recursion with an explicit loop.**
The current `queryModel()` recurses on a 503, which makes the retry count implicit and easy to lose. An explicit `for`/`while` loop with a counter makes the bound obvious and testable, and avoids stack-growth concerns over many iterations.

**2. Add a configurable `maxRetries` parameter with a default.**
`queryHuggingFace(data, apiToken, modelUrl, maxRetries = 3)` keeps the existing call sites working while allowing any caller to tune the limit. A default of 3 gives a reasonable chance of catching a model that becomes ready shortly after cold start (up to ~30 seconds of waiting) without hanging long-running requests.

**3. Throw a descriptive error on exhaustion.**
When the retry limit is reached, throw an `Error` that includes the retry count and the underlying `503` context, so callers and logs can distinguish "model still loading after N retries" from other failures.

**4. Only retry the model-loading 503 condition.**
Keep the existing, narrow check (`result.error` includes `503 Service Unavailable`) so other errors and network failures propagate immediately, matching the current behavior.

## Risks / Trade-offs

- [A model that is slow to load may still fail after the default limit] → Mitigation: the limit is configurable, and the error message clearly reports the limit so operators can raise it for known slow models.
- [Changing from infinite to bounded retries could surface transient 503s as errors more often] → Mitigation: the default of 3 with a 10s wait covers typical cold-start windows; callers can increase the limit if needed.
- [Introducing a new function parameter touches the function signature] → Mitigation: the parameter is optional with a default, so existing call sites are unaffected.

## Migration Plan

No data or schema changes. Deployment is a code change to `server/services/huggingFaceService.js`. Rollback is a simple revert of that file. No downtime expected.

## Open Questions

- Should the default retry limit and wait interval be exposed via environment configuration rather than a function parameter? If so, a follow-up could wire `maxRetries` from an env var with the function default as fallback.