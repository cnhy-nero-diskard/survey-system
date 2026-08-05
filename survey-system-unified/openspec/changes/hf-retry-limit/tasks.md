## 1. Refactor Hugging Face query retry

- [ ] 1.1 Replace the recursive `queryModel()` retry in `server/services/huggingFaceService.js` with an explicit loop that bounds the number of retries on `503 Service Unavailable` (model loading)
- [ ] 1.2 Add an optional `maxRetries` parameter to `queryHuggingFace()` with a sensible default (e.g. 3), keeping existing call sites working
- [ ] 1.3 On retry-limit exhaustion, throw a descriptive error that includes the retry count and the underlying 503 context
- [ ] 1.4 Keep the narrow check so only the model-loading `503 Service Unavailable` condition triggers a retry; other errors and network failures propagate immediately

## 2. Verify implementation

- [ ] 2.1 Confirm existing callers of `queryHuggingFace` (e.g. `server/controllers/adminController.js`) still work without passing `maxRetries`
- [ ] 2.2 Add or update tests covering: model loads within the retry limit, retry limit reached, non-loading error not retried, and network failure not retried
- [ ] 2.3 Run the server test suite and lint to confirm no regressions