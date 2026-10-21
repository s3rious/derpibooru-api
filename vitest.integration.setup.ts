const originalFetch = globalThis.fetch;
const MAX_ATTEMPTS = 5;

// derpibooru.org answers HTTP 429 with Retry-After once a client sends about 10 requests in 10 seconds.
globalThis.fetch = async (input, init) => {
  for (let attempt = 1; ; attempt += 1) {
    const response = await originalFetch(input, init);

    if (response.status !== 429 || attempt === MAX_ATTEMPTS) {
      return response;
    }

    await response.body?.cancel();
    const seconds = Number(response.headers.get('retry-after')) || 10;
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
  }
};
