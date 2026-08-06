## Why

The Hugging Face service (`server/services/huggingFaceService.js`) retries infinitely when the model returns a `503 Service Unavailable` error while loading. If the model never finishes loading, a single request can retry forever, hanging the request, consuming resources, and delaying the error from ever reaching the caller.

## What Changes

- Add a configurable maximum retry limit to the Hugging Face model query retry loop in `server/services/huggingFaceService.js`.
- When the retry limit is exceeded, stop retrying and return a clear error mentioning the retry limit was reached.
- Keep the existing behavior of waiting and retrying on `503 Service Unavailable` (model loading) up to the limit.
- Prefer a loop over the current recursive `queryModel()` call so the retry count is explicit and bounded.

## Capabilities

### New Capabilities
- `hf-query-retry`: Bounded retry behavior for Hugging Face model queries, ensuring finite retries on transient `503 Service Unavailable` (model loading) errors with a clear error when the limit is reached.

### Modified Capabilities
<!-- No existing specs change. -->

## Impact

- `server/services/huggingFaceService.js` — add bounded retry logic.
- Callers of `queryHuggingFace` (e.g. `server/controllers/adminController.js`) — now receive a definitive error once the retry limit is exhausted instead of hanging indefinitely.
- No API contract changes; no new dependencies.