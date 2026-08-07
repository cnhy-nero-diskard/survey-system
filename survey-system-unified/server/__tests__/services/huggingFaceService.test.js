import { jest } from '@jest/globals';

jest.unstable_mockModule('../../middleware/logger.js', () => ({
  default: {
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const { queryHuggingFace } = await import('../../services/huggingFaceService.js');

const loadingResponse = () => ({
  json: async () => ({ error: '503 Service Unavailable: model loading' }),
});

describe('queryHuggingFace', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('retries model loading and returns the response when the model becomes available', async () => {
    global.fetch
      .mockResolvedValueOnce(loadingResponse())
      .mockResolvedValueOnce({ json: async () => ({ label: 'positive' }) });

    const resultPromise = queryHuggingFace('text', 'token', 'https://example.test/model', 2);
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(10_000);

    await expect(resultPromise).resolves.toEqual({ label: 'positive' });
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('throws after the configured retry limit', async () => {
    global.fetch.mockResolvedValue(loadingResponse());

    const resultPromise = queryHuggingFace('text', 'token', 'https://example.test/model', 2);
    const rejection = expect(resultPromise).rejects.toThrow(
      'retry limit reached after 2 retries: 503 Service Unavailable'
    );
    await Promise.resolve();
    await jest.advanceTimersByTimeAsync(20_000);

    await rejection;
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('does not retry a non-loading response error', async () => {
    global.fetch.mockResolvedValue({
      json: async () => ({ error: '400 Bad Request' }),
    });

    await expect(
      queryHuggingFace('text', 'token', 'https://example.test/model')
    ).resolves.toEqual({ error: '400 Bad Request' });
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not retry a network failure', async () => {
    const networkError = new Error('network unavailable');
    global.fetch.mockRejectedValue(networkError);

    await expect(
      queryHuggingFace('text', 'token', 'https://example.test/model')
    ).rejects.toThrow('network unavailable');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
